'use client';
import { useEffect } from 'react';
import { Activity, Siren, AlertTriangle, Users, Shield, Package, Brain } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { ProbRow } from '@/components/ui/ProbRow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { TimelineChart } from '@/components/charts/TimelineChart';
import { StressRadar } from '@/components/charts/RadarChart';
import { DistributionChart } from '@/components/charts/DistributionChart';
import { useSimulation } from '@/hooks/useSimulation';
import { pct, getSeverityColor } from '@/types';

export default function Dashboard() {
  const { results, timeline, running, run } = useSimulation();
  useEffect(() => { run(); }, []);

  if (!results) return (
    <AppShell running={false} onRun={() => run()}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:400, color:'#64748B', fontSize:14 }}>
        Running initial simulation…
      </div>
    </AppShell>
  );

  const m = results.means;
  return (
    <AppShell running={running} onRun={() => run()}>
      <div style={{ padding:24, maxWidth:1200, margin:'0 auto', animation:'fadeIn 0.3s ease' }}>
        <SectionTitle icon={Activity} title="Global Crisis Dashboard" sub={`${results.n.toLocaleString()} Monte Carlo iterations · Probabilistic system state`} />

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:14, marginBottom:22 }}>
          <MetricCard label="ICU Occupancy"       value={pct(m.icuOcc)}   sub={`p90: ${pct(results.p90.icuOcc)}`}   icon={Siren}         color={getSeverityColor(m.icuOcc)}   severity={m.icuOcc} />
          <MetricCard label="Collapse Probability" value={pct(m.collapse)} sub={`p90: ${pct(results.p90.collapse)}`} icon={AlertTriangle}  color={getSeverityColor(m.collapse)} severity={m.collapse} />
          <MetricCard label="Burnout Risk"         value={pct(m.burnout)}  sub={`p90: ${pct(results.p90.burnout)}`}  icon={Users}          color={getSeverityColor(m.burnout)}  severity={m.burnout} />
          <MetricCard label="Healthcare Quality"   value={pct(m.quality)}  sub="System efficacy score"               icon={Shield}         color={m.quality>0.6?'#34D399':m.quality>0.4?'#FCD34D':'#F87171'} />
          <MetricCard label="Medicine Stock"       value={pct(m.medAvail)} sub="Supply availability"                 icon={Package}        color={m.medAvail>0.6?'#34D399':m.medAvail>0.3?'#FCD34D':'#F87171'} />
          <MetricCard label="Mental Stability"     value={pct(m.mental)}   sub="Population resilience"               icon={Brain}          color={m.mental>0.6?'#34D399':m.mental>0.4?'#FCD34D':'#F87171'} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16, marginBottom:18 }}>
          <GlassCard>
            <div style={{ fontSize:13, fontWeight:600, color:'#64748B', marginBottom:12 }}>Projected Crisis Escalation (Days 0–105)</div>
            <div style={{ display:'flex', gap:14, marginBottom:12, flexWrap:'wrap' }}>
              {[['ICU Load','#F87171'],['Burnout','#FCD34D'],['Anxiety','#A78BFA'],['Stability','#34D399']].map(([n,c])=>(
                <div key={n} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#64748B' }}>
                  <div style={{ width:20, height:2, background:c, borderRadius:1 }} />{n}
                </div>
              ))}
            </div>
            <TimelineChart data={timeline} />
          </GlassCard>
          <GlassCard>
            <div style={{ fontSize:13, fontWeight:600, color:'#64748B', marginBottom:8 }}>System Stress Assessment</div>
            <StressRadar results={results} />
          </GlassCard>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <GlassCard>
            <div style={{ fontSize:13, fontWeight:600, color:'#64748B', marginBottom:14 }}>Event Probabilities ({results.n.toLocaleString()} iterations)</div>
            <ProbRow label="ICU Overload (>85% capacity)"    value={results.probs.icuOverload} />
            <ProbRow label="Severe Burnout (>60%)"           value={results.probs.severeBurnout} />
            <ProbRow label="Mental Health Crisis (>65%)"     value={results.probs.mentalCrisis} />
            <ProbRow label="System Collapse (>50%)"          value={results.probs.collapse}    color="#F87171" />
            <ProbRow label="Disease Mutation Event"          value={results.probs.mutation}    color="#A78BFA" />
            <ProbRow label="Staffing Failure Event"          value={results.probs.staffFail}   color="#FCD34D" />
          </GlassCard>
          <GlassCard>
            <div style={{ fontSize:13, fontWeight:600, color:'#64748B', marginBottom:14 }}>Collapse Probability Distribution</div>
            <DistributionChart results={results} />
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:10 }}>
              {results.dist.map((d,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:4, fontSize:10, color:'#64748B' }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:d.color }} />{d.label}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
