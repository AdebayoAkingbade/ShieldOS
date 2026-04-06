'use client';

import { useAppSelector } from '@/store/hooks';
import { departmentRisks, incidents } from '@/lib/mock-data';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { Select, MenuItem } from '@mui/material';
import { useState } from 'react';

export default function OversightPage() {
  const { tenant } = useAppSelector((state) => state.auth);
  
  const tenantDepartments = departmentRisks.filter(d => d.tenantId === tenant?.id);
  const tenantIncidents = incidents.filter(i => i.tenantId === tenant?.id);

  const [timeFilter, setTimeFilter] = useState('30');

  // Mock Trend Data
  const baseTrendData = [
    { name: 'Week 1', risk: 65, incidents: 12 },
    { name: 'Week 2', risk: 68, incidents: 15 },
    { name: 'Week 3', risk: 75, incidents: 25 },
    { name: 'Week 4', risk: 71, incidents: 18 },
    { name: 'Current', risk: 85, incidents: 30 },
  ];

  const trendData = baseTrendData.map(d => ({
     name: d.name,
     risk: Math.min(100, Math.floor(d.risk * (timeFilter === '90' ? 1.05 : timeFilter === 'YTD' ? 1.15 : 1))),
     incidents: Math.floor(d.incidents * (timeFilter === '90' ? 2 : timeFilter === 'YTD' ? 4 : 1))
  }));

  return (
    <DashboardLayout title="Executive Risk Oversight">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Organization Health & Exposure</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>High-level telemetry for CISOs, regulators, and risk officers.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <Select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                size="small"
                sx={{ 
                  background: 'var(--bg-light)', 
                  color: 'var(--text-primary)', 
                  fontSize: '0.8rem', 
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' }
                }}
             >
                <MenuItem value="30">Last 30 Days</MenuItem>
                <MenuItem value="90">Last 90 Days</MenuItem>
                <MenuItem value="YTD">Year to Date</MenuItem>
             </Select>
          </div>
        </div>

        {/* Top Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--risk-high)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div>
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Top Risk Vector</p>
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem' }}>Endpoint Malware</h3>
                 <p style={{ fontSize: '0.8rem', color: 'var(--risk-high)', fontWeight: 600, marginTop: '0.2rem' }}>↑ +14% incidence rate</p>
               </div>
               <TrendingUp size={24} color="var(--risk-high)" />
            </div>
          </div>
          
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--risk-medium)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div>
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>SLA Breaches (High Sev)</p>
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem' }}>3 Incidents</h3>
                 <p style={{ fontSize: '0.8rem', color: 'var(--risk-medium)', fontWeight: 600, marginTop: '0.2rem' }}>Missed 1hr containment SLA</p>
               </div>
               <Clock size={24} color="var(--risk-medium)" />
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div>
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Risk Mitigation ROI</p>
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem' }}>$4.2M</h3>
                 <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.2rem' }}>Potential losses prevented</p>
               </div>
               <AlertTriangle size={24} color="var(--primary)" />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          
          {/* Charts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Aggregate Risk Exposure Trend</h3>
              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="riskColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--risk-high)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--risk-high)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px' }} />
                    <Area type="monotone" dataKey="risk" stroke="var(--risk-high)" strokeWidth={3} fillOpacity={1} fill="url(#riskColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Incident Volumes</h3>
              <div style={{ width: '100%', height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'var(--bg-light)' }} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px' }} />
                    <Bar dataKey="incidents" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Department Heatmap */}
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Department Risk Heatmap</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Identified divisions with highest vulnerabilities.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tenantDepartments.sort((a,b) => b.exposureScore - a.exposureScore).map(dept => (
                <div key={dept.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{dept.department}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: dept.exposureScore > 75 ? 'var(--risk-high)' : dept.exposureScore > 40 ? 'var(--risk-medium)' : 'var(--risk-low)' }}>
                      {dept.exposureScore}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--bg-light)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: dept.exposureScore + '%', 
                      background: dept.exposureScore > 75 ? 'var(--risk-high)' : dept.exposureScore > 40 ? 'var(--risk-medium)' : 'var(--risk-low)',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{dept.criticalAssets} critical assets exposed</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
