'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Zap, Plus, MoreVertical, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { Dialog, DialogTitle, DialogContent, DialogActions, Menu, MenuItem } from '@mui/material';
import { Pagination } from '@/components/ui/Pagination';

const defaultIntegrations = [
  { name: 'CrowdStrike Falcon', provider: 'CrowdStrike', status: 'connected', type: 'EDR' },
  { name: 'Palo Alto Networks', provider: 'PANW', status: 'connected', type: 'Firewall' },
  { name: 'Azure Active Directory', provider: 'Microsoft', status: 'connected', type: 'Auth' },
  { name: 'Splunk Enterprise', provider: 'Splunk', status: 'disconnected', type: 'SIEM' },
];

export default function IntegrationsPage() {
  const { showToast } = useToast();
  const [localIntegrations, setLocalIntegrations] = useState([...defaultIntegrations]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  
  // Available tools mock
  const [availableTools] = useState([
    { name: 'AWS CloudTrail', provider: 'AWS', type: 'SIEM' },
    { name: 'Datadog Agent', provider: 'Datadog', type: 'Monitoring' },
    { name: 'Okta Identity', provider: 'Okta', type: 'Auth' },
  ]);

  const [managedIntegration, setManagedIntegration] = useState<any>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Paginated View
  const paginatedIntegrations = localIntegrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(localIntegrations.length / itemsPerPage);

  // Menu anchors
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

  const handleConnect = (tool: any) => {
    if (localIntegrations.find(i => i.name === tool.name)) {
      showToast(`${tool.name} is already connected.`, 'warning');
      return;
    }
    const newIntegration = { ...tool, status: 'connected' };
    setLocalIntegrations([newIntegration, ...localIntegrations]);
    setIsDialogOpen(false);
    showToast(`Connected: ${tool.name}`, 'success');
  };

  const handleOpenManage = (int: any) => {
    setManagedIntegration(int);
    setIsManageDialogOpen(true);
  };

  const handleSaveManage = () => {
    setIsManageDialogOpen(false);
    showToast(`Configuration updated for ${managedIntegration.name}`, 'success');
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>, int: any) => {
    setMenuAnchorEl(e.currentTarget);
    setSelectedIntegration(int);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedIntegration(null);
  };

  const handleDisconnect = () => {
    if (selectedIntegration) {
      setLocalIntegrations(localIntegrations.filter(i => i.name !== selectedIntegration.name));
      showToast(`${selectedIntegration.name} disconnected.`, 'error');
    }
    handleMenuClose();
  };

  const handlePauseTelemetry = () => {
    if (selectedIntegration) {
      setLocalIntegrations(localIntegrations.map(i => i.name === selectedIntegration.name ? {...i, status: 'paused'} : i));
      showToast(`Telemetry paused for ${selectedIntegration.name}`, 'warning');
    }
    handleMenuClose();
  };

  return (
    <DashboardLayout title="Platform Integrations">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="mobile-stack">
        <p style={{ color: 'var(--text-secondary)' }}>Connect and manage your security tool telemetry sources.</p>
        <button 
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus size={18} />
          Add Integration
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {paginatedIntegrations.map((int) => (
          <div key={int.name} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius)', background: 'var(--bg-light)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Zap size={24} color={int.status === 'connected' ? 'var(--primary)' : int.status === 'paused' ? 'var(--risk-medium)' : 'var(--text-muted)'} />
               </div>
               <div style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, background: int.status === 'connected' ? 'rgba(59, 130, 246, 0.12)' : int.status === 'paused' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(148, 163, 184, 0.1)', color: int.status === 'connected' ? 'var(--risk-low)' : int.status === 'paused' ? 'var(--risk-medium)' : 'var(--text-muted)' }}>
                 {int.status.toUpperCase()}
               </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{int.name}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{int.type} Infrastructure</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <span onClick={() => handleOpenManage(int)} style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Manage</span>
              <button onClick={(e) => handleMenuOpen(e, int)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <MoreVertical size={16} color="var(--text-muted)" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* CATALOG DIALOG */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        PaperProps={{
          style: { background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', minWidth: '500px' }
        }}
      >
        <DialogTitle style={{ borderBottom: '1px solid var(--border)' }}>Integration Catalog</DialogTitle>
        <DialogContent style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Select a source to securely route telemetry data.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {availableTools.map(tool => (
               <div key={tool.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <LinkIcon size={16} color="var(--text-muted)" />
                   <div>
                     <h5 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{tool.name}</h5>
                     <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tool.type} · {tool.provider}</p>
                   </div>
                 </div>
                 <button onClick={() => handleConnect(tool)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                   Connect
                 </button>
               </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions style={{ borderTop: '1px solid var(--border)', padding: '1rem' }}>
          <button onClick={() => setIsDialogOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>Close Catalog</button>
        </DialogActions>
      </Dialog>
      
      {/* MANAGE SETTINGS DIALOG */}
      <Dialog 
        open={isManageDialogOpen} 
        onClose={() => setIsManageDialogOpen(false)}
        PaperProps={{ style: { background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', minWidth: '400px' } }}
      >
        <DialogTitle style={{ borderBottom: '1px solid var(--border)' }}>Configure {managedIntegration?.name}</DialogTitle>
        <DialogContent style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>API Primary Key</label>
            <input type="password" placeholder="••••••••••••••••" style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Webhook Endpoint</label>
            <input type="text" defaultValue="https://api.ostec.local/webhook/receiver" style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', cursor: 'not-allowed' }} disabled />
          </div>
        </DialogContent>
        <DialogActions style={{ borderTop: '1px solid var(--border)', padding: '1rem' }}>
          <button onClick={() => setIsManageDialogOpen(false)} className="btn btn-outline">Cancel</button>
          <button onClick={handleSaveManage} className="btn btn-primary">Save Changes</button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ style: { background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' } }}
      >
        <MenuItem onClick={handlePauseTelemetry} style={{ fontSize: '0.875rem', color: 'var(--risk-medium)' }}>Pause Telemetry</MenuItem>
        <MenuItem onClick={handleDisconnect} style={{ fontSize: '0.875rem', color: 'var(--risk-high)' }}>Disconnect Tool</MenuItem>
      </Menu>
    </DashboardLayout>
  );
}
