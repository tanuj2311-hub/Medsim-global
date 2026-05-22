'use client';
import { useEffect } from 'react';
import { FlaskConical, Play, Loader } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SliderInput } from '@/components/ui/SliderInput';
import { ProbRow } from '@/components/ui/ProbRow';
import { DistributionChart } from '@/components/charts/DistributionChart';
import { useSimulation } from '@/hooks/useSimulation';
import { pct, getSeverityColor } from '@/types';

const fmtPct = (v: number) => `${(v*100).toFixed(0)}%`;
const fmtInt = (v: number) => v.toFixed(0);

export default function SimulationLab() {
  const { params, updateParam, results, running, run } = useSimulation();
  useEffect(() => { run(); }, []);

  return (
    <AppShell running={running} onRun={run}>
      <div style={{ padding:24, maxWidth:1200, margin:'0 auto', animation:'fadeIn 0.3s ease' }}>
        <SectionTitle icon={FlaskConical} title="Simulation Laboratory" sub="Configure parameters and run probabilistic Monte Carlo scenarios" color="#34D399" />

        <div style={{ display:'grid', gridTemplateColumns:'360px 1fr', gap:20 }}>
          {/* Controls */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <GlassCard style={{ padding:20 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#38BDF8', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>⚕ Healthcare Infrastructure</div>
              <SliderInput label="Infection Rate"      value={params.infectionRate}     min={0.01} max={1}    format={fmtPct} onChange={v=>updateParam('infectionRate',v)} />
              <SliderInput label="ICU Beds"            value={params.icuBeds}           min={50}   max={1200} step={10} format={fmtInt} onChange={v=>updateParam('icuBeds',v)} />
              <SliderInput label="Doctors Available"   value={params.doctorsAvailable}  min={20}   max={600}  step={5}  format={fmtInt} onChange={v=>updateParam('doctorsAvailable',v)} />
              <SliderInput label="Medicine Stock"      value={params.medicineStock}     min={0}    max={1}    format={fmtPct} onChange={v=>updateParam('medicineStock',v)} />
            </GlassCard>

            <GlassCard style={{ padding:20 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#A78BFA', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>🧠 Mental Health Factors</div>
              <SliderInput label="Sleep Quality"      value={params.sleepQuality}     min={0} max={1} format={fmtPct} onChange={v=>updateParam('sleepQuality',v)} />
              <SliderInput label="Social Isolation"   value={params.isolationFactor}  min={0} max={1} format={fmtPct} onChange={v=>updateParam('isolationFactor',v)} />
              <SliderInput label="Workload Pressure"  value={params.workload}         min={0} max={1} format={fmtPct} onChange={v=>updateParam('workload',v)} />
              <SliderInput label="Economic Pressure"  value={params.economicPressure} min={0} max={1} format={fmtPct} onChange={v=>updateParam('economicPressure',v)} />
            </GlassCard>

            <GlassCard style={{ padding:20 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#F87171', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>⚡ Crisis Variables</div>
              <SliderInput label="Mutation Chance"       value={params.diseaseMutationChance} min={0} max={0.4} format={fmtPct} onChange={v=>updateParam('diseaseMutationChance',v)} />
              <SliderInput label="Staffing Failure Risk" value={params.staffingFailureRisk}   min={0} max={0.8} format={fmtPct} onChange={v=>updateParam('staffingFailureRisk',v)} />
              <SliderInput label="Supply Chain Risk"     value={params.supplyChainRisk}       min={0} max={0.8} format={fmtPct} onChange={v=>updateParam('supplyChainRisk',v)} />
              <SliderInput label="Public Panic Level"    value={params.publicPanicLevel}      min={0} max={1}   format={fmtPct} onChange={v=>updateParam('publicPanicLevel',v)} />
            </GlassCard>

            <button onClick={() => run()} disabled={running}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:16, background: running ? 'rgba(56,189,248,0.05)' : 'linear-gradient(135deg,rgba(56,189,248,0.2),rgba(129,140,248,0.15))', border:`1px solid ${running?'rgba(56,189,248,0.1)':'rgba(56,189,248,0.4)'}`, borderRadius:12, color:running?'#64748B':'#38BDF8', fontSize:14, fontWeight:700, cursor:running?'not-allowed':'pointer' }}>
              {running ? <><Loader size={16} style={{ animation:'spin 1s linear infinite' }} /> Running 2,000 iterations…</> : <><Play size={16} /> Run Monte Carlo Simulation</>}
            </button>
          </div>

          {/* Results */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {results ? (
              <>
                <GlassCard glow style={{ padding:22 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#64748B', marginBottom:16 }}>Simulation Results — {results.n.toLocaleString()} iterations · {results.durationMs}ms</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>
                    {([['Mean ICU Occupancy', results.means.icuOcc], ['Mean Burnout Risk', results.means.burnout], ['Mean Anxiety Level', results.means.anxiety], ['Mean Collapse Prob.', results.means.collapse], ['Mental Stability', results.means.mental], ['Healthcare Quality', results.means.quality]] as [string,number][]).map(([l,v],i)=>(
                      <div key={i} style={{ padding:'12px 14px', background:'rgba(56,189,248,0.04)', borderRadius:10, border:'1px solid rgba(56,189,248,0.08)' }}>
                        <div style={{ fontSize:11, color:'#64748B', marginBottom:4 }}>{l}</div>
                        <div style={{ fontSize:22, fontWeight:800, color: i<4 ? getSeverityColor(v) : '#34D399' }}>{pct(v)}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:12, color:'#64748B', marginBottom:10 }}>Probability Thresholds</div>
                  <ProbRow label="P(ICU Overload >85%)"     value={results.probs.icuOverload} />
                  <ProbRow label="P(Severe Burnout >60%)"   value={results.probs.severeBurnout} />
                  <ProbRow label="P(Mental Crisis >65%)"    value={results.probs.mentalCrisis} />
                  <ProbRow label="P(System Collapse >50%)"  value={results.probs.collapse} color="#F87171" />
                </GlassCard>

                <GlassCard>
                  <div style={{ fontSize:13, fontWeight:600, color:'#64748B', marginBottom:14 }}>Collapse Probability Histogram</div>
                  <DistributionChart results={results} />
                </GlassCard>

                <GlassCard>
                  <div style={{ fontSize:13, fontWeight:600, color:'#64748B', marginBottom:12 }}>90th Percentile Risk Bounds</div>
                  <div style={{ display:'flex', gap:12 }}>
                    {([['ICU p90', results.p90.icuOcc,'#F87171'],['Burnout p90', results.p90.burnout,'#FCD34D'],['Collapse p90', results.p90.collapse,'#FB923C']] as [string,number,string][]).map(([l,v,c])=>(
                      <div key={l} style={{ flex:1, padding:12, background:`${c}10`, border:`1px solid ${c}25`, borderRadius:10, textAlign:'center' }}>
                        <div style={{ fontSize:20, fontWeight:800, color:c }}>{pct(v)}</div>
                        <div style={{ fontSize:11, color:'#64748B', marginTop:2 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </>
            ) : (
              <GlassCard style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300 }}>
                <div style={{ color:'#64748B', fontSize:14 }}>Configure parameters and run simulation</div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
