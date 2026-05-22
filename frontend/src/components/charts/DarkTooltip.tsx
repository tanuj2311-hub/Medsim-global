'use client';

interface TooltipProps { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string; }

export function DarkTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#080f24', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: '#64748B', marginBottom: 6, fontSize: 11 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ color: '#64748B' }}>{p.name}:</span>
          <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{p.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}
