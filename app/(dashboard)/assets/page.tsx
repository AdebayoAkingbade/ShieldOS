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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }} className="grid-responsive-metrics">
        <div className="card" style={{ background: 'var(--bg-dark-card)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inventory Volume</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <h4 className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{tenantAssets.length}</h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Nodes</span>
          </div>
        </div>
        <div className={`card ${tenantAssets.filter(a => a.status === 'compromised').length > 0 ? 'threat-pulse-glow threat-high-tint' : ''}`} style={{ background: 'var(--bg-dark-card)', border: tenantAssets.filter(a => a.status === 'compromised').length > 0 ? '1px solid var(--risk-high)' : '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Infected / Compromised</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h4 className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: tenantAssets.filter(a => a.status === 'compromised').length > 0 ? 'var(--risk-high)' : 'inherit' }}>
              {tenantAssets.filter(a => a.status === 'compromised').length}
            </h4>
            {tenantAssets.filter(a => a.status === 'compromised').length > 0 && <span className="status-dot animate-pulse" style={{ backgroundColor: 'var(--risk-high)', width: '8px', height: '8px' }}></span>}
          </div>
        </div>
        <div className="card" style={{ background: 'var(--bg-dark-card)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Hygiene</p>
          <h4 className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--risk-low)' }}>98.4%</h4>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-dark-card)' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={14} /> Managed Entities
          </h3>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sync: Live</span>
        </div>
        <div className="responsive-table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="table-min-width">
            <thead style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.6rem 1rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Asset Identifier</th>
                <th style={{ padding: '0.6rem 1rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>IP / Mesh Address</th>
                <th style={{ padding: '0.6rem 1rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk Score</th>
                <th style={{ padding: '0.6rem 1rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vulns</th>
                <th style={{ padding: '0.6rem 1rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '0.6rem 1rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Last Heartbeat</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssets.map((asset) => (
                <tr key={asset.id} className={`hover-high-density ${asset.status === 'compromised' ? 'threat-high-tint' : ''}`} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}>
                  <td style={{ padding: '0.5rem 1rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                       <span style={{ color: asset.status === 'compromised' ? 'var(--risk-high)' : 'var(--text-muted)' }}>{getIcon(asset.type)}</span>
                       <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{asset.name}</span>
                         <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>ID: {asset.id}</span>
                       </div>
                     </div>
                  </td>
                  <td className="font-mono" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 500 }}>{asset.ipAddress}</td>
                  <td className="font-mono" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 800, color: asset.riskScore > 70 ? 'var(--risk-high)' : asset.riskScore > 30 ? 'var(--risk-medium)' : 'var(--risk-low)' }}>
                    {asset.riskScore}
                  </td>
                  <td className="font-mono" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: asset.vulnerabilitiesCount > 0 ? 'var(--risk-medium)' : 'var(--text-muted)' }}>
                    {asset.vulnerabilitiesCount}
                  </td>
                  <td style={{ padding: '0.5rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div className={asset.status === 'compromised' ? 'status-dot animate-pulse' : ''} style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%',
                        backgroundColor: asset.status === 'compromised' ? 'var(--risk-high)' : 'var(--risk-low)',
                      }}></div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                        {asset.status}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
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

