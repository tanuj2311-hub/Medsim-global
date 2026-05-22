import type {
  SimulationParams,
  SimulationResult,
  TimelinePoint,
  DistributionBucket,
} from '@/types';

// ─── Core Distributions ───────────────────────────────────────────────────────

export const gaussian = (mean: number, std: number): number => {
  const u1 = Math.max(1e-10, Math.random());
  const u2 = Math.random();
  return mean + std * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
};

export const poisson = (lambda: number): number => {
  if (lambda <= 0) return 0;
  const L = Math.exp(-Math.min(lambda, 30));
  let k = 0;
  let p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
};

export const clamp = (v: number, lo = 0, hi = 1): number =>
  Math.max(lo, Math.min(hi, v));

// ─── Single Iteration ─────────────────────────────────────────────────────────

interface IterResult {
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

export const simulateOnce = (p: SimulationParams): IterResult => {
  // Disease dynamics
  const effRate = clamp(gaussian(p.infectionRate, p.infectionRate * 0.12), 0.01, 2);
  const newCases = poisson(effRate * 80);
  const icuDemand = newCases * 0.07 * clamp(gaussian(1, 0.2), 0.5, 2);
  const icuOcc = clamp(icuDemand / Math.max(p.icuBeds, 1), 0, 2);

  // Burnout chain
  const burnoutPressure = icuOcc * 0.6 + p.workload * 0.25 + (1 - p.sleepQuality) * 0.25;
  const burnout = clamp(gaussian(burnoutPressure * 0.5, 0.08), 0, 1);

  // Healthcare quality
  const effectiveDocs = p.doctorsAvailable * (1 - burnout * 0.45);
  const quality = clamp(effectiveDocs / (icuDemand * 8 + 1), 0, 1);

  // Supply chain shock
  const supplyShock = Math.random() < p.supplyChainRisk
    ? clamp(gaussian(0.45, 0.1), 0, 1) : 0;
  const medAvail = clamp(p.medicineStock - supplyShock, 0, 1);

  // Mental health cascade
  const anxietyBase =
    p.publicPanicLevel * 0.3 +
    p.isolationFactor * 0.25 +
    p.economicPressure * 0.2 +
    (1 - quality) * 0.25;
  const anxiety = clamp(gaussian(anxietyBase, 0.08), 0, 1);

  // Stochastic crisis events
  const mutation = Math.random() < p.diseaseMutationChance;
  const staffFail = Math.random() < p.staffingFailureRisk;
  const mutMult = mutation ? clamp(gaussian(1.6, 0.25), 1, 3) : 1;
  const staffMult = staffFail ? clamp(gaussian(0.55, 0.1), 0.2, 1) : 1;

  // System collapse probability
  const collapse = clamp(
    (icuOcc - 0.65) * 1.4 * mutMult / staffMult
    + (1 - medAvail) * 0.3
    + burnout * 0.2
    - quality * 0.15,
    0, 1
  );

  const mental = clamp(
    1 - anxiety * 0.6 - burnout * 0.25 - p.isolationFactor * 0.15,
    0, 1
  );

  return { icuOcc, burnout, anxiety, collapse, mental, quality, medAvail, newCases, mutation, staffFail };
};

// ─── Full Monte Carlo Run ─────────────────────────────────────────────────────

export const runMonteCarlo = (
  params: SimulationParams,
  iterations = 2000
): SimulationResult => {
  const t0 = performance.now();
  const res = Array.from({ length: iterations }, () => simulateOnce(params));

  const avg = (key: keyof IterResult): number =>
    res.reduce((s, r) => s + (r[key] as number), 0) / iterations;

  const pctile = (key: keyof IterResult, p: number): number =>
    [...res.map(r => r[key] as number)].sort((a, b) => a - b)[
      Math.floor(p * iterations)
    ];

  const prob = (key: keyof IterResult, threshold: number): number =>
    res.filter(r => (r[key] as number) > threshold).length / iterations;

  const dist: DistributionBucket[] = [0.2, 0.4, 0.6, 0.8, 1.0].map((hi, i) => {
    const lo = [0, 0.2, 0.4, 0.6, 0.8][i];
    return {
      range: `${(lo * 100).toFixed(0)}–${(hi * 100).toFixed(0)}%`,
      count: res.filter(r => r.collapse >= lo && r.collapse < hi).length,
      color: ['#34D399', '#86EFAC', '#FCD34D', '#FB923C', '#F87171'][i],
      label: ['Very Low', 'Low', 'Moderate', 'High', 'Critical'][i],
    };
  });

  return {
    n: iterations,
    means: {
      icuOcc: avg('icuOcc'),
      burnout: avg('burnout'),
      anxiety: avg('anxiety'),
      collapse: avg('collapse'),
      mental: avg('mental'),
      quality: avg('quality'),
      medAvail: avg('medAvail'),
    },
    p90: {
      icuOcc: pctile('icuOcc', 0.9),
      burnout: pctile('burnout', 0.9),
      collapse: pctile('collapse', 0.9),
    },
    probs: {
      icuOverload: prob('icuOcc', 0.85),
      severeBurnout: prob('burnout', 0.6),
      mentalCrisis: prob('anxiety', 0.65),
      collapse: prob('collapse', 0.5),
      mutation: res.filter(r => r.mutation).length / iterations,
      staffFail: res.filter(r => r.staffFail).length / iterations,
    },
    dist,
    durationMs: Math.round(performance.now() - t0),
  };
};

// ─── Timeline Generation ──────────────────────────────────────────────────────

export const generateTimeline = (
  params: SimulationParams,
  steps = 22
): TimelinePoint[] =>
  Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    const ep: SimulationParams = {
      ...params,
      infectionRate: params.infectionRate * (1 + t * 0.45),
      publicPanicLevel: params.publicPanicLevel * (1 + t * 0.3),
    };
    const batch = Array.from({ length: 20 }, () => simulateOnce(ep));
    const avg = (k: keyof IterResult): number =>
      batch.reduce((s, r) => s + (r[k] as number), 0) / 20;
    return {
      day: `D${i * 5}`,
      t: i * 5,
      icu: +(avg('icuOcc') * 100).toFixed(1),
      burnout: +(avg('burnout') * 100).toFixed(1),
      anxiety: +(avg('anxiety') * 100).toFixed(1),
      collapse: +(avg('collapse') * 100).toFixed(1),
      stability: +(avg('mental') * 100).toFixed(1),
      quality: +(avg('quality') * 100).toFixed(1),
    };
  });

// ─── Default Parameters ───────────────────────────────────────────────────────

export const DEFAULT_PARAMS: SimulationParams = {
  infectionRate: 0.35,
  icuBeds: 500,
  doctorsAvailable: 200,
  nursesAvailable: 600,
  medicineStock: 0.75,
  sleepQuality: 0.6,
  isolationFactor: 0.35,
  workload: 0.45,
  economicPressure: 0.4,
  diseaseMutationChance: 0.05,
  staffingFailureRisk: 0.08,
  supplyChainRisk: 0.1,
  publicPanicLevel: 0.3,
};
