'use client';

import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppSelector } from '@/store/hooks';
import { incidents } from '@/lib/mock-data';
import Link from 'next/link';
import { Search, ChevronRight, AlertCircle, Clock, CheckCircle2, Download, Plus } from 'lucide-react';
import gsap from 'gsap';
import { useToast } from '@/components/ui/ToastProvider';
import { Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Pagination } from '@/components/ui/Pagination';

export default function IncidentsPage() {
  const { tenant } = useAppSelector((state) => state.auth);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Local state for rendering
  const [localIncidents, setLocalIncidents] = useState([...incidents]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Malware');
  const [newSeverity, setNewSeverity] = useState('high');

  const { showToast } = useToast();

  useEffect(() => {
    if (containerRef.current) {
      const rows = containerRef.current.querySelectorAll('tbody tr');
      gsap.fromTo(rows, 
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [searchTerm, statusFilter, severityFilter, currentPage, localIncidents.length]);

  const filteredIncidents = localIncidents.filter(inc => {
    const isTenantMatch = tenant ? inc.tenantId === tenant.id : true;
    const isSearchMatch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const isStatusMatch = statusFilter === 'all' || inc.status === statusFilter;
    const isSeverityMatch = severityFilter === 'all' || inc.severity === severityFilter;
    
    return isTenantMatch && isSearchMatch && isStatusMatch && isSeverityMatch;
  });

  // Paginated View
  const paginatedIncidents = filteredIncidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'high': return { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--risk-high)' };
      case 'medium': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--risk-medium)' };
      case 'low': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--risk-low)' };
      default: return { bg: 'var(--bg-light)', color: 'var(--text-secondary)' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle size={16} color="var(--risk-high)" />;
      case 'investigating': return <Clock size={16} color="var(--risk-medium)" />;
      case 'resolved': return <CheckCircle2 size={16} color="var(--risk-low)" />;
      default: return <CheckCircle2 size={16} color="var(--text-muted)" />;
    }
  };

  const handleExport = () => {
    if (filteredIncidents.length === 0) {
      showToast('No incidents to export.', 'warning');
      return;
    }
    const headers = ['ID', 'Title', 'Severity', 'Status', 'Category', 'Timestamp'];
    const rows = filteredIncidents.map(inc => [
      inc.id,
      `"${inc.title}"`,
      inc.severity,
      inc.status,
      inc.category,
      inc.timestamp
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'incidents_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    showToast('Export successful!', 'success');
  };

  const handleCreateIncident = () => {
    if (!newTitle) {
      showToast('Please provide an incident title.', 'error');
      return;
    }
    const newInc = {
      id: `INC-${Math.floor(Math.random() * 10000)}`,
      title: newTitle,
      severity: newSeverity as any,
      status: 'open' as any,
      category: newCategory,
      timestamp: new Date().toISOString(),
      tenantId: tenant?.id || 't-1',
      description: 'Manually created incident via dashboard portal.'
    };

    incidents.unshift(newInc);
    setLocalIncidents([newInc, ...localIncidents]);
    setIsDialogOpen(false);
    setNewTitle('');
    showToast(`Incident ${newInc.id} created successfully!`, 'success');
  };

  return (
    <DashboardLayout title="Security Incidents">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }} className="mobile-stack">
        <div style={{ display: 'flex', gap: '1rem', flex: 1 }} className="mobile-stack">
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: '0.625rem 1rem 0.625rem 2.75rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                fontSize: '0.875rem',
                outline: 'none',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as string); setCurrentPage(1); }}
              size="small"
              sx={{ 
                minWidth: 140, 
                background: 'var(--bg-card)', 
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' }
              }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="investigating">Investigating</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>

            <Select 
              value={severityFilter}
              onChange={(e) => { setSeverityFilter(e.target.value as string); setCurrentPage(1); }}
              size="small"
              sx={{ 
                minWidth: 140, 
                background: 'var(--bg-card)', 
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' }
              }}
            >
              <MenuItem value="all">All Severity</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleExport} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} />
            <span className="hide-on-mobile">Export</span>
          </button>
          <button onClick={() => setIsDialogOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            <span>Create Incident</span>
          </button>
        </div>
      </div>

      <div ref={containerRef} className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div className="responsive-table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="table-min-width">
            <thead style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>ID & Title</th>
                <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Severity</th>
                <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Timestamp</th>
                <th style={{ padding: '1.25rem 1rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedIncidents.length > 0 ? (
                paginatedIncidents.map((inc) => (
                  <tr key={inc.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{inc.id}</p>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{inc.title}</p>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <span style={{ 
                        padding: '0.375rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.7rem', 
                        fontWeight: 800,
                        background: getSeverityStyle(inc.severity).bg,
                        color: getSeverityStyle(inc.severity).color
                      }}>
                        {inc.severity.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {getStatusIcon(inc.status)}
                        {inc.status.charAt(0).toUpperCase() + inc.status.slice(1)}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{inc.category}</td>
                    <td style={{ padding: '1.25rem 1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {new Date(inc.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                      <Link href={`/incidents/${inc.id}`} style={{ color: 'var(--text-muted)' }}>
                        <ChevronRight size={20} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '6rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                    <p style={{ fontSize: '1rem', fontWeight: 500 }}>No incidents found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* CREATE INCIDENT DIALOG */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} PaperProps={{ style: { background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', minWidth: '400px' } }}>
        <DialogTitle style={{ borderBottom: '1px solid var(--border)' }}>Create New Incident</DialogTitle>
        <DialogContent style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Incident Title</label>
            <input 
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Category</label>
            <Select 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value as string)}
              fullWidth
              sx={{ background: 'var(--bg-card)', color: 'var(--text-primary)', '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' } }}
            >
              <MenuItem value="Malware">Malware</MenuItem>
              <MenuItem value="Network">Network</MenuItem>
              <MenuItem value="Authentication">Authentication</MenuItem>
              <MenuItem value="Data Leak">Data Leak</MenuItem>
            </Select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Severity</label>
            <Select 
              value={newSeverity} 
              onChange={(e) => setNewSeverity(e.target.value as string)}
              fullWidth
              sx={{ background: 'var(--bg-card)', color: 'var(--text-primary)', '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' } }}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </div>
        </DialogContent>
        <DialogActions style={{ borderTop: '1px solid var(--border)', padding: '1rem' }}>
          <button onClick={() => setIsDialogOpen(false)} className="btn btn-outline">Cancel</button>
          <button onClick={handleCreateIncident} className="btn btn-primary">Create</button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
