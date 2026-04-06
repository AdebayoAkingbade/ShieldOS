'use client';

import { useAppSelector } from '@/store/hooks';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState, useMemo } from 'react';
import { ShieldCheck, AlertCircle, Clock, ChevronRight, Download, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

// Mock Section Data for granular compliance viewing
const frameworkSections: Record<string, any[]> = {
  'BoG CISD 2026': [
    { id: 'CISD §6', req: 'Mandatory incident reporting', incident: 'Customer data exported to unknown IP', severity: 'HIGH', date: 'Apr 3, 07:14', status: 'Triggered', action: 'Review report →' },
    { id: 'CISD §4', req: 'Board governance review', incident: 'Quarterly review overdue', severity: 'MED', date: 'Due Apr 15', status: 'Overdue', action: 'View board report →' },
    { id: 'CISD §9', req: 'MFA on privileged accounts', incident: '14 accounts without MFA', severity: 'MED', date: 'Apr 3', status: 'Triggered', action: 'Approve action →' },
    { id: 'CISD §12', req: '24/7 SOC monitoring', incident: null, severity: null, date: null, status: 'Clear', action: 'Ostec SOC active' },
    { id: 'CISD §18', req: 'Cyber recovery plan', incident: null, severity: null, date: null, status: 'Clear', action: 'Tested Mar 2026' },
  ],
  'Ghana Data Protection': [
    { id: 'GDPA §27', req: 'Data processing register', incident: 'Unregistered third-party API detected', severity: 'HIGH', date: 'Apr 1', status: 'Triggered', action: 'Update register →' },
    { id: 'GDPA §32', req: 'Security of personal data', incident: null, severity: null, date: null, status: 'Clear', action: 'Encryption active' },
  ],
  'Acme Cyber Framework': [
    { id: 'ACME §2.1', req: 'Cyber Risk Governance', incident: 'Strategic plan update pending', severity: 'MED', date: 'Due Apr 10', status: 'Overdue', action: 'Review plan ->' },
    { id: 'ACME §4.3', req: 'Incident Response Reporting', incident: 'Unauthorized access attempt', severity: 'HIGH', date: 'Apr 4', status: 'Triggered', action: 'File report ->' },
    { id: 'ACME §5.8', req: 'Digital Literacy Training', incident: null, severity: null, date: null, status: 'Clear', action: '85% complete' },
  ],
  'NDPR': [
    { id: 'NDPR 2.10', req: 'Data Protection Audit', incident: 'Annual audit report pending', severity: 'HIGH', date: 'Due Mar 31', status: 'Overdue', action: 'Finalize report →' },
    { id: 'NDPR 3.1', req: 'Data Privacy Policy', incident: null, severity: null, date: null, status: 'Clear', action: 'Policy published' },
  ]
};

export default function CompliancePage() {
  const { tenant } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();
  const isNg = tenant?.slug === 'acme-bank-ng';

  const defaultFrameworks = isNg 
    ? ['Acme Cyber Framework', 'NDPR', 'NITDA', 'ISO 27001:2022', 'PCI DSS v4.0']
    : ['BoG CISD 2026', 'Ghana Data Protection', 'Ghana CSA', 'ISO 27001:2022', 'PCI DSS v4.0'];

  const [activeTab, setActiveTab] = useState(defaultFrameworks[0]);

  const sections = useMemo(() => frameworkSections[activeTab] || [
    { id: 'REQ-01', req: 'Standard Control Implementation', incident: null, severity: null, date: null, status: 'Clear', action: 'Compliant' },
    { id: 'REQ-02', req: 'Continuous Monitoring', incident: null, severity: null, date: null, status: 'Clear', action: 'Active' },
  ], [activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Triggered': return 'var(--risk-high)';
      case 'Overdue': return 'var(--risk-medium)';
      case 'Clear': return 'var(--risk-low)';
      default: return 'var(--text-muted)';
    }
  };

  const orgName = isNg ? 'Acme Bank - Nigeria' : 'Bank of Ghana';
  const orgFullName = isNg ? 'Acme Bank - Nigeria' : 'Bank of Ghana'; // As per screenshot text style
  const sectorLabel = isNg ? 'Nigeria . Financial sector . Mandatory for all commercial banks' : 'Ghana . Financial sector . Mandatory for all banks, SDIs, payment systems and fintechs';

  const handleDownloadReport = () => {
    showToast(`Preparing ${activeTab} compliance report...`, 'success');
    
    setTimeout(() => {
      const timestamp = new Date().toLocaleString();
      const reportContent = `--- SHIELD OS COMPLIANCE REPORT ---
Generated: ${timestamp}
Tenant: ${tenant?.name}
Framework: ${activeTab}
Overall Score: 58%
Status: NON-COMPLIANT

DETAILED STATUS:
${sections.map(s => `[${s.id}] ${s.req} - STATUS: ${s.status.toUpperCase()} ${s.incident ? `(Linked Incident: ${s.incident})` : ''}`).join('\n')}

RECOMMENDED ACTIONS:
1. Review the regulatory incident report prepared by the SOC for the data exfiltration event.
2. Schedule board cyber risk review before April 15.
3. Approve SOC action to enable MFA on 14 privileged accounts.

--- END OF REPORT ---`;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab.replace(/\s+/g, '_')}_Report.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 1000);
  };

  return (
    <DashboardLayout title="Regulatory Compliance">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 120px)', // Fit in page, no scroll
        gap: '1rem',
        overflow: 'hidden'
      }}>
        
        {/* ── FRAMEWORK TABS ── */}
        <div style={{ 
          display: 'flex', 
          gap: '2px', 
          background: 'var(--border)', 
          padding: '2px', 
          borderRadius: '4px',
          overflowX: 'auto',
          flexShrink: 0
        }}>
          {defaultFrameworks.map(f => (
            <button
              key={f}
              onClick={() => setActiveTab(f)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: activeTab === f ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-dark-card)',
                border: 'none',
                color: activeTab === f ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                minWidth: '160px',
                transition: 'all 0.2s',
                borderBottom: activeTab === f ? '2px solid var(--primary)' : '2px solid transparent'
              }}
            >
              {f}
              <span style={{ 
                fontSize: '0.6rem', 
                padding: '0.1rem 0.4rem', 
                borderRadius: '10px', 
                background: f === 'ISO 27001:2022' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: f === 'ISO 27001:2022' ? 'var(--risk-low)' : 'var(--risk-high)',
                fontWeight: 800
              }}>
                {f === 'ISO 27001:2022' ? 'Compliant' : 'Non-compliant'}
              </span>
            </button>
          ))}
        </div>

        {/* ── SELECTED FRAMEWORK HEADER ── */}
        <div className="card" style={{ 
          padding: '1.5rem', 
          background: 'var(--bg-dark-card)', 
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              {isNg ? 'Acme Bank - Nigeria - Cyber Security Framework 2026' : 'Bank of Ghana - Cyber & Information Security Directive 2026'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{sectorLabel}</span>
              <span style={{ 
                padding: '0.2rem 0.5rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: 'var(--risk-high)', 
                fontSize: '0.7rem', 
                fontWeight: 800,
                borderRadius: '4px'
              }}>Non-compliant</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--risk-high)', margin: 0 }}>58%</h3>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Controls Triggered</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', margin: 0 }}>9 of 20 sections</p>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}
              onClick={handleDownloadReport}
            >
              Prepare {isNg ? 'Acme' : 'BoG'} Report {'->'}
            </button>
          </div>
        </div>

        {/* ── COMPLIANCE TABLE ── */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-dark-card)', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--bg-light)', position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Section</th>
                  <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Requirement</th>
                  <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Linked Incident</th>
                  <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{row.id}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{row.req}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>Institutions must maintain or contract a 24/7 SOC with SIEM capability.</p>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {row.incident ? (
                        <>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{row.incident}</p>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.3rem', borderRadius: '2px', background: row.severity === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: row.severity === 'HIGH' ? 'var(--risk-high)' : 'var(--risk-medium)', fontWeight: 800 }}>{row.severity}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{row.date}</span>
                          </div>
                        </>
                      ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: getStatusColor(row.status), fontSize: '0.75rem', fontWeight: 800 }}>
                        {row.status === 'Clear' ? <ShieldCheck size={14} /> : row.status === 'Overdue' ? <Clock size={14} /> : <AlertCircle size={14} />}
                        {row.status.toUpperCase()}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: row.status === 'Clear' ? 'var(--text-muted)' : 'var(--risk-high)', cursor: 'pointer' }}>
                      {row.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── RECOMMENDED ACTIONS FOOTER ── */}
        <div className="card" style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', flexShrink: 0 }}>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Recommended Actions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 900 }}>1.</span>
              <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-primary)' }}>
                Review the regulatory incident report prepared by the SOC for the data exfiltration event - deadline applies.
                <br />
                <span style={{ fontSize: '0.7rem', color: 'var(--risk-high)', fontWeight: 700 }}>Report ready - 13h 42m to deadline ({isNg ? 'ACME §4.3' : 'CISD §6'})</span>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 900 }}>2.</span>
              <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-primary)' }}>
                Schedule board cyber risk review before April 15. Board report is ready on the Board Reports page.
                <br />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{isNg ? 'ACME §2.1' : 'CISD §4'} - Board governance obligation</span>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 900 }}>3.</span>
              <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-primary)' }}>
                Approve SOC action to enable MFA on 14 privileged accounts - 2 hours, no service disruption.
                <br />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{isNg ? 'Acme Access Control' : 'CISD §9'} - Access control compliance gap</span>
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>Last assessed: 3 Apr 2026, 08:47 WAT</p>
        </div>

      </div>
    </DashboardLayout>
  );
}
