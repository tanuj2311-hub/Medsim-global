export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const pct = (v: number, d = 1) => `${(v * 100).toFixed(d)}%`;
export const pct0 = (v: number) => `${(v * 100).toFixed(0)}%`;
export const sevColor = (v: number) => v > 0.7 ? '#F87171' : v > 0.5 ? '#FB923C' : v > 0.3 ? '#FCD34D' : '#34D399';
export const sevLabel = (v: number) => v > 0.7 ? 'CRITICAL' : v > 0.5 ? 'HIGH' : v > 0.3 ? 'MODERATE' : 'LOW';
export const darkTooltipStyle = {
  contentStyle: { background: '#080f24', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: '#64748B' },
  itemStyle: { color: '#E2E8F0' },
};
