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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1rem' }} className="md:grid-cols-3">
        <div className="card" style={{ background: 'var(--bg-dark-card)' }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inventory Volume</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
            <h4 className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 900 }}>{tenantAssets.length}</h4>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>NODES</span>
          </div>
        </div>
        <div className={`card ${tenantAssets.filter(a => a.status === 'compromised').length > 0 ? 'threat-high-tint' : ''}`} style={{ background: 'var(--bg-dark-card)', borderLeft: tenantAssets.filter(a => a.status === 'compromised').length > 0 ? '3px solid var(--risk-high)' : '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Infected / Compromised</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <h4 className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 900, color: tenantAssets.filter(a => a.status === 'compromised').length > 0 ? 'var(--risk-high)' : 'inherit' }}>
              {tenantAssets.filter(a => a.status === 'compromised').length}
            </h4>
            {tenantAssets.filter(a => a.status === 'compromised').length > 0 && <span className="status-dot animate-pulse" style={{ backgroundColor: 'var(--risk-high)', width: '6px', height: '6px' }}></span>}
          </div>
        </div>
        <div className="card" style={{ background: 'var(--bg-dark-card)' }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Hygiene</p>
          <h4 className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--risk-low)' }}>98.4%</h4>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-dark-card)' }}>
        <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Database size={12} /> Managed Entities
          </h3>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800 }}>SYNC: LIVE</span>
        </div>
        <div className="responsive-table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="table-min-width">
            <thead style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.5rem 0.75rem', fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Identifier</th>
                <th style={{ padding: '0.5rem 0.75rem', fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mesh Address</th>
                <th style={{ padding: '0.5rem 0.75rem', fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk</th>
                <th style={{ padding: '0.5rem 0.75rem', fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vulns</th>
                <th style={{ padding: '0.5rem 0.75rem', fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '0.5rem 0.75rem', fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Heartbeat</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssets.map((asset) => (
                <tr key={asset.id} className={`hover-high-density log-row-${asset.status === 'compromised' ? 'alert' : 'secure'}`} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}>
                  <td style={{ padding: '0.4rem 0.75rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <span style={{ color: asset.status === 'compromised' ? 'var(--risk-high)' : 'var(--text-muted)' }}>{getIcon(asset.type)}</span>
                       <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-primary)' }}>{asset.name}</span>
                         <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{asset.id}</span>
                       </div>
                     </div>
                  </td>
                  <td className="font-mono" style={{ padding: '0.4rem 0.75rem', fontSize: '0.7rem', color: 'var(--text-primary)', fontWeight: 600 }}>{asset.ipAddress}</td>
                  <td className="font-mono" style={{ padding: '0.4rem 0.75rem', fontSize: '0.7rem', fontWeight: 900, color: asset.riskScore > 70 ? 'var(--risk-high)' : asset.riskScore > 30 ? 'var(--risk-medium)' : 'var(--risk-low)' }}>
                    {asset.riskScore}
                  </td>
                  <td className="font-mono" style={{ padding: '0.4rem 0.75rem', fontSize: '0.7rem', color: asset.vulnerabilitiesCount > 0 ? 'var(--risk-medium)' : 'var(--text-muted)', fontWeight: 700 }}>
                    {asset.vulnerabilitiesCount}
                  </td>
                  <td style={{ padding: '0.4rem 0.75rem' }}>
                    <span className={`status-pill status-pill-${asset.status === 'compromised' ? 'alert' : 'secure'}`}>
                      {asset.status === 'compromised' && <span className="status-dot animate-pulse" style={{ background: 'currentColor', width: '4px', height: '4px', position: 'static' }}></span>}
                      {asset.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.4rem 0.75rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {new Date(asset.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
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

