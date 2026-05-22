'use client';
import { type ReactNode, type CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', style, glow, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`glass ${glow ? 'glass-hi' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ padding: 20, ...style }}
    >
      {children}
    </div>
  );
}
