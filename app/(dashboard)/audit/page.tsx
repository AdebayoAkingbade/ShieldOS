'use client';

import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { auditLogs } from '@/lib/mock-data';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Filter, Search, Download } from 'lucide-react';
import { Select, MenuItem } from '@mui/material';

export default function AuditTrailPage() {
  const { tenant } = useAppSelector((state) => state.auth);
  const tenantLogs = auditLogs.filter(log => log.tenantId === tenant?.id);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('All');
  const [filterAction, setFilterAction] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');

  const uniqueUsers = Array.from(new Set(tenantLogs.map(l => l.user)));
  const uniqueActions = Array.from(new Set(tenantLogs.map(l => l.category)));

  const filteredLogs = tenantLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = filterUser === 'All' || log.user === filterUser;
    const matchesAction = filterAction === 'All' || log.category === filterAction;
    const matchesSeverity = filterSeverity === 'All' || log.severity === filterSeverity.toLowerCase();
    
    return matchesSearch && matchesUser && matchesAction && matchesSeverity;
  });

  const exportCSV = () => {
    const header = ['Timestamp', 'User', 'Category', 'Action', 'Severity', 'Details'].join(',');
    const rows = filteredLogs.map(l => [
      l.timestamp, 
      l.user, 
      l.category, 
      l.action, 
      l.severity, 
      `"${l.details.replace(/"/g, '""')}"`
    ].join(','));
    
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout title="System Audit Trail">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Immutable Event Log</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Cryptographically secured record of all system modifications, access attempts, and incidents.</p>
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }} onClick={exportCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 250px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search audit details..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem', background: 'var(--bg-light)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '0.8rem', fontFamily: 'var(--font-sans)', outline: 'none' }}
              />
            </div>

            <Select 
              value={filterUser} 
              onChange={(e) => setFilterUser(e.target.value as string)}
              size="small"
              sx={{ minWidth: 150, background: 'var(--bg-light)', color: 'var(--text-primary)', fontSize: '0.8rem', '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' } }}
            >
              <MenuItem value="All">All Users</MenuItem>
              {uniqueUsers.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
            </Select>

            <Select 
              value={filterAction} 
              onChange={(e) => setFilterAction(e.target.value as string)}
              size="small"
              sx={{ minWidth: 150, background: 'var(--bg-light)', color: 'var(--text-primary)', fontSize: '0.8rem', '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' } }}
            >
              <MenuItem value="All">All Actions</MenuItem>
              {uniqueActions.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
            </Select>

            <Select 
              value={filterSeverity} 
              onChange={(e) => setFilterSeverity(e.target.value as string)}
              size="small"
              sx={{ minWidth: 150, background: 'var(--bg-light)', color: 'var(--text-primary)', fontSize: '0.8rem', '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' } }}
            >
              <MenuItem value="All">All Severities</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  {['Timestamp', 'User / Identity', 'Action Type', 'Description', 'Severity'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', cursor: 'pointer' }} className="hover-high-density">
                    <td style={{ padding: '1rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{log.user}</td>
                    <td style={{ padding: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>{log.category} - {log.action}</td>
                    <td style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{log.details}</td>
                    <td style={{ padding: '1rem' }}>
                       <span className={`status-pill status-pill-${log.severity === 'high' ? 'alert' : log.severity === 'medium' ? 'processing' : 'secure'}`}>
                         {log.severity}
                       </span>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No audit logs matched your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
