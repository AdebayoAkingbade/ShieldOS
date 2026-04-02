'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppSelector } from '@/store/hooks';
import { users } from '@/lib/mock-data';
import { Shield, MoreHorizontal, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { Dialog, DialogTitle, DialogContent, DialogActions, Menu, MenuItem } from '@mui/material';

export default function UsersPage() {
  const { tenant } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();
  
  const [localUsers, setLocalUsers] = useState([...users]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('viewer');

  const tenantUsers = localUsers.filter(u => u.tenantId === tenant?.id);

  // Menu Anchors
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleInviteUser = () => {
    if (!newUserEmail || !newUserName) {
      showToast('Name and Email are required.', 'error');
      return;
    }
    
    const newUser = {
      id: `u-${Math.random().toString(36).substring(2, 6)}`,
      email: newUserEmail,
      name: newUserName,
      role: newUserRole as any,
      tenantId: tenant?.id || 't-1'
    };

    users.push(newUser);
    setLocalUsers([...localUsers, newUser]);
    setIsDialogOpen(false);
    setNewUserEmail('');
    setNewUserName('');
    showToast(`Invitation sent to ${newUserEmail}!`, 'success');
  };

  const handleMenuOpen = (e: React.MouseEvent<SVGSVGElement>, user: any) => {
    setMenuAnchorEl(e.currentTarget as any);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedUser(null);
  };

  const handleRevokeAccess = () => {
    if (selectedUser) {
      setLocalUsers(localUsers.filter(u => u.id !== selectedUser.id));
      showToast(`${selectedUser.name}'s access revoked forever.`, 'error');
    }
    handleMenuClose();
  };

  const handleToggleRole = () => {
    if (selectedUser) {
      const newRole = selectedUser.role === 'admin' ? 'viewer' : 'admin';
      setLocalUsers(localUsers.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
      showToast(`${selectedUser.name} role switched to ${newRole.toUpperCase()}.`, 'info');
    }
    handleMenuClose();
  };

  return (
    <DashboardLayout title="Access Management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Manage user permissions and team member access for {tenant?.name}.</p>
        <button 
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => setIsDialogOpen(true)}
        >
          <UserPlus size={18} />
          Invite User
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Administrator</th>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</th>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>System Role</th>
              <th style={{ padding: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Last Active</th>
              <th style={{ padding: '1.25rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {tenantUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {user.id}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-light)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    <Shield size={14} />
                    {user.role.toUpperCase()}
                  </div>
                </td>
                <td style={{ padding: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Now
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                  <MoreHorizontal 
                    onClick={(e) => handleMenuOpen(e, user)} 
                    size={20} 
                    color="var(--text-muted)" 
                    style={{ cursor: 'pointer' }} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INVITE DIALOG */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        PaperProps={{
          style: {
            background: 'var(--bg-dark)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-sans)',
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle style={{ borderBottom: '1px solid var(--border)', fontSize: '1.125rem', fontWeight: 600 }}>Invite Team Member</DialogTitle>
        <DialogContent style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Full Name</label>
            <input 
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="e.g. John Doe"
              style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="john@example.com"
              style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Access Role</label>
            <select 
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', outline: 'none' }}
            >
              <option value="admin">Administrator (Full Access)</option>
              <option value="analyst">Security Analyst (Read/Write Alerts)</option>
              <option value="viewer">Viewer (Read Only)</option>
            </select>
          </div>
        </DialogContent>
        <DialogActions style={{ borderTop: '1px solid var(--border)', padding: '1rem' }}>
          <button onClick={() => setIsDialogOpen(false)} className="btn btn-outline">Cancel</button>
          <button onClick={handleInviteUser} className="btn btn-primary">Send Invite</button>
        </DialogActions>
      </Dialog>

      {/* USER OPTIONS MENU */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: { background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }
        }}
      >
        <MenuItem onClick={handleToggleRole} style={{ fontSize: '0.875rem', fontFamily: 'var(--font-sans)' }}>Switch Role Context</MenuItem>
        <MenuItem onClick={handleRevokeAccess} style={{ fontSize: '0.875rem', color: 'var(--risk-high)', fontFamily: 'var(--font-sans)' }}>Revoke Access</MenuItem>
      </Menu>

    </DashboardLayout>
  );
}
