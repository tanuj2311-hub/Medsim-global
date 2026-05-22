'use client';
import type { LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { sevColor, sevLabel } from '@/lib/utils';

interface Props {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  color?: string;
  severity?: number;
}

export function MetricCard({ label, value, sub, icon: Icon, color = '#38BDF8', severity }: Props) {
  const isCritical = severity !== undefined && severity > 0.7;
  return (
    <GlassCard glow={isCritical} style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</span>
        {Icon && (
          <div style={{ background: `${color}1a`, border: `1px solid ${color}30`, borderRadius: 8, padding: '5px 6px', color, display: 'flex' }}>
            <Icon size={13} />
          </div>
        )}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#64748B' }}>{sub}</div>}
      {severity !== undefined && (
        <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, background: `${sevColor(severity)}18`, padding: '2px 8px', borderRadius: 4, border: `1px solid ${sevColor(severity)}30` }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: sevColor(severity), animation: isCritical ? 'pulse 1s ease infinite' : 'none' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: sevColor(severity), letterSpacing: '0.06em' }}>{sevLabel(severity)}</span>
        </div>
      )}
    </GlassCard>
  );
}
