'use client';
import { useEffect } from 'react';
import { Brain, Heart, Zap, Activity } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { TimelineChart } from '@/components/charts/TimelineChart';
import { useSimulation } from '@/hooks/useSimulation';
import { pct, getSeverityColor } from '@/types';

export default function MentalHealth() {
  const { results, timeline, running, run } = useSimulation();
  useEffect(() => { run(); }, []);
  if (!results) return <AppShell running={false} onRun={run}><div style={{display:'flex',alignItems:'center',justifyContent:'center',height:400,color:'#64748B'}}>Running simulation…</div></AppShell>;

  const m = results.means;
  const factors = [
    { f:'Social Isolation',  s: Math.round(m.anxiety*80+15), c:'#A78BFA' },
    { f:'Economic Pressure', s: Math.round(m.anxiety*70+10), c:'#FCD34D' },
    { f:'Sleep Deprivation', s: Math.round(m.burnout*75+10), c:'#FB923C' },
    { f:'Workload Stress',   s: Math.round(m.burnout*65+10), c:'#F87171' },
    { f:'Healthcare Access', s: Math.round((1-m.quality)*80+5), c:'#F472B6' },
    { f:'Public Panic',      s: Math.round(m.anxiety*100),   c:'#818CF8' },
  ].sort((a,b)=>b.s-a.s);

  const chainNodes = [
    { l:'Disease Outbreak',  v:m.icuOcc*0.8,  c:'#F87171', e:'🦠' },
    { l:'Hospital Overload', v:m.icuOcc,      c:'#FB923C', e:'🏥' },
    { l:'Doctor Burnout',    v:m.burnout,     c:'#FCD34D', e:'👨‍⚕️' },
    { l:'Quality Drop',      v:1-m.quality,   c:'#A78BFA', e:'📉' },
    { l:'Public Anxiety',    v:m.anxiety,     c:'#818CF8', e:'😰' },
    { l:'Mental Crisis',     v:results.probs.mentalCrisis, c:'#F472B6', e:'🧠' },
  ];

  return (
    <AppShell running={running} onRun={run}>
      <div style={{ padding:24, maxWidth:1200, margin:'0 auto', animation:'fadeIn 0.3s ease' }}>
        <SectionTitle icon={Brain} title="Mental Health Surveillance" sub="Psychological stress dynamics, burnout propagation & anxiety cascade modeling" color="#A78BFA" />

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:22 }}>
          <MetricCard label="Mental Stability Index" value={pct(m.mental)}   sub="Population psychological health" icon={Heart}    color={m.mental>0.6?'#34D399':m.mental>0.4?'#FCD34D':'#F87171'} />
          <MetricCard label="Anxiety Propagation"   value={pct(m.anxiety)}  sub="Collective anxiety level"       icon={Zap}     color={getSeverityColor(m.anxiety)}  severity={m.anxiety} />
          <MetricCard label="Burnout Probability"   value={pct(m.burnout)}  sub="Healthcare worker risk"         icon={Activity} color={getSeverityColor(m.burnout)} severity={m.burnout} />
          <MetricCard label="Mental Crisis Risk"    value={pct(results.probs.mentalCrisis)} sub="P(severe mental crisis)" icon={Brain} color={getSeverityColor(results.probs.mentalCrisis)} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:16, marginBottom:18 }}>
          <GlassCard>
            <div style={{ fontSize:13, fontWeight:600, color:'#64748B', marginBottom:14 }}>Psychological Stress Cascade — Projected Trajectory</div>
            <div style={{ display:'flex', gap:14, marginBottom:12, flexWrap:'wrap' }}>
              {[['Anxiety','#A78BFA'],['Burnout','#FB923C'],['Fragility','#F87171'],['Stability','#34D399']].map(([n,c])=>(
                <div key={n} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#64748B' }}>
                  <div style={{ width:20, height:2, background:c }} />{n}
                </div>
              ))}
            </div>
            <TimelineChart data={timeline} keys={['anxiety','burnout','collapse','stability']} colors={['#A78BFA','#FB923C','#F87171','#34D399']} names={['Anxiety','Burnout','Fragility','Stability']} />
          </GlassCard>

          <GlassCard>
            <div style={{ fontSize:13, fontWeight:600, color:'#64748B', marginBottom:16 }}>Risk Contribution Factors</div>
            {factors.map((f,i)=>(
              <div key={i} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:12, color:'#E2E8F0' }}>{f.f}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:f.c }}>{f.s}%</span>
                </div>
                <div style={{ height:5, background:'rgba(56,189,248,0.08)', borderRadius:3 }}>
                  <div style={{ height:'100%', width:`${f.s}%`, background:`linear-gradient(90deg,${f.c}88,${f.c})`, borderRadius:3, transition:'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </GlassCard>
        </div>

        <GlassCard>
          <div style={{ fontSize:13, fontWeight:600, color:'#64748B', marginBottom:20 }}>Healthcare ↔ Mental Health Chain Reaction</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexWrap:'wrap', gap:0 }}>
            {chainNodes.map((node,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center' }}>
                <div style={{ textAlign:'center', padding:'10px 14px', background:`${node.c}10`, border:`1px solid ${node.c}25`, borderRadius:10, minWidth:95 }}>
                  <div style={{ fontSize:18, marginBottom:3 }}>{node.e}</div>
                  <div style={{ fontSize:11, color:'#E2E8F0', fontWeight:600, marginBottom:2 }}>{node.l}</div>
                  <div style={{ fontSize:13, fontWeight:800, color:node.c }}>{(node.v*100).toFixed(0)}%</div>
                </div>
                {i < chainNodes.length-1 && <div style={{ color:'#64748B', fontSize:18, padding:'0 4px' }}>→</div>}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
