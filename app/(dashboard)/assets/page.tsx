'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppSelector } from '@/store/hooks';
import { assets } from '@/lib/mock-data';
import { Database, Monitor, Server, Cloud, Globe } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';

export default function AssetsPage() {
  const { tenant } = useAppSelector((state) => state.auth);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const tenantAssets = assets.filter(a => a.tenantId === tenant?.id);
  
  // Paginated View
  const paginatedAssets = tenantAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(tenantAssets.length / itemsPerPage);

  const getIcon = (type: string) => {
    switch (type) {
      case 'server': return <Server size={18} />;
      case 'endpoint': return <Monitor size={18} />;
      case 'cloud': return <Cloud size={18} />;
      default: return <Globe size={18} />;
    }
  };

  return (
    <DashboardLayout title="Asset Inventory">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }} className="grid-responsive-metrics">
        <div className="card">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Assets</p>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{tenantAssets.length}</h4>
        </div>
        <div className="card">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Compromised</p>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--risk-high)' }}>
            {tenantAssets.filter(a => a.status === 'compromised').length}
          </h4>
        </div>
        <div className="card">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Active Coverage</p>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--risk-low)' }}>98.4%</h4>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="responsive-table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="table-min-width">
            <thead style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Asset Name</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>IP Address</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssets.map((asset) => (
                <tr key={asset.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>
                       {getIcon(asset.type)}
                       {asset.name}
                     </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', textTransform: 'capitalize' }}>{asset.type}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{asset.ipAddress}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      background: asset.status === 'compromised' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: asset.status === 'compromised' ? 'var(--risk-high)' : 'var(--risk-low)'
                    }}>
                      {asset.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {new Date(asset.lastSeen).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </DashboardLayout>
  );
}
