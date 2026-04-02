'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppSelector } from '@/store/hooks';
import { users } from '@/lib/mock-data';
import { Shield, MoreHorizontal, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { Dialog, DialogTitle, DialogContent, DialogActions, Menu, MenuItem, Select } from '@mui/material';
import { Pagination } from '@/components/ui/Pagination';

export default function UsersPage() {
  const { tenant } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();
  
  const [localUsers, setLocalUsers] = useState([...users]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('viewer');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const tenantUsers = localUsers.filter(u => u.tenantId === tenant?.id);
  
  // Paginated View
  const paginatedUsers = tenantUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(tenantUsers.length / itemsPerPage);

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
      showToast(`${selectedUser.name}'s access revoked.`, 'error');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="mobile-stack">
        <p style={{ color: 'var(--text-secondary)' }}>Manage user permissions and team member access.</p>
        <button 
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => setIsDialogOpen(true)}
        >
          <UserPlus size={18} />
          Invite User
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="responsive-table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="table-min-width">
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
              {paginatedUsers.map((user) => (
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
                    Active
                  </td>
                  <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                    <MoreHorizontal 
                      onClick={(e: any) => handleMenuOpen(e, user)} 
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
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        PaperProps={{
          style: { background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', minWidth: '400px' }
        }}
      >
        <DialogTitle style={{ borderBottom: '1px solid var(--border)' }}>Invite Team Member</DialogTitle>
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
            <Select 
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as string)}
              fullWidth
              sx={{ background: 'var(--bg-card)', color: 'var(--text-primary)', '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' } }}
            >
              <MenuItem value="admin">Administrator (Full Access)</MenuItem>
              <MenuItem value="analyst">Security Analyst</MenuItem>
              <MenuItem value="viewer">Viewer (Read Only)</MenuItem>
            </Select>
          </div>
        </DialogContent>
        <DialogActions style={{ borderTop: '1px solid var(--border)', padding: '1rem' }}>
          <button onClick={() => setIsDialogOpen(false)} className="btn btn-outline">Cancel</button>
          <button onClick={handleInviteUser} className="btn btn-primary">Send Invite</button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ style: { background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' } }}
      >
        <MenuItem onClick={handleToggleRole} style={{ fontSize: '0.875rem' }}>Switch Role</MenuItem>
        <MenuItem onClick={handleRevokeAccess} style={{ fontSize: '0.875rem', color: 'var(--risk-high)' }}>Revoke Access</MenuItem>
      </Menu>
    </DashboardLayout>
  );
}
