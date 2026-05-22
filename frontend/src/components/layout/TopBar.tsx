'use client';
import { usePathname } from 'next/navigation';
import { RefreshCw, Loader } from 'lucide-react';

const PAGE_NAMES: Record<string, string> = {
  '/dashboard': 'Crisis Dashboard',
  '/mental': 'Mental Health Surveillance',
  '/simulation': 'Simulation Laboratory',
  '/whatif': 'What-If Analysis Center',
  '/heatmap': 'Global Heatmap',
};

interface Props { running: boolean; onRun: () => void; }

export function TopBar({ running, onRun }: Props) {
  const pathname = usePathname();
  const title = PAGE_NAMES[pathname] ?? 'Platform';

  return (
    <div style={{ height: 52, background: 'rgba(4,10,25,0.93)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>{title}</span>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        {running && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#38BDF8' }}>
            <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Simulating…
          </div>
        )}
        <button onClick={onRun} disabled={running}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 8, color: '#38BDF8', fontSize: 12, fontWeight: 600, cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.5 : 1 }}>
          <RefreshCw size={12} /> Re-run
        </button>
      </div>
    </div>
  );
}
