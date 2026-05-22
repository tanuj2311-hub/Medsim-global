'use client';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

export function SliderInput({ label, value, min, max, step = 0.01, format, onChange }: Props) {
  const display = format ? format(value) : value.toFixed(2);
  const pctFill = ((value - min) / (max - min) * 100).toFixed(0);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: '#94A3B8' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#38BDF8', minWidth: 48, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', background: `linear-gradient(90deg, #38BDF8 ${pctFill}%, rgba(56,189,248,0.15) 0)`, borderRadius: 2 }}
      />
    </div>
  );
}
