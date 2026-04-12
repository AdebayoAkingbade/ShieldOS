'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppSelector } from '@/store/hooks';
import { assets } from '@/lib/mock-data';
import { Database, Monitor, Server, ChevronRight, Info, Search, Filter } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';

export default function AssetsPage() {
  const { tenant } = useAppSelector((state) => state.auth);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const tenantAssets = useMemo(() => assets.filter(a => a.tenantId === tenant?.id), [tenant]);
  
  const filteredAssets = useMemo(() => {
    if (!filterType) return tenantAssets;
    return tenantAssets.filter(a => a.type === filterType);
  }, [tenantAssets, filterType]);

  const counts = useMemo(() => ({
    server: tenantAssets.filter(a => a.type === 'server').length,
    endpoint: tenantAssets.filter(a => a.type === 'endpoint').length,
    database: tenantAssets.filter(a => a.type === 'database').length,
  }), [tenantAssets]);

  const getIcon = (type: string, size = 18) => {
    switch (type) {
      case 'server': return <Server size={size} />;
      case 'endpoint': return <Monitor size={size} />;
      case 'database': return <Database size={size} />;
      default: return <Search size={size} />;
    }
  };

  return (
    <DashboardLayout title="Asset Inventory">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
        
        {/* ── TYPE GROUPING CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { type: 'server', label: 'Servers', count: counts.server, color: 'var(--risk-low)' },
            { type: 'endpoint', label: 'Endpoints', count: counts.endpoint, color: 'var(--primary)' },
            { type: 'database', label: 'Databases', count: counts.database, color: 'var(--risk-medium)' },
          ].map(group => (
            <div 
              key={group.type}
              onClick={() => setFilterType(filterType === group.type ? null : group.type)}
              className="card" 
              style={{ 
                padding: '1.25rem', 
                background: filterType === group.type ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-dark-card)',
                border: filterType === group.type ? `1px solid ${group.color}` : '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '8px', 
                background: `${group.color}20`, 
                color: group.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getIcon(group.type, 24)}
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>{group.label}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>{group.count}</h3>
              </div>
              <div style={{ marginLeft: 'auto', opacity: filterType === group.type ? 1 : 0.3 }}>
                 <Filter size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* ── ASSET LIST ── */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-dark-card)' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-light)' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
              {filterType ? `${filterType}s` : 'All Assets'} - {filteredAssets.length}
            </h3>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              Showing {filteredAssets.length} of {tenantAssets.length} nodes
            </div>
          </div>
          
          <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--bg-light)', position: 'sticky', top: 0, zIndex: 5 }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>IP Address</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Risk</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    onClick={() => setSelectedAsset(asset)}
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.1s' }}
                    className="hover-high-density"
                  >
                    <td style={{ padding: '0.75rem 1rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                         <span style={{ color: 'var(--text-muted)' }}>{getIcon(asset.type)}</span>
                         <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{asset.name}</span>
                       </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {asset.ipAddress}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 900, 
                        color: asset.riskScore > 70 ? 'var(--risk-high)' : asset.riskScore > 30 ? 'var(--risk-medium)' : 'var(--risk-low)' 
                      }}>
                        {asset.riskScore}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`status-pill status-pill-${asset.status === 'compromised' ? 'alert' : 'secure'}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── ASSET DETAIL DIALOG ── */}
      <Dialog 
        open={Boolean(selectedAsset)} 
        onClose={() => setSelectedAsset(null)}
        PaperProps={{
          style: { background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', minWidth: '450px' }
        }}
      >
        <DialogTitle style={{ borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {selectedAsset && getIcon(selectedAsset.type, 20)}
          <span>Asset Properties</span>
        </DialogTitle>
        <DialogContent style={{ padding: '1.5rem' }}>
          {selectedAsset && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Display Name</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>{selectedAsset.name}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>IP Address</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-mono)' }}>{selectedAsset.ipAddress}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Criticality</p>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: 800, 
                    margin: 0,
                    color: selectedAsset.riskScore > 70 ? 'var(--risk-high)' : 'var(--risk-low)'
                  }}>
                    {selectedAsset.riskScore > 70 ? 'Critical' : 'Standard'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Status</p>
                  <span className={`status-pill status-pill-${selectedAsset.status === 'compromised' ? 'alert' : 'secure'}`}>
                    {selectedAsset.status}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Last Seen</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{new Date(selectedAsset.lastSeen).toLocaleString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Source Tool</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>LogCenter XDR</p>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-dark-card)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Info size={14} /> Security Context
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>
                  This node is part of the core {selectedAsset.type} tier. All traffic is being monitored for non-standard protocol behavior.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
