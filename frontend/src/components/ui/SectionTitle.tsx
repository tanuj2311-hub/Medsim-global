'use client';
import type { LucideIcon } from 'lucide-react';

interface Props {
  icon?: LucideIcon;
  title: string;
  sub?: string;
  color?: string;
}

export function SectionTitle({ icon: Icon, title, sub, color = '#38BDF8' }: Props) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        {Icon && <Icon size={18} color={color} />}
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#E2E8F0', letterSpacing: '-0.3px' }}>{title}</h2>
      </div>
      {sub && <p style={{ margin: 0, fontSize: 13, color: '#64748B', paddingLeft: Icon ? 28 : 0 }}>{sub}</p>}
    </div>
  );
}
