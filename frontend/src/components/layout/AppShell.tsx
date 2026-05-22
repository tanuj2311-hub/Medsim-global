'use client';
import { ReactNode } from 'react';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';

interface Props { children: ReactNode; running: boolean; onRun: () => void; }

export function AppShell({ children, running, onRun }: Props) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020817' }}>
      <SideNav />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar running={running} onRun={onRun} />
        <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}
