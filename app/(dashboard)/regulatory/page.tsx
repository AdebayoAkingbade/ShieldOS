'use client';

import { useAppSelector } from '@/store/hooks';
import { regulatoryFilings, incidents } from '@/lib/mock-data';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UploadCloud, Clock, CheckCircle2, AlertOctagon, FileEdit } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from '@mui/material';

export default function RegulatoryPage() {
  const { tenant } = useAppSelector((state) => state.auth);
  
  const [localFilings, setLocalFilings] = useState(regulatoryFilings);
  const tenantFilings = localFilings.filter(f => f.tenantId === tenant?.id);
  
  // Track selected draft to view
  const drafts = tenantFilings.filter(f => f.status === 'Draft');
  const [selectedFilingId, setSelectedFilingId] = useState<string | null>(drafts.length > 0 ? drafts[0].id : null);
  const selectedFiling = tenantFilings.find(f => f.id === selectedFilingId);

  const [toast, setToast] = useState('');
  const [isNewFilingOpen, setIsNewFilingOpen] = useState(false);
  const [newFilingName, setNewFilingName] = useState('');
  const [newFilingFramework, setNewFilingFramework] = useState('NDPR');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleSaveDraft = () => {
    triggerToast('Draft saved securely to regulatory staging database.');
  };

  const handleSubmitToAuthority = () => {
    if (!selectedFiling) return;
    setLocalFilings(prev => prev.map(f => f.id === selectedFiling.id ? { ...f, status: 'Submitted', progress: 100 } : f));
    triggerToast('Submission sent securely to regulatory portal. Status updated to SUBMITTED.');
    setSelectedFilingId(null);
  };

  const handleStartNewFiling = () => {
    if (!newFilingName) {
      triggerToast('Filing name is required.');
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const newFiling = {
      id: `rf-${Math.random().toString(36).substring(2, 6)}`,
      reportName: newFilingName,
      framework: newFilingFramework,
      deadline: d.toISOString(),
      status: 'Draft' as 'Draft',
      incidentsLinked: [],
      tenantId: tenant?.id || 't1',
      progress: 10
    };
    
    setLocalFilings([newFiling, ...localFilings]);
    setSelectedFilingId(newFiling.id);
    setIsNewFilingOpen(false);
    setNewFilingName('');
    triggerToast(`New ${newFilingFramework} draft created successfully.`);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Submitted') return <CheckCircle2 size={16} color="var(--risk-low)" />;
    if (status === 'Under review') return <Clock size={16} color="var(--risk-medium)" />;
    return <FileEdit size={16} color="var(--text-secondary)" />;
  };

  const calculateDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days + ' days left' : 'Overdue';
  };

  const linkedIncident = selectedFiling?.incidentsLinked?.length ? incidents.find(i => i.id === selectedFiling.incidentsLinked[0]) : null;

  return (
    <DashboardLayout title="Mandatory Regulatory Filings">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem', position: 'relative' }}>
        
        {toast && (
          <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--risk-low)', color: 'white', padding: '1rem', borderRadius: '8px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', fontWeight: 600 }}>
            {toast}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Filing & Breach Context</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Automated workflows for NDPR, BoG CISD, and mandatory authority reporting.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsNewFilingOpen(true)}>
             Start New Filing
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Filings Queue</h3>
            
            {tenantFilings.map(filing => {
               const listLinkedIncident = filing.incidentsLinked.length > 0 ? incidents.find(i => i.id === filing.incidentsLinked[0]) : null;
               const isSelected = selectedFilingId === filing.id;

               return (
                 <div 
                   key={filing.id} 
                   className="card hover-high-density" 
                   onClick={() => setSelectedFilingId(filing.id)}
                   style={{ 
                     padding: '1.25rem', 
                     cursor: 'pointer',
                     borderLeft: filing.status === 'Draft' ? '3px solid var(--risk-high)' : filing.status === 'Submitted' ? '3px solid var(--risk-low)' : '3px solid var(--risk-medium)',
                     border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                     boxShadow: isSelected ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none'
                   }}
                 >
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                     <div>
                       <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>{filing.framework}</span>
                       <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0.25rem 0' }}>{filing.reportName}</h4>
                     </div>
                     <span className="badge" style={{ background: 'var(--bg-light)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {getStatusIcon(filing.status)} {filing.status}
                     </span>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                     <span style={{ fontSize: '0.75rem', fontWeight: 600, color: filing.status === 'Draft' ? 'var(--risk-high)' : 'var(--text-secondary)' }}>
                       Deadline: {calculateDaysLeft(filing.deadline)}
                     </span>
                     <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Progress: {filing.progress}%</span>
                   </div>
                   
                   <div style={{ width: '100%', height: '4px', background: 'var(--bg-light)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: filing.progress + '%', background: filing.status === 'Submitted' ? 'var(--risk-low)' : 'var(--primary)' }} />
                   </div>

                   {listLinkedIncident && (
                     <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-light)', borderRadius: '4px', border: '1px dashed var(--border)' }}>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.25rem' }}>AUTO-POPULATED FROM INCIDENT</p>
                       <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{listLinkedIncident.title}</p>
                     </div>
                   )}
                 </div>
               );
            })}
          </div>

          <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark-card)' }}>
             {selectedFiling ? (
               <>
                 <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Draft Viewer: {selectedFiling.reportName}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Form automatically pre-filled using system telemetry.</p>
                 </div>
                 
                 <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                       <div>
                         <label style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Date of Discovery</label>
                         <input type="text" value={new Date().toISOString().split('T')[0]} readOnly style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-light)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', cursor: 'not-allowed' }} />
                       </div>
                       <div>
                         <label style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Affected Data Categories</label>
                         <div style={{ display: 'flex', gap: '0.5rem' }}>
                           <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--risk-high)' }}>PII</span>
                           <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--risk-high)' }}>Financial</span>
                         </div>
                       </div>
                    </div>

                    <div>
                       <label style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Incident Summary (Generated from SOC Logs)</label>
                       <textarea 
                          readOnly={(selectedFiling.status === 'Submitted')} 
                          rows={4} 
                          style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-light)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', resize: 'none' }} 
                          defaultValue={linkedIncident ? `Automatically imported trace: ${linkedIncident.description}` : 'No direct telemetry mapped. Please manually specify the breach implications.'} 
                        />
                    </div>
                    
                    <div style={{ marginTop: 'auto', padding: '1rem', background: selectedFiling.status === 'Draft' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.12)', border: selectedFiling.status === 'Draft' ? '1px solid var(--primary)' : '1px solid var(--risk-low)', borderRadius: '4px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                       {selectedFiling.status === 'Draft' ? (
                         <>
                           <AlertOctagon size={24} color="var(--primary)" />
                           <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: 0 }}>This filing is currently in Draft mode. Review the telemetry mappings before initiating submission to the designated authority.</p>
                         </>
                       ) : (
                         <>
                           <CheckCircle2 size={24} color="var(--risk-low)" />
                           <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: 0 }}>This filing has been successfully transmitted and locked. Submissions are immutable.</p>
                         </>
                       )}
                    </div>
                 </div>

                 {selectedFiling.status !== 'Submitted' && (
                   <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'var(--bg-card)' }}>
                     <button className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }} onClick={handleSaveDraft}><UploadCloud size={16} /> Save Draft</button>
                     <button className="btn btn-primary" onClick={handleSubmitToAuthority}>Submit to Authority</button>
                   </div>
                 )}
               </>
             ) : (
               <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                 <FileEdit size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                 <p style={{ fontSize: '1rem', fontWeight: 600 }}>No Draft Selected</p>
                 <p style={{ fontSize: '0.8rem' }}>Select a filing from the queue to view its contents.</p>
               </div>
             )}
          </div>

        </div>

      </div>

      {/* Start New Filing Dialog */}
      <Dialog open={isNewFilingOpen} onClose={() => setIsNewFilingOpen(false)} PaperProps={{ style: { background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', minWidth: '400px' } }}>
        <DialogTitle style={{ borderBottom: '1px solid var(--border)' }}>Initiate Regulatory Filing</DialogTitle>
        <DialogContent style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Filing Name / Reference</label>
            <input 
              type="text" value={newFilingName} onChange={(e) => setNewFilingName(e.target.value)} placeholder="e.g. Critical Node Breach 4A"
              style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Framework Authority</label>
            <Select value={newFilingFramework} onChange={(e) => setNewFilingFramework(e.target.value as string)} fullWidth sx={{ background: 'var(--bg-card)', color: 'var(--text-primary)', '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' } }}>
              <MenuItem value="NDPR">NDPR (Nigeria)</MenuItem>
              <MenuItem value="BoG CISD">BoG CISD (Ghana)</MenuItem>
              <MenuItem value="Data Protection Commission">Data Protection Commission</MenuItem>
              <MenuItem value="Acme Bank - Nigeria">Acme Bank - Nigeria</MenuItem>
            </Select>
          </div>
        </DialogContent>
        <DialogActions style={{ borderTop: '1px solid var(--border)', padding: '1rem' }}>
          <button onClick={() => setIsNewFilingOpen(false)} className="btn btn-outline">Cancel</button>
          <button onClick={handleStartNewFiling} className="btn btn-primary">Create Draft</button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
