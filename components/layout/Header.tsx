'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { switchTenant } from '@/store/authSlice';
import { tenants } from '@/lib/mock-data';
import { Bell, Search, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/authSlice';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useToast } from '@/components/ui/ToastProvider';
import { useTheme } from '@/components/Providers';

type HeaderProps = {
  title: string;
  onToggleSidebar: () => void;
  showMenuButton: boolean;
};

export function Header({ title, onToggleSidebar, showMenuButton }: HeaderProps) {
  const { tenant } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const handleSwitch = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    if (value === 'logout') {
      dispatch(logout());
      router.push('/login');
      return;
    }
    const nextTenant = tenants.find(t => t.id === value);
    if (nextTenant) {
      dispatch(switchTenant(nextTenant));
      showToast(`Switched workspace to ${nextTenant.name}`, 'success');
    }
  };

  return (
    <header
      className="header-bar"
      style={{
        height: '64px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 55,
        width: '100%',
        marginLeft: 0,
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          aria-label="Open navigation"
          onClick={onToggleSidebar}
          className="mobile-menu-button"
          style={{
            display: showMenuButton ? 'inline-flex' : 'none',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Menu size={18} />
        </button>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{title}</h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = 'var(--primary-light)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Select
          value={tenant?.id || tenants[0].id}
          onChange={handleSwitch}
          size="small"
          displayEmpty
          sx={{
            minWidth: 160,
            color: 'var(--text-primary)',
            background: 'var(--bg-dark)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            fontWeight: 500,
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--border)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--text-muted)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary)',
            },
            '.MuiSvgIcon-root': {
              fill: 'var(--text-secondary)',
            }
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                '& .MuiMenuItem-root:hover': {
                  bgcolor: 'rgba(255,255,255,0.05)',
                },
                '& .Mui-selected': {
                  bgcolor: 'var(--primary-light) !important',
                  color: 'var(--primary)',
                }
              }
            }
          }}
        >
          {tenants.map(t => (
            <MenuItem key={t.id} value={t.id} sx={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
              {t.name}
            </MenuItem>
          ))}
          <MenuItem 
            value="logout" 
            sx={{ 
              color: 'var(--risk-high)', 
              borderTop: '1px solid var(--border)', 
              mt: 1, 
              display: 'flex', 
              gap: '0.5rem',
              fontFamily: 'var(--font-sans)', 
              fontSize: '0.875rem' 
            }}
          >
            <LogOut size={16} /> Logout
          </MenuItem>
        </Select>

        <div onClick={() => showToast('Opening global search index...', 'info')} style={{ color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.color='var(--text-primary)'} onMouseLeave={(e)=>e.currentTarget.style.color='var(--text-muted)'}>
          <Search size={20} />
        </div>
        
        <div onClick={() => showToast('You have 3 unread alerts.', 'warning')} style={{ position: 'relative', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.color='var(--text-primary)'} onMouseLeave={(e)=>e.currentTarget.style.color='var(--text-muted)'}>
          <Bell size={20} />
          <span style={{ 
            position: 'absolute', 
            top: '-2px', 
            right: '-2px', 
            width: '8px', 
            height: '8px', 
            background: 'var(--risk-high)', 
            borderRadius: '50%',
            border: '2px solid var(--bg-card)'
          }}></span>
        </div>
      </div>
    </header>
  );
}
