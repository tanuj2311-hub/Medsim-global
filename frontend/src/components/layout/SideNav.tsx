'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, Brain, FlaskConical, Target, Map, BarChart2, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', icon: Activity, label: 'Crisis Dashboard' },
  { href: '/mental', icon: Brain, label: 'Mental Health' },
  { href: '/simulation', icon: FlaskConical, label: 'Simulation Lab' },
  { href: '/whatif', icon: Target, label: 'What-If Analysis' },
  { href: '/heatmap', icon: Map, label: 'Global Heatmap' },
];

export function SideNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div style={{ width: 220, minHeight: '100vh', background: 'rgba(4,10,25,0.97)', borderRight: '1px solid rgba(56,189,248,0.1)', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
      {/* Logo */}
      <div onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', marginBottom: 16, cursor: 'pointer' }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#38BDF8,#818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity size={14} color="white" />
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#E2E8F0', letterSpacing: '-0.3px' }}>
          MEDSIM<span style={{ color: '#38BDF8' }}>GL</span>
        </span>
      </div>

      <div style={{ fontSize: 10, color: '#334155', letterSpacing: '0.1em', fontWeight: 700, padding: '0 12px', marginBottom: 6 }}>MODULES</div>

      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <button key={href} onClick={() => router.push(href)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: active ? 'rgba(56,189,248,0.1)' : 'transparent', border: `1px solid ${active ? 'rgba(56,189,248,0.28)' : 'transparent'}`, borderRadius: 10, color: active ? '#38BDF8' : '#64748B', fontSize: 13, fontWeight: active ? 600 : 400, cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s' }}>
            <Icon size={15} />{label}
          </button>
        );
      })}

      {/* Status */}
      <div style={{ marginTop: 'auto', padding: '12px', borderTop: '1px solid rgba(56,189,248,0.08)' }}>
        <div style={{ fontSize: 11, color: '#334155', marginBottom: 3 }}>Monte Carlo Engine</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', animation: 'pulse 2s ease infinite' }} />
          <span style={{ fontSize: 11, color: '#34D399', fontWeight: 600 }}>Active · 2,000 iter/run</span>
        </div>
        <button onClick={() => router.push('/')} style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748B', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          <LogOut size={11} /> Sign out
        </button>
      </div>
    </div>
  );
}
