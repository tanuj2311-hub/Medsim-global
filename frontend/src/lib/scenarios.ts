import type { Scenario } from '@/types';
import { DEFAULT_PARAMS } from './montecarlo';

export const SCENARIOS: Scenario[] = [
  {
    id: 'pandemic',
    name: 'Pandemic Surge',
    emoji: '🦠',
    color: '#F87171',
    description: 'Rapid viral spread overwhelming hospital capacity with mutation risk',
    params: {
      ...DEFAULT_PARAMS,
      infectionRate: 0.85,
      icuBeds: 300,
      publicPanicLevel: 0.75,
      diseaseMutationChance: 0.15,
    },
  },
  {
    id: 'staffing',
    name: 'Staffing Crisis',
    emoji: '👨‍⚕️',
    color: '#FCD34D',
    description: 'Mass healthcare worker burnout, resignations, and understaffing',
    params: {
      ...DEFAULT_PARAMS,
      staffingFailureRisk: 0.65,
      workload: 0.85,
      sleepQuality: 0.2,
      doctorsAvailable: 80,
    },
  },
  {
    id: 'supply',
    name: 'Supply Collapse',
    emoji: '📦',
    color: '#FB923C',
    description: 'Critical medicine and equipment shortages across supply chain',
    params: {
      ...DEFAULT_PARAMS,
      supplyChainRisk: 0.7,
      medicineStock: 0.2,
      economicPressure: 0.75,
    },
  },
  {
    id: 'mental',
    name: 'Mental Health Crisis',
    emoji: '🧠',
    color: '#A78BFA',
    description: 'Widespread psychological collapse, social isolation, and anxiety',
    params: {
      ...DEFAULT_PARAMS,
      isolationFactor: 0.85,
      economicPressure: 0.8,
      sleepQuality: 0.25,
      publicPanicLevel: 0.7,
    },
  },
  {
    id: 'optimal',
    name: 'Optimal Response',
    emoji: '✅',
    color: '#34D399',
    description: 'Coordinated, well-resourced, and proactive crisis management',
    params: {
      ...DEFAULT_PARAMS,
      infectionRate: 0.12,
      icuBeds: 900,
      doctorsAvailable: 420,
      medicineStock: 0.95,
      staffingFailureRisk: 0.01,
      publicPanicLevel: 0.08,
    },
  },
];
