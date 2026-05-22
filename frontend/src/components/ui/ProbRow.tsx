'use client';
import { sevColor } from '@/lib/utils';

interface Props { label: string; value: number; color?: string; }

export function ProbRow({ label, value, color }: Props) {
  const col = color ?? sevColor(value);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(56,189,248,0.08)' }}>
      <div style={{ flex: 1, fontSize: 13, color: '#E2E8F0' }}>{label}</div>
      <div style={{ width: 110, height: 4, background: 'rgba(56,189,248,0.08)', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${(value * 100).toFixed(0)}%`, background: col, borderRadius: 2, transition: 'width 0.8s ease' }} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: col, minWidth: 44, textAlign: 'right' }}>{(value * 100).toFixed(1)}%</div>
    </div>
  );
}
