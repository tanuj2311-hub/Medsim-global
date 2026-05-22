'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DarkTooltip } from './DarkTooltip';
import type { TimelinePoint } from '@/types';

interface Props {
  data: TimelinePoint[];
  keys?: string[];
  colors?: string[];
  names?: string[];
}

const DEFAULTS = {
  keys:   ['icu','burnout','anxiety','stability'],
  colors: ['#F87171','#FCD34D','#A78BFA','#34D399'],
  names:  ['ICU Load','Burnout','Anxiety','Stability'],
};

export function TimelineChart({ data, keys=DEFAULTS.keys, colors=DEFAULTS.colors, names=DEFAULTS.names }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top:5, right:5, bottom:0, left:-20 }}>
        <defs>
          {colors.map((c,i) => (
            <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={c} stopOpacity={0.28} />
              <stop offset="95%" stopColor={c} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.06)" />
        <XAxis dataKey="day" tick={{ fill:'#64748B', fontSize:10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill:'#64748B', fontSize:10 }} axisLine={false} tickLine={false} domain={[0,100]} tickFormatter={v=>`${v}%`} />
        <Tooltip content={<DarkTooltip />} />
        {keys.map((k,i) => (
          <Area key={k} type="monotone" dataKey={k} name={names[i]} stroke={colors[i]} fill={`url(#grad${i})`} strokeWidth={2} dot={false} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
