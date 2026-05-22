'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { SimulationResult } from '@/types';

export function DistributionChart({ results }: { results: SimulationResult }) {
  return (
    <ResponsiveContainer width="100%" height={190}>
      <BarChart data={results.dist} margin={{ top:5, right:5, bottom:5, left:-20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.06)" vertical={false} />
        <XAxis dataKey="range" tick={{ fill:'#64748B', fontSize:10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill:'#64748B', fontSize:10 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background:'#080f24', border:'1px solid rgba(56,189,248,0.2)', borderRadius:8, fontSize:12 }} />
        <Bar dataKey="count" name="Simulations" radius={[4,4,0,0]}>
          {results.dist.map((d,i) => <Cell key={i} fill={d.color} fillOpacity={0.85} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
