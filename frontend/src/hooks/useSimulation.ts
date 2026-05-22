import { useState, useCallback } from 'react';
import { runMonteCarlo, generateTimeline, DEFAULT_PARAMS } from '@/lib/montecarlo';
import type { SimulationParams, SimulationResult, TimelinePoint } from '@/types';

export const useSimulation = () => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [running, setRunning] = useState(false);
  const [totalIterations, setTotalIterations] = useState(0);

  const run = useCallback((overrideParams?: SimulationParams, iterations = 2000) => {
    const p = overrideParams ?? params;
    setRunning(true);
    setTimeout(() => {
      const r = runMonteCarlo(p, iterations);
      const t = generateTimeline(p);
      setResults(r);
      setTimeline(t);
      setTotalIterations((prev) => prev + iterations);
      setRunning(false);
    }, 50);
  }, [params]);

  const updateParam = useCallback(<K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyScenario = useCallback((scenarioParams: SimulationParams) => {
    setParams(scenarioParams);
    run(scenarioParams);
  }, [run]);

  return { params, setParams, updateParam, results, timeline, running, totalIterations, run, applyScenario };
};
