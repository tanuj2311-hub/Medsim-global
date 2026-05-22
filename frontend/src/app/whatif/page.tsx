'use client';
import { useState, useCallback } from 'react';
import { Target } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProbRow } from '@/components/ui/ProbRow';
import { useSimulation } from '@/hooks/useSimulation';
import { SCENARIOS } from '@/lib/scenarios';
import { runMonteCarlo } from '@/lib/montecarlo';
import type { SimulationResult } from '@/types';
import { pct, getSeverityColor } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function WhatIf() {
  const { running } = useSimulation();
  const [selected, setSelected] = useState<string | null>(null);
  const [scenarioResults, setScenarioResults] = useState<Record<string, SimulationResult>>({});

  const runScenario = useCallback((id: string) => {
    const sc = SCENARIOS.find(s => s.id === id);
    if (!sc) return;
    setSelected(id);
    setTimeout(() => {
      const r = runMonteCarlo(sc.params, 1500);
      setScenarioResults(prev => ({ ...prev, [id]: r }));
    }, 100);
  }, []);

  const computed = SCENARIOS.filter(s => scenarioResults[s.id]);
  const compareData = computed.map(s => ({
    name: s.name.split(' ')[0],
    collapse: +(scenarioResults[s.id].means.collapse * 100).toFixed(1),
    burnout:  +(scenarioResults[s.id].means.burnout  * 100).toFixed(1),
    anxiety:  +(scenarioResults[s.id].means.anxiety  * 100).toFixed(1),
  }));

  const selectedScenario = SCENARIOS.find(s => s.id === selected);
  const selectedResult   = selected ? scenarioResults[selected] : null;

  return (
    <AppShell running={running} onRun={() => {}}>
      <div style={{ padding:24, maxWidth:1200, margin:'0 auto', animation:'fadeIn 0.3s ease' }}>
        <SectionTitle icon={Target} title="What-If Analysis Center" sub="Click a scenario to model outcomes — compare probabilities across crisis types" color="#FCD34D" />

        {/* Scenario cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(195px,1fr))', gap:14, marginBottom:22 }}>
          {SCENARIOS.map(sc => {
            const res = scenarioResults[sc.id];
            const isSelected = selected === sc.id;
            return (
              <div key={sc.id} onClick={() => runScenario(sc.id)}
                style={{ cursor:'pointer', padding:18, borderRadius:14, transition:'all 0.2s', background: isSelected ? `${sc.color}12` : 'rgba(7,15,35,0.8)', border:`1px solid ${isSelected ? sc.color : 'rgba(56,189,248,0.1)'}`, backdropFilter:'blur(20px)', boxShadow: isSelected ? `0 0 24px ${sc.color}18` : 'none' }}>
                <div style={{ fontSize:28, marginBottom:10 }}>{sc.emoji}</div>
                <div style={{ fontSize:14, fontWeight:700, color: isSelected ? sc.color : '#E2E8F0', marginBottom:6 }}>{sc.name}</div>
                <div style={{ fontSize:12, color:'#64748B', lineHeight:1.5, marginBottom:12 }}>{sc.description}</div>
                {res && (
                  <div style={{ padding:'8px 10px', background:'rgba(0,0,0,0.2)', borderRadius:8 }}>
                    <div style={{ fontSize:10, color:'#64748B', marginBottom:2 }}>Collapse probability</div>
                    <div style={{ fontSize:20, fontWeight:800, color:sc.color }}>{pct(res.means.collapse)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Comparison chart */}
        {computed.length > 0 && (
          <GlassCard style={{ marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#64748B', marginBottom:12 }}>
              Scenario Comparison — {computed.length} of {SCENARIOS.length} scenarios computed
            </div>
            <div style={{ display:'flex', gap:14, marginBottom:12 }}>
              {[['Collapse','#F87171'],['Burnout','#FCD34D'],['Anxiety','#A78BFA']].map(([n,c])=>(
                <div key={n} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#64748B' }}>
                  <div style={{ width:20, height:2, background:c }} />{n}
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={compareData} margin={{ top:5, right:5, bottom:5, left:-10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill:'#64748B', fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'#64748B', fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} />
                <Tooltip contentStyle={{ background:'#080f24', border:'1px solid rgba(56,189,248,0.2)', borderRadius:8, fontSize:12 }} />
                <Bar dataKey="collapse" name="Collapse" fill="#F87171" fillOpacity={0.8} radius={[3,3,0,0]} />
                <Bar dataKey="burnout"  name="Burnout"  fill="#FCD34D" fillOpacity={0.8} radius={[3,3,0,0]} />
                <Bar dataKey="anxiety"  name="Anxiety"  fill="#A78BFA" fillOpacity={0.8} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        )}

        {/* Selected detail */}
        {selectedScenario && selectedResult && (
          <GlassCard glow style={{ borderColor:`${selectedScenario.color}40`, boxShadow:`0 0 30px ${selectedScenario.color}12` }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
              <span style={{ fontSize:22 }}>{selectedScenario.emoji}</span>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:selectedScenario.color }}>{selectedScenario.name}</div>
                <div style={{ fontSize:12, color:'#64748B' }}>{selectedResult.n.toLocaleString()} Monte Carlo iterations</div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:12, marginBottom:16 }}>
              {([['System Collapse', selectedResult.means.collapse],['ICU Overload', selectedResult.probs.icuOverload],['Burnout Risk', selectedResult.means.burnout],['Mental Crisis', selectedResult.probs.mentalCrisis],['Stability', selectedResult.means.mental],['Quality', selectedResult.means.quality]] as [string,number][]).map(([l,v],i)=>(
                <div key={l} style={{ padding:12, background:'rgba(0,0,0,0.2)', borderRadius:10, textAlign:'center' }}>
                  <div style={{ fontSize:20, fontWeight:800, color: i < 4 ? getSeverityColor(v) : '#34D399' }}>{pct(v)}</div>
                  <div style={{ fontSize:11, color:'#64748B', marginTop:3 }}>{l}</div>
                </div>
              ))}
            </div>
            <ProbRow label="P(ICU Overload >85%)"    value={selectedResult.probs.icuOverload} />
            <ProbRow label="P(System Collapse >50%)" value={selectedResult.probs.collapse} color="#F87171" />
            <ProbRow label="P(Mental Crisis >65%)"   value={selectedResult.probs.mentalCrisis} color="#A78BFA" />
          </GlassCard>
        )}
      </div>
    </AppShell>
  );
}
