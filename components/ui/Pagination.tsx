'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--border)' }}>
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        style={{ 
          background: 'none', 
          border: '1px solid var(--border)', 
          borderRadius: '4px', 
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.3 : 1,
          color: 'var(--text-primary)'
        }}
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            minWidth: '32px',
            height: '32px',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            background: page === currentPage ? 'var(--primary)' : 'transparent',
            color: page === currentPage ? 'white' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {page}
        </button>
      ))}

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        style={{ 
          background: 'none', 
          border: '1px solid var(--border)', 
          borderRadius: '4px', 
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.3 : 1,
          color: 'var(--text-primary)'
        }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
