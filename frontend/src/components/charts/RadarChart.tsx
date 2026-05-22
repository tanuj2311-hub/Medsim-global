'use client';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { SimulationResult } from '@/types';

export function StressRadar({ results }: { results: SimulationResult }) {
  const m = results.means;
  const data = [
    { subject:'ICU Load',    val: +(m.icuOcc*100).toFixed(1) },
    { subject:'Burnout',     val: +(m.burnout*100).toFixed(1) },
    { subject:'Anxiety',     val: +(m.anxiety*100).toFixed(1) },
    { subject:'Collapse',    val: +(m.collapse*100).toFixed(1) },
    { subject:'Supply Risk', val: +((1-m.medAvail)*100).toFixed(1) },
    { subject:'Fragility',   val: +((1-m.mental)*100).toFixed(1) },
  ];
  return (
    <ResponsiveContainer width="100%" height={230}>
      <RadarChart data={data} margin={{ top:10, right:20, bottom:10, left:20 }}>
        <PolarGrid stroke="rgba(56,189,248,0.1)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill:'#64748B', fontSize:10 }} />
        <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fill:'#64748B', fontSize:9 }} />
        <Radar dataKey="val" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.12} strokeWidth={1.5} dot={{ fill:'#38BDF8', r:3 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
