'use client';

import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { incidents, assets } from '@/lib/mock-data';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  const { tenant } = useAppSelector((state) => state.auth);
  
  const isNg = tenant?.slug === 'acme-bank-ng';

  const tenantIncidents = incidents.filter(inc => inc.tenantId === tenant?.id);
  const tenantAssets   = assets.filter(ast => ast.tenantId === tenant?.id);
  
  const openIncidents = tenantIncidents.filter(inc => inc.status === 'open' || inc.status === 'investigating').length;
  const resolvedIncidents = tenantIncidents.filter(inc => inc.status === 'resolved' || inc.status === 'closed').length;
  const atRiskAssets = tenantAssets.filter(a => a.status === 'compromised' || a.status === 'degraded' || a.riskScore > 50).length;
  const totalAssets = tenantAssets.length;
  const unresolvedHighIncidents = tenantIncidents.filter(
    (inc) => (inc.status === 'open' || inc.status === 'investigating') && inc.severity === 'high'
  ).length;
  
  // Calculate average risk score
  const avgRiskScore = Math.floor(tenantIncidents.reduce((acc, inc) => acc + (inc.riskScore || 0), 0) / (tenantIncidents.filter(i => i.riskScore).length || 1));
  const finalRiskScore = avgRiskScore > 0 ? avgRiskScore : 74; // Fallback to 74 for visual match if none
  const riskLabel = finalRiskScore >= 70 ? 'HIGH RISK' : finalRiskScore >= 40 ? 'ELEVATED RISK' : 'LOW RISK';
  const riskAccent = finalRiskScore >= 70 ? 'var(--risk-high)' : finalRiskScore >= 40 ? 'var(--risk-medium)' : 'var(--risk-low)';
  const exposureRange = isNg ? '₦900M - ₦1.8B' : 'GH₵12M - GH₵24M';
  
  // Chart Mock Data
  const chartData = [
    { name: 'Mon', score: finalRiskScore - 15 },
    { name: 'Tue', score: finalRiskScore - 10 },
    { name: 'Wed', score: finalRiskScore - 5 },
    { name: 'Thu', score: finalRiskScore + 5 },
    { name: 'Fri', score: finalRiskScore },
    { name: 'Sat', score: finalRiskScore + 2 },
    { name: 'Sun', score: finalRiskScore },
  ];

  const complianceData = isNg ? [
    { title: 'Acme Cyber Framework', subtitle: 'Nigeria - Financial', status: 'Non-compliant', color: 'var(--risk-high)', bg: 'rgba(239, 68, 68, 0.1)' },
    { title: 'NDPR', subtitle: 'Nigeria - All sectors', status: 'Non-compliant', color: 'var(--risk-high)', bg: 'rgba(239, 68, 68, 0.1)' },
    { title: 'NITDA', subtitle: 'Nigeria - All sectors', status: 'At risk', color: 'var(--risk-medium)', bg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'ISO 27001:2022', subtitle: 'Global - All sectors', status: 'Compliant', color: 'var(--risk-low)', bg: 'rgba(59, 130, 246, 0.12)' },
    { title: 'PCI DSS v4.0', subtitle: 'Global - Payments', status: 'Non-compliant', color: 'var(--risk-high)', bg: 'rgba(239, 68, 68, 0.1)' },
  ] : [
    { title: 'BoG CISD 2026', subtitle: 'Ghana - Financial', status: 'Non-compliant', color: 'var(--risk-high)', bg: 'rgba(239, 68, 68, 0.1)' },
    { title: 'Ghana Data Protection', subtitle: 'Ghana - All sectors', status: 'Non-compliant', color: 'var(--risk-high)', bg: 'rgba(239, 68, 68, 0.1)' },
    { title: 'Ghana CSA', subtitle: 'Ghana - All sectors', status: 'At risk', color: 'var(--risk-medium)', bg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'ISO 27001:2022', subtitle: 'Global - All sectors', status: 'Compliant', color: 'var(--risk-low)', bg: 'rgba(59, 130, 246, 0.12)' },
    { title: 'PCI DSS v4.0', subtitle: 'Global - Payments', status: 'Non-compliant', color: 'var(--risk-high)', bg: 'rgba(239, 68, 68, 0.1)' },
  ];

  const bannerText = isNg 
    ? "NDPR / Acme Framework - Mandatory reporting deadline active"
    : "BoG CISD - Mandatory reporting deadline active";
    
  // Asset groupings
  const servers = tenantAssets.filter(a => a.type === 'server');
  const endpoints = tenantAssets.filter(a => a.type === 'endpoint');
  const databases = tenantAssets.filter(a => a.type === 'database');
  const metricCards = [
    {
      label: 'OPEN INCIDENTS',
      value: openIncidents,
      meta: `${Math.max(openIncidents, 1)} require your approval`,
      color: 'var(--risk-high)',
    },
    {
      label: 'ASSETS AT RISK',
      value: atRiskAssets,
      meta: `↑ ${Math.max(atRiskAssets, 1)} since last week`,
      color: 'var(--risk-medium)',
    },
    {
      label: 'RESOLVED BY SOC (24H)',
      value: resolvedIncidents,
      meta: 'Avg response: 84 min',
      color: 'var(--risk-low)',
    },
    {
      label: 'TOTAL ASSETS MONITORED',
      value: totalAssets,
      meta: 'Full coverage active',
      color: 'var(--primary)',
    },
  ];

  return (
    <DashboardLayout title="SOC Control Center">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      {/* ── ALERTS BANNER ── */}
      <div style={{ background: '#3b0a0a', border: '1px solid #7f1d1d', borderRadius: '4px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--risk-high)', marginTop: '6px', flexShrink: 0 }} className="threat-pulse-glow" />
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fca5a5', margin: 0 }}>{bannerText}</h4>
            <p style={{ fontSize: '0.75rem', color: '#fecaca', margin: 0, opacity: 0.8 }}>Core banking incident requires regulatory notification. SOC report prepared - awaiting your sign-off.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f87171' }}>13h 42m</span>
          <Link href="/incidents" style={{ color: '#fca5a5', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>Review →</Link>
        </div>
      </div>

      {/* ── TOP METRICS GRID (MATCHING SCREENSHOT 2 EXACTLY) ── */}
      <div className="dashboard-metrics-scroll">
        <div className="dashboard-metrics-board">
          <div className="dashboard-risk-card">
            <p className="dashboard-metric-eyebrow">BUSINESS RISK SCORE</p>

            <div className="dashboard-risk-card__body">
              <h1 className="dashboard-risk-card__value" style={{ color: riskAccent }}>{finalRiskScore}</h1>
              <span className="dashboard-risk-card__status" style={{ color: riskAccent }}>{riskLabel}</span>
              <div className="dashboard-risk-card__meta">
                <p className="dashboard-risk-card__delta" style={{ color: riskAccent }}>↑ 8 pts from last month</p>
                <p className="dashboard-risk-card__support">
                  {Math.max(unresolvedHighIncidents, 1)} unresolved HIGH incidents
                </p>
              </div>
            </div>

            <div className="dashboard-risk-card__footer">
              <div className="dashboard-risk-card__exposure">
                <p className="dashboard-risk-card__exposure-label">Est. exposure</p>
                <p className="dashboard-risk-card__exposure-value">{exposureRange}</p>
              </div>
              <div className="dashboard-risk-card__chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashboardRiskScoreFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={riskAccent} stopOpacity={0.45} />
                        <stop offset="95%" stopColor={riskAccent} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        color: 'var(--text-primary)',
                      }}
                      labelStyle={{ color: 'var(--text-muted)' }}
                    />
                    <XAxis dataKey="name" hide />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke={riskAccent}
                      fillOpacity={1}
                      fill="url(#dashboardRiskScoreFill)"
                      strokeWidth={2.25}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {metricCards.map((metric) => (
            <div key={metric.label} className="dashboard-metric-card">
              <div>
                <h2 className="dashboard-metric-card__value" style={{ color: metric.color }}>
                  {metric.value}
                </h2>
                <p className="dashboard-metric-eyebrow dashboard-metric-card__label">{metric.label}</p>
              </div>
              <p className="dashboard-metric-card__meta" style={{ color: metric.color }}>
                {metric.meta}
              </p>
            </div>
          ))}
        </div>
      </div>


      {/* ── REGULATORY COMPLIANCE ── */}
      <div>
        <h3 className="text-secondary" style={{ marginBottom: '1rem' }}>REGULATORY COMPLIANCE - CLICK ANY FRAMEWORK FOR DETAIL</h3>
        <div className="horizontal-scroll" style={{ width: '100%', overflowX: 'auto' }}>
          {complianceData.map(c => (
            <div key={c.title} className="card" style={{ flex: '0 0 calc(25% - 0.75rem)', minWidth: '300px', padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>{c.title}</h4>
              <p className="text-secondary" style={{ marginTop: '0.5rem', marginBottom: '1.5rem', textTransform: 'none', fontWeight: 400, fontSize: '10px' }}>{c.subtitle}</p>
              <div style={{ display: 'inline-flex', padding: '0.25rem 0.6rem', borderRadius: '3px', background: c.bg, color: c.color, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                {c.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SOC ACTIVITY ── */}
      <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-dark-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>SOC activity - what your team has done</h3>
          <Link href="/incidents" style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none' }}>View full activity →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {tenantIncidents.slice(0, 3).map((inc, i) => (
             <div key={inc.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: inc.severity === 'high' ? 'var(--risk-high)' : inc.severity === 'medium' ? 'var(--risk-medium)' : 'var(--risk-low)', marginTop: '4px', flexShrink: 0 }} />
               <div>
                 <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)', lineHeight: 1.4 }}>{inc.title}</p>
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.3rem 0', fontFamily: 'var(--font-mono)' }}>
                   {new Date(inc.timestamp).toLocaleString()} - {inc.status}
                 </p>
                 {inc.severity === 'high' && i === 0 && (
                   <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>{bannerText.split('-')[0].trim()} §14 - 13h 42m to file</span>
                 )}
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* ── ASSET LISTING ── */}
      {/* <div>
         <h3 style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem' }}>ASSET COVERAGE DEMO</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-dark-card)' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                 <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Servers - {servers.length}</h4>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
                   <thead>
                     <tr>
                       {['Name', 'IP', 'Criticality', 'Status', 'Last Seen', 'Source Tool'].map(h => (
                         <th key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {servers.map(s => (
                       <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600 }}>{s.name}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{s.ipAddress}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: s.criticality === 'High' ? 'var(--risk-high)' : s.criticality === 'Medium' ? 'var(--risk-medium)' : 'var(--risk-low)' }}>{s.criticality}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem' }}>
                           <span className={`status-pill status-pill-${s.status === 'compromised' ? 'alert' : s.status === 'degraded' ? 'processing' : 'secure'}`}>
                             {s.status}
                           </span>
                         </td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{new Date(s.lastSeen).toLocaleTimeString()}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-primary)' }}>{s.sourceTool}</td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-dark-card)' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                 <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Endpoints - {endpoints.length}</h4>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
                   <thead>
                     <tr>
                       {['Name', 'IP', 'Criticality', 'Status', 'Last Seen', 'Source Tool'].map(h => (
                         <th key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {endpoints.map(s => (
                       <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600 }}>{s.name}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{s.ipAddress}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: s.criticality === 'High' ? 'var(--risk-high)' : s.criticality === 'Medium' ? 'var(--risk-medium)' : 'var(--risk-low)' }}>{s.criticality}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem' }}>
                           <span className={`status-pill status-pill-${s.status === 'compromised' ? 'alert' : s.status === 'degraded' ? 'processing' : 'secure'}`}>
                             {s.status}
                           </span>
                         </td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{new Date(s.lastSeen).toLocaleTimeString()}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-primary)' }}>{s.sourceTool}</td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-dark-card)' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                 <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Databases - {databases.length}</h4>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
                   <thead>
                     <tr>
                       {['Name', 'IP', 'Criticality', 'Status', 'Last Seen', 'Source Tool'].map(h => (
                         <th key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {databases.map(s => (
                       <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600 }}>{s.name}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{s.ipAddress}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: s.criticality === 'High' ? 'var(--risk-high)' : s.criticality === 'Medium' ? 'var(--risk-medium)' : 'var(--risk-low)' }}>{s.criticality}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem' }}>
                           <span className={`status-pill status-pill-${s.status === 'compromised' ? 'alert' : s.status === 'degraded' ? 'processing' : 'secure'}`}>
                             {s.status}
                           </span>
                         </td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{new Date(s.lastSeen).toLocaleTimeString()}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-primary)' }}>{s.sourceTool}</td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>

         </div>
      </div> */}

    </div>
    </DashboardLayout>
  );
}
