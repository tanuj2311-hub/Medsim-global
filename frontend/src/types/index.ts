// ─── Simulation Parameters ───────────────────────────────────────────────────

export interface SimulationParams {
  // Healthcare infrastructure
  infectionRate: number;        // 0–1
  icuBeds: number;              // 50–1200
  doctorsAvailable: number;     // 20–600
  nursesAvailable: number;      // 60–1800
  medicineStock: number;        // 0–1

  // Mental health factors
  sleepQuality: number;         // 0–1
  isolationFactor: number;      // 0–1
  workload: number;             // 0–1
  economicPressure: number;     // 0–1

  // Crisis variables
  diseaseMutationChance: number; // 0–0.4
  staffingFailureRisk: number;   // 0–0.8
  supplyChainRisk: number;       // 0–0.8
  publicPanicLevel: number;      // 0–1
}

// ─── Simulation Results ───────────────────────────────────────────────────────

export interface SimIteration {
  icuOcc: number;
  burnout: number;
  anxiety: number;
  collapse: number;
  mental: number;
  quality: number;
  medAvail: number;
  newCases: number;
  mutation: boolean;
  staffFail: boolean;
}

export interface DistributionBucket {
  range: string;
  count: number;
  color: string;
  label: string;
}

export interface SimulationResult {
  n: number;
  means: {
    icuOcc: number;
    burnout: number;
    anxiety: number;
    collapse: number;
    mental: number;
    quality: number;
    medAvail: number;
  };
  p90: {
    icuOcc: number;
    burnout: number;
    collapse: number;
  };
  probs: {
    icuOverload: number;
    severeBurnout: number;
    mentalCrisis: number;
    collapse: number;
    mutation: number;
    staffFail: number;
  };
  dist: DistributionBucket[];
  durationMs?: number;
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export interface TimelinePoint {
  day: string;
  t: number;
  icu: number;
  burnout: number;
  anxiety: number;
  collapse: number;
  stability: number;
  quality: number;
}

// ─── Scenarios ────────────────────────────────────────────────────────────────

export interface Scenario {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  params: SimulationParams;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface APIResponse<T> {
  data: T;
  message?: string;
}

export interface APIError {
  detail: string;
  status: number;
}

// ─── Severity ─────────────────────────────────────────────────────────────────

export type SeverityLevel = 'critical' | 'high' | 'moderate' | 'low';

export const getSeverity = (v: number): SeverityLevel => {
  if (v > 0.7) return 'critical';
  if (v > 0.5) return 'high';
  if (v > 0.3) return 'moderate';
  return 'low';
};

export const getSeverityColor = (v: number): string => {
  if (v > 0.7) return '#F87171';
  if (v > 0.5) return '#FB923C';
  if (v > 0.3) return '#FCD34D';
  return '#34D399';
};

export const pct = (v: number, decimals = 1): string =>
  `${(v * 100).toFixed(decimals)}%`;
