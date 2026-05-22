'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Play, FlaskConical, Cpu, Brain, Globe, BarChart2, Shield, ArrowRight } from 'lucide-react';
import { runMonteCarlo, DEFAULT_PARAMS } from '@/lib/montecarlo';
import { GlassCard } from '@/components/ui/GlassCard';
import { sevColor } from '@/lib/utils';
import type { SimulationResult } from '@/types';

export default function LandingPage() {
  const router = useRouter();
  const [counter, setCounter] = useState({ sims: 0, hospitals: 0, countries: 0, vars: 0 });
  const [preview, setPreview] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const targets = { sims: 2847391, hospitals: 12480, countries: 194, vars: 847 };
    let step = 0;
    const t = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / 60, 3);
      setCounter({ sims: Math.floor(targets.sims * ease), hospitals: Math.floor(targets.hospitals * ease), countries: Math.floor(targets.countries * ease), vars: Math.floor(targets.vars * ease) });
      if (step >= 60) clearInterval(t);
    }, 33);
    setTimeout(() => setPreview(runMonteCarlo(DEFAULT_PARAMS, 2000)), 300);
    return () => clearInterval(t);
  }, []);

  const features = [
    { icon: Cpu, color: '#38BDF8', title: 'Monte Carlo Engine', desc: '10,000+ probabilistic iterations using Gaussian & Poisson distributions for stochastic healthcare modeling.' },
    { icon: Activity, color: '#818CF8', title: 'Chain Reaction Model', desc: 'Disease → overload → burnout → anxiety → hospitalization — fully interconnected feedback loops.' },
    { icon: Brain, color: '#A78BFA', title: 'Mental Health Layer', desc: 'Anxiety propagation, burnout probability, and social isolation impact modeled in real time.' },
    { icon: Globe, color: '#34D399', title: 'Scenario Analysis', desc: 'Pandemic surges, staffing crises, supply failures, and optimal response presets.' },
    { icon: BarChart2, color: '#FCD34D', title: 'Statistical Outputs', desc: 'Confidence intervals, p90 bounds, probability distributions, and crisis severity indexing.' },
    { icon: FlaskConical, color: '#F472B6', title: 'Simulation Lab', desc: 'Tune 14 variables across healthcare, mental health, and crisis parameters live.' },
  ];

  const previewMetrics = preview ? [
    { l: 'ICU Occupancy', v: preview.means.icuOcc },
    { l: 'Burnout Risk', v: preview.means.burnout },
    { l: 'Anxiety Level', v: preview.means.anxiety },
    { l: 'Collapse Prob.', v: preview.means.collapse },
    { l: 'Mental Stability', v: preview.means.mental },
    { l: 'Quality Score', v: preview.means.quality },
  ] : [];

  return (
    <div style={{ minHeight: '100vh', background: '#020817', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient BG */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 600, height: 600, background: 'radial-gradient(circle,rgba(56,189,248,0.04) 0%,transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 500, height: 500, background: 'radial-gradient(circle,rgba(129,140,248,0.05) 0%,transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(56,189,248,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.025) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid rgba(56,189,248,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#38BDF8,#818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={16} color="white" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#E2E8F0' }}>MEDSIM<span style={{ color: '#38BDF8' }}>GLOBAL</span></span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => router.push('/simulation')} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(56,189,248,0.1)', borderRadius: 8, color: '#64748B', fontSize: 13, cursor: 'pointer' }}>Simulation Lab</button>
            <button onClick={() => router.push('/auth/login')} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(56,189,248,0.1)', borderRadius: 8, color: '#64748B', fontSize: 13, cursor: 'pointer' }}>Sign In</button>
            <button onClick={() => router.push('/dashboard')} style={{ padding: '8px 18px', background: 'linear-gradient(135deg,rgba(56,189,248,0.2),rgba(129,140,248,0.15))', border: '1px solid rgba(56,189,248,0.4)', borderRadius: 8, color: '#38BDF8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Launch Platform →</button>
          </div>
        </div>

        {/* Hero */}
        <div style={{ padding: '80px 0 60px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 20, padding: '5px 14px', marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', animation: 'pulse 1.5s ease infinite' }} />
            <span style={{ fontSize: 12, color: '#38BDF8', fontWeight: 600, letterSpacing: '0.05em' }}>MONTE CARLO ENGINE ACTIVE</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px,6vw,70px)', fontWeight: 900, margin: '0 0 20px', lineHeight: 1.05, letterSpacing: '-2px' }}>
            <span style={{ background: 'linear-gradient(135deg,#E2E8F0 40%,#64748B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Healthcare Crisis</span><br />
            <span style={{ background: 'linear-gradient(135deg,#38BDF8,#818CF8,#A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Simulation Intelligence</span>
          </h1>
          <p style={{ fontSize: 17, color: '#64748B', maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.7 }}>
            A probabilistic Monte Carlo platform modeling hospital overload, mental health deterioration, healthcare worker burnout, and systemic cascade failures.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'linear-gradient(135deg,rgba(56,189,248,0.25),rgba(129,140,248,0.2))', border: '1px solid rgba(56,189,248,0.45)', borderRadius: 12, color: '#E2E8F0', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              <Play size={16} /> Launch Crisis Dashboard
            </button>
            <button onClick={() => router.push('/simulation')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(56,189,248,0.1)', borderRadius: 12, color: '#64748B', fontSize: 15, cursor: 'pointer' }}>
              <FlaskConical size={16} /> Open Simulation Lab
            </button>
          </div>
        </div>

        {/* Counters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 60 }}>
          {([['sims','Simulations Run','#38BDF8'],['hospitals','Hospital Nodes','#818CF8'],['countries','Countries Modeled','#A78BFA'],['vars','Variables Tracked','#34D399']] as const).map(([k,l,c]) => (
            <GlassCard key={k} style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: c, fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>{counter[k].toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>{l}</div>
            </GlassCard>
          ))}
        </div>

        {/* Features */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#E2E8F0', margin: '0 0 8px' }}>Simulation Architecture</h2>
            <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>Six interconnected modules modeling healthcare system dynamics</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
            {features.map((f, i) => (
              <GlassCard key={i} style={{ padding: 22, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ background: `${f.color}15`, border: `1px solid ${f.color}25`, borderRadius: 10, padding: 10, color: f.color, flexShrink: 0 }}><f.icon size={18} /></div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Live preview */}
        {preview && (
          <GlassCard glow style={{ marginBottom: 60, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', animation: 'pulse 1.5s ease infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#FCD34D' }}>Live Simulation Preview — Default Parameters ({preview.n.toLocaleString()} iterations)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 12 }}>
              {previewMetrics.map((m, i) => (
                <div key={i} style={{ textAlign: 'center', padding: 14, background: 'rgba(56,189,248,0.04)', borderRadius: 10, border: '1px solid rgba(56,189,248,0.08)' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: sevColor(m.v), marginBottom: 4 }}>{(m.v * 100).toFixed(0)}%</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{m.l}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '20px 0 80px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', background: 'linear-gradient(135deg,#38BDF8,#818CF8)', border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            Enter the Platform <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
