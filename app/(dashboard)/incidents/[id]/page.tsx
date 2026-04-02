'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppSelector } from '@/store/hooks';
import { incidents } from '@/lib/mock-data';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Tag, AlertTriangle, ShieldCheck, Clock, MessageSquare, FileText, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/ToastProvider';

export default function IncidentDetailPage() {
  const { id } = useParams();
  const { tenant } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const { showToast } = useToast();

  const originalIncident = incidents.find(inc => inc.id === id && inc.tenantId === tenant?.id);
  
  // Local state to track mutations in this session without a database
  const [localIncident, setLocalIncident] = useState(originalIncident);
  
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'System', text: 'System verified anomalous traffic patterns. Potential exfiltration attempt detected.', time: '10 minutes ago', isSystem: true },
    { id: 2, author: 'Bolanle Admin', text: 'Reviewing firewall logs. Blocking source IP as a precaution.', time: '5 minutes ago', isSystem: false },
  ]);

  if (!localIncident) {
    return (
      <DashboardLayout title="Incident Not Found">
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Incident Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We couldn&apos;t find an incident with the ID {id} in your organization&apos;s data.</p>
          <Link href="/incidents" className="btn btn-primary">Back to Incidents</Link>
        </div>
      </DashboardLayout>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'var(--risk-high)';
      case 'medium': return 'var(--risk-medium)';
      case 'low': return 'var(--risk-low)';
      default: return 'var(--text-muted)';
    }
  };

  const handleAcknowledge = () => {
    if (localIncident.status === 'investigating') return;
    const updated = { ...localIncident, status: 'investigating' as any };
    setLocalIncident(updated);
    // Mutate source for routing permanence
    const idx = incidents.findIndex(i => i.id === updated.id);
    if(idx > -1) incidents[idx] = updated;
    showToast('Incident acknowledged. Status changed to Investigating.', 'success');
  };

  const handleTakeAction = () => {
    const updated = { ...localIncident, status: 'resolved' as any };
    setLocalIncident(updated);
    const idx = incidents.findIndex(i => i.id === updated.id);
    if(idx > -1) incidents[idx] = updated;
    showToast('Remediation playbook executed. Incident Resolved.', 'success');
  };

  const handleFalsePositive = () => {
    const updated = { ...localIncident, status: 'closed' as any };
    setLocalIncident(updated);
    const idx = incidents.findIndex(i => i.id === updated.id);
    if(idx > -1) incidents[idx] = updated;
    showToast('Incident re-classified as False Positive and closed.', 'error');
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: 'Bolanle Admin',
      text: commentText,
      time: 'Just now',
      isSystem: false
    };
    setComments([newComment, ...comments]);
    setCommentText('');
    showToast('Investigation update posted.', 'info');
  };

  return (
    <DashboardLayout title={`Incident: ${localIncident.id}`}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/incidents" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} />
          Back to List
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Main Info Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.625rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    background: localIncident.severity === 'high' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: getSeverityColor(localIncident.severity)
                  }}>
                    {localIncident.severity.toUpperCase()} SEVERITY
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <Tag size={16} />
                    {localIncident.category}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{localIncident.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={handleAcknowledge} 
                  disabled={localIncident.status !== 'open'}
                  className="btn btn-outline" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: localIncident.status !== 'open' ? 0.5 : 1, cursor: localIncident.status !== 'open' ? 'not-allowed' : 'pointer' }}
                >
                  <ShieldCheck size={18} />
                  {localIncident.status === 'open' ? 'Acknowledge' : 'Acknowledged'}
                </button>
                <button 
                  onClick={handleTakeAction} 
                  disabled={localIncident.status === 'resolved' || localIncident.status === 'closed'}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: (localIncident.status === 'resolved' || localIncident.status === 'closed') ? 0.5 : 1, cursor: (localIncident.status === 'resolved' || localIncident.status === 'closed') ? 'not-allowed' : 'pointer' }}
                >
                  {localIncident.status === 'resolved' ? <><CheckCircle size={18}/> Resolved</> : 'Take Action'}
                </button>
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--bg-light)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Description</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>{localIncident.description}</p>
            </div>

            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Investigation Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {comments.map(comment => (
                  <div key={comment.id} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: comment.isSystem ? 'var(--bg-light)' : 'var(--primary-light)', color: comment.isSystem ? 'var(--text-muted)' : 'var(--primary)', border: comment.isSystem ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {comment.isSystem ? <MessageSquare size={18} /> : <User size={18} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="card" style={{ padding: '1.25rem', marginBottom: '0.5rem' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{comment.text}</p>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comment.author} • {comment.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                  placeholder="Add a comment or update..."
                  style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'white', outline: 'none' }}
                />
                <button onClick={handlePostComment} className="btn btn-primary" disabled={!commentText.trim()} style={{ opacity: !commentText.trim() ? 0.5 : 1 }}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Metadata Card */}
          <div className="card">
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Incident Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <Clock size={18} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-secondary)', width: '80px' }}>Created</span>
                <span style={{ fontWeight: 600 }}>{new Date(localIncident.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <User size={18} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-secondary)', width: '80px' }}>Assigned</span>
                <span style={{ fontWeight: 600 }}>Bolanle Admin</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <Tag size={18} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-secondary)', width: '80px' }}>Status</span>
                <span style={{ fontWeight: 600, color: localIncident.status === 'open' ? 'var(--risk-high)' : localIncident.status === 'investigating' ? 'var(--risk-medium)' : 'var(--risk-low)' }}>
                  {localIncident.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', margin: '1.5rem 0' }}></div>

            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Evidence & Artifacts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div onClick={() => {
                const blob = new Blob(["TIMESTAMP,SOURCE_IP,DEST_PORT,ACTION\n2026-03-31T10:00:00Z,192.168.1.100,443,BLOCK"], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "FirewallLogs_Mar31.csv";
                a.click();
                showToast('Extracting FirewallLogs_Mar31.csv...', 'info');
              }} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--bg-light)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                <FileText size={18} color="var(--text-muted)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>FirewallLogs_Mar31.csv</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ border: '1px solid rgba(220, 38, 38, 0.1)', background: 'rgba(220, 38, 38, 0.02)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--risk-high)' }}>
               <AlertTriangle size={16} />
              Danger Zone
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Marking an incident as false positive will hide all related telemetry from security reports.</p>
            <button 
              onClick={handleFalsePositive} 
              disabled={localIncident.status === 'closed'}
              className="btn" 
              style={{ width: '100%', fontSize: '0.75rem', color: 'var(--risk-high)', borderColor: 'var(--risk-high)', opacity: localIncident.status === 'closed' ? 0.5 : 1, cursor: localIncident.status === 'closed' ? 'not-allowed' : 'pointer' }}
            >
              {localIncident.status === 'closed' ? 'Closed' : 'Mark False Positive'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
