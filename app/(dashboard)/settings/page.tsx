'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Shield, Bell, Key, Globe, Layout, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const settingSections = [
  { name: 'Organization Profile', icon: Globe, description: 'Manage your company identity and branding settings.' },
  { name: 'Security Policy', icon: Shield, description: 'Configure global threat detection and threshold protocols.' },
  { name: 'Notifications', icon: Bell, description: 'Set up alert routing and multi-channel notification rules.' },
  { name: 'API Management', icon: Key, description: 'Generate and manage secure access tokens for automation.' },
];

export default function SettingsPage() {
  const { showToast } = useToast();
  
  // State for pending configurations
  const [pendingChanges, setPendingChanges] = useState<string[]>([]);
  
  // Dialog trackers
  const [activeDialog, setActiveDialog] = useState<any>(null);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);

  // Form states mapping (dummy states for demonstration)
  const [localFormData, setLocalFormData] = useState({
    orgName: 'ShieldOS Tenant',
    threatLevel: 'Strict',
    apiRateLimit: '5000'
  });

  const handleOpenSection = (section: any) => {
    setActiveDialog(section);
  };

  const handleSectionClose = () => {
    setActiveDialog(null);
  };

  const handleSectionSave = () => {
    if (activeDialog && !pendingChanges.includes(activeDialog.name)) {
      setPendingChanges([...pendingChanges, activeDialog.name]);
    }
    setActiveDialog(null);
    showToast(`Modified settings for ${activeDialog.name}`, 'info');
  };

  const handleOpenSaveConfirmation = () => {
    if (pendingChanges.length === 0) {
      showToast('No configurations have been modified.', 'warning');
      return;
    }
    setIsConfirmSaveOpen(true);
  };

  const executeSave = () => {
    showToast(`Successfully saved configurations for ${pendingChanges.length} modules!`, 'success');
    setPendingChanges([]);
    setIsConfirmSaveOpen(false);
  };

  const executeDiscard = () => {
    setPendingChanges([]);
    setIsDiscardOpen(false);
    showToast('All unsaved changes have been discarded.', 'error');
  };

  return (
    <DashboardLayout title="Platform Settings">
      <div style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
             <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>General Preferences</h3>
             <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Configure your instance of ShieldOS.</p>
          </div>
          {pendingChanges.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--risk-medium)', fontSize: '0.875rem', fontWeight: 600 }}>
              <AlertTriangle size={16} />
              {pendingChanges.length} Unsaved Changes
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {settingSections.map((section, idx) => (
              <div 
                key={section.name} 
                onClick={() => handleOpenSection(section)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.25rem', 
                  padding: '1.5rem', 
                  borderBottom: idx === settingSections.length - 1 ? 'none' : '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-light)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <section.icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {section.name}
                    {pendingChanges.includes(section.name) && (
                      <span style={{ width: '6px', height: '6px', background: 'var(--risk-medium)', borderRadius: '50%' }}></span>
                    )}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{section.description}</p>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button 
            className="btn btn-outline"
            onClick={() => pendingChanges.length > 0 ? setIsDiscardOpen(true) : showToast('Nothing to discard.', 'info')}
          >
            Discard Changes
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleOpenSaveConfirmation}
          >
            Save Configuration
          </button>
        </div>
      </div>

      {/* SECTION SETTINGS DIALOG */}
      <Dialog 
        open={Boolean(activeDialog)} 
        onClose={handleSectionClose}
        PaperProps={{
          style: { background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', fontFamily: 'var(--font-sans)', minWidth: '400px' }
        }}
      >
        <DialogTitle style={{ borderBottom: '1px solid var(--border)', fontSize: '1.125rem', fontWeight: 600 }}>{activeDialog?.name}</DialogTitle>
        <DialogContent style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activeDialog?.name === 'Organization Profile' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Organization Name</label>
              <input value={localFormData.orgName} onChange={(e) => setLocalFormData({...localFormData, orgName: e.target.value})} type="text" style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
          )}
          {activeDialog?.name === 'Security Policy' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Threat Threshold</label>
              <select value={localFormData.threatLevel} onChange={(e) => setLocalFormData({...localFormData, threatLevel: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', outline: 'none' }}>
                <option value="Strict">Strict (Block all anomalies)</option>
                <option value="Moderate">Moderate (Review required for medium risk)</option>
                <option value="Lenient">Lenient (Log only)</option>
              </select>
            </div>
          )}
          {activeDialog?.name === 'API Management' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Global Rate Limit (requests/min)</label>
              <input value={localFormData.apiRateLimit} onChange={(e) => setLocalFormData({...localFormData, apiRateLimit: e.target.value})} type="number" style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
          )}
          {activeDialog?.name === 'Notifications' && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
               Alert routing matrix is currently locked by system administrator.
            </div>
          )}
        </DialogContent>
        <DialogActions style={{ borderTop: '1px solid var(--border)', padding: '1rem' }}>
          <button onClick={handleSectionClose} className="btn btn-outline">Close</button>
          <button onClick={handleSectionSave} className="btn btn-primary">Apply Locally</button>
        </DialogActions>
      </Dialog>

      {/* CONFIRM SAVE DIALOG */}
      <Dialog 
        open={isConfirmSaveOpen} 
        onClose={() => setIsConfirmSaveOpen(false)}
        PaperProps={{
          style: { background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', fontFamily: 'var(--font-sans)', minWidth: '400px' }
        }}
      >
        <DialogTitle style={{ borderBottom: '1px solid var(--border)', fontSize: '1.125rem', fontWeight: 600 }}>Confirm Platform Sync</DialogTitle>
        <DialogContent style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>You are about to commit breaking configuration changes to the following modules:</p>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             {pendingChanges.map(change => (
               <div key={change} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                 <CheckCircle size={16} color="var(--primary)" />
                 {change}
               </div>
             ))}
          </div>
        </DialogContent>
        <DialogActions style={{ borderTop: '1px solid var(--border)', padding: '1rem' }}>
          <button onClick={() => setIsConfirmSaveOpen(false)} className="btn btn-outline">Cancel</button>
          <button onClick={executeSave} className="btn btn-primary" style={{ background: 'var(--primary)', color: 'white' }}>Confirm Integration</button>
        </DialogActions>
      </Dialog>

      {/* DISCARD DIALOG */}
      <Dialog 
        open={isDiscardOpen} 
        onClose={() => setIsDiscardOpen(false)}
        PaperProps={{
          style: { background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--risk-high)', fontFamily: 'var(--font-sans)', minWidth: '400px' }
        }}
      >
        <DialogTitle style={{ borderBottom: '1px solid var(--border)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--risk-high)' }}>Discard Changes</DialogTitle>
        <DialogContent style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Are you sure you want to discard your local configuration edits? This action guarantees all modified buffers will be wiped.</p>
        </DialogContent>
        <DialogActions style={{ borderTop: '1px solid var(--border)', padding: '1rem' }}>
          <button onClick={() => setIsDiscardOpen(false)} className="btn btn-outline">Go Back</button>
          <button onClick={executeDiscard} className="btn" style={{ background: 'var(--risk-high)', color: 'white' }}>Force Discard</button>
        </DialogActions>
      </Dialog>

    </DashboardLayout>
  );
}
