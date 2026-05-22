'use client';
import { useEffect, useState } from 'react';
import { Map } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useSimulation } from '@/hooks/useSimulation';

const REGIONS = [
  { name:'North America', x:18, y:28, risk:0.38, pop:580 },
  { name:'South America', x:28, y:58, risk:0.52, pop:434 },
  { name:'Western Europe', x:46, y:22, risk:0.29, pop:400 },
  { name:'Eastern Europe', x:54, y:20, risk:0.44, pop:290 },
  { name:'Middle East',    x:57, y:35, risk:0.61, pop:250 },
  { name:'South Asia',     x:67, y:36, risk:0.72, pop:1900 },
  { name:'East Asia',      x:78, y:28, risk:0.45, pop:1600 },
  { name:'SE Asia',        x:78, y:45, risk:0.58, pop:680 },
  { name:'Sub-Saharan Africa', x:50, y:55, risk:0.79, pop:1100 },
  { name:'North Africa',   x:48, y:32, risk:0.55, pop:246 },
  { name:'Oceania',        x:83, y:68, risk:0.22, pop:43 },
];

const riskColor = (r: number) => r > 0.7 ? '#F87171' : r > 0.5 ? '#FB923C' : r > 0.35 ? '#FCD34D' : '#34D399';

export default function Heatmap() {
  const { results, running, run } = useSimulation();
  const [hovered, setHovered] = useState<typeof REGIONS[0] | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => { run(); }, []);
  useEffect(() => {
    const t = setInterval(() => setPulse(p => (p + 1) % 100), 50);
    return () => clearInterval(t);
  }, []);

  return (
    <AppShell running={running} onRun={run}>
      <div style={{ padding:24, maxWidth:1200, margin:'0 auto', animation:'fadeIn 0.3s ease' }}>
        <SectionTitle icon={Map} title="Global Healthcare Stress Heatmap" sub="Regional crisis pressure, ICU stress, and mental health instability overlays" color="#38BDF8" />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:16 }}>
          {/* Map */}
          <GlassCard style={{ padding:0, overflow:'hidden', position:'relative' }}>
            <div style={{ position:'relative', width:'100%', paddingBottom:'55%', background:'linear-gradient(135deg,#020817,#050f28)', overflow:'hidden' }}>
              {/* Grid lines */}
              <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.15 }} viewBox="0 0 100 55">
                {[10,20,30,40,50,60,70,80,90].map(x=><line key={x} x1={x} y1="0" x2={x} y2="55" stroke="#38BDF8" strokeWidth="0.1"/>)}
                {[10,20,30,40,50].map(y=><line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#38BDF8" strokeWidth="0.1"/>)}
              </svg>
              {/* Region nodes */}
              <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 100 55">
                {REGIONS.map((r,i) => {
                  const radius = Math.sqrt(r.pop/1900)*3 + 1.5;
                  const col = riskColor(r.risk);
                  const animRadius = radius + Math.sin((pulse/100)*Math.PI*2 + i)*0.8;
                  return (
                    <g key={r.name} style={{ cursor:'pointer' }} onMouseEnter={() => setHovered(r)} onMouseLeave={() => setHovered(null)}>
                      <circle cx={r.x} cy={r.y} r={animRadius+2} fill={col} opacity={0.08} />
                      <circle cx={r.x} cy={r.y} r={animRadius} fill={col} opacity={0.25} />
                      <circle cx={r.x} cy={r.y} r={radius*0.5} fill={col} opacity={0.9} />
                    </g>
                  );
                })}
                {/* Connection lines */}
                {REGIONS.slice(0,-1).map((r,i) => (
                  <line key={i} x1={r.x} y1={r.y} x2={REGIONS[i+1].x} y2={REGIONS[i+1].y}
                    stroke="rgba(56,189,248,0.08)" strokeWidth="0.3" />
                ))}
              </svg>
              {/* Tooltip */}
              {hovered && (
                <div style={{ position:'absolute', top:8, left:8, background:'rgba(4,10,25,0.95)', border:'1px solid rgba(56,189,248,0.2)', borderRadius:10, padding:'10px 14px', fontSize:12, backdropFilter:'blur(10px)' }}>
                  <div style={{ fontWeight:700, color:'#E2E8F0', marginBottom:4 }}>{hovered.name}</div>
                  <div style={{ color:'#64748B' }}>Risk Level: <span style={{ color:riskColor(hovered.risk), fontWeight:600 }}>{(hovered.risk*100).toFixed(0)}%</span></div>
                  <div style={{ color:'#64748B' }}>Population: <span style={{ color:'#38BDF8' }}>{hovered.pop}M</span></div>
                </div>
              )}
              {/* Legend */}
              <div style={{ position:'absolute', bottom:8, right:8, display:'flex', flexDirection:'column', gap:4 }}>
                {[['Critical >70%','#F87171'],['High 50–70%','#FB923C'],['Moderate 35–50%','#FCD34D'],['Low <35%','#34D399']].map(([l,c])=>(
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:6, fontSize:10, color:'#64748B' }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:c as string }} />{l}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Region list */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <GlassCard style={{ padding:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Regional Risk Index</div>
              {[...REGIONS].sort((a,b)=>b.risk-a.risk).map((r,i)=>(
                <div key={r.name} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid rgba(56,189,248,0.06)', cursor:'pointer' }}
                  onMouseEnter={() => setHovered(r)} onMouseLeave={() => setHovered(null)}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:riskColor(r.risk), flexShrink:0, animation: r.risk>0.7 ? 'pulse 1.5s ease infinite' : 'none' }} />
                  <div style={{ flex:1, fontSize:12, color: hovered?.name===r.name ? '#E2E8F0' : '#94A3B8' }}>{r.name}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:riskColor(r.risk) }}>{(r.risk*100).toFixed(0)}%</div>
                </div>
              ))}
            </GlassCard>

            {results && (
              <GlassCard glow style={{ padding:16 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Global Simulation State</div>
                {[['Avg Collapse Risk', results.means.collapse],['Mental Instability', 1-results.means.mental],['System Burnout', results.means.burnout]].map(([l,v])=>(
                  <div key={l as string} style={{ marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:11, color:'#64748B' }}>{l as string}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:riskColor(v as number) }}>{((v as number)*100).toFixed(0)}%</span>
                    </div>
                    <div style={{ height:4, background:'rgba(56,189,248,0.08)', borderRadius:2 }}>
                      <div style={{ height:'100%', width:`${((v as number)*100).toFixed(0)}%`, background:riskColor(v as number), borderRadius:2 }} />
                    </div>
                  </div>
                ))}
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
