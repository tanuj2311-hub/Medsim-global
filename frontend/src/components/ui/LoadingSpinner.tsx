'use client';
import { Loader } from 'lucide-react';

export function LoadingSpinner({ message = 'Running simulation…' }: { message?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 16 }}>
      <Loader size={32} color="#38BDF8" style={{ animation: 'spin 1s linear infinite' }} />
      <div style={{ color: '#64748B', fontSize: 14 }}>{message}</div>
    </div>
  );
}
