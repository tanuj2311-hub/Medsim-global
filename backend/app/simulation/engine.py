import time
import numpy as np
from typing import Dict, Any
from app.simulation.distributions import gaussian, poisson_samples, clamp, bernoulli


def run_monte_carlo(params: Dict[str, Any], iterations: int = 2000) -> Dict[str, Any]:
    """
    Run vectorised Monte Carlo simulation.
    All operations are batched over `iterations` simultaneously using NumPy.
    """
    t0 = time.time()
    n = iterations

    # ── Unpack parameters ───────────────────────────────────────────────────
    infection_rate    = float(params.get("infectionRate", 0.35))
    icu_beds          = float(params.get("icuBeds", 500))
    doctors           = float(params.get("doctorsAvailable", 200))
    medicine_stock    = float(params.get("medicineStock", 0.75))
    sleep_quality     = float(params.get("sleepQuality", 0.6))
    isolation         = float(params.get("isolationFactor", 0.35))
    workload          = float(params.get("workload", 0.45))
    econ_pressure     = float(params.get("economicPressure", 0.4))
    mutation_chance   = float(params.get("diseaseMutationChance", 0.05))
    staffing_risk     = float(params.get("staffingFailureRisk", 0.08))
    supply_risk       = float(params.get("supplyChainRisk", 0.1))
    panic_level       = float(params.get("publicPanicLevel", 0.3))

    # ── Disease dynamics (vectorised) ───────────────────────────────────────
    eff_rate  = clamp(gaussian(infection_rate, infection_rate * 0.12, n), 0.01, 2.0)
    new_cases = poisson_samples(eff_rate.mean() * 80, n).astype(float)
    icu_demand = new_cases * 0.07 * clamp(gaussian(1.0, 0.2, n), 0.5, 2.0)
    icu_occ   = clamp(icu_demand / max(icu_beds, 1), 0.0, 2.0)

    # ── Burnout chain ───────────────────────────────────────────────────────
    burnout_pressure = icu_occ * 0.6 + workload * 0.25 + (1 - sleep_quality) * 0.25
    burnout = clamp(gaussian(burnout_pressure * 0.5, 0.08, n))

    # ── Healthcare quality ──────────────────────────────────────────────────
    eff_docs = doctors * (1 - burnout * 0.45)
    quality  = clamp(eff_docs / (icu_demand + 1e-6) / 8)

    # ── Supply chain ────────────────────────────────────────────────────────
    supply_shock_mask = bernoulli(supply_risk, n)
    supply_shock = np.where(supply_shock_mask, clamp(gaussian(0.45, 0.1, n)), 0.0)
    med_avail = clamp(medicine_stock - supply_shock)

    # ── Mental health cascade ───────────────────────────────────────────────
    anxiety_base = panic_level * 0.3 + isolation * 0.25 + econ_pressure * 0.2 + (1 - quality) * 0.25
    anxiety = clamp(gaussian(anxiety_base, 0.08, n))

    # ── Crisis events ───────────────────────────────────────────────────────
    mutation   = bernoulli(mutation_chance, n)
    staff_fail = bernoulli(staffing_risk, n)
    mut_mult   = np.where(mutation,   clamp(gaussian(1.6, 0.25, n), 1.0, 3.0), 1.0)
    staff_mult = np.where(staff_fail, clamp(gaussian(0.55, 0.1, n), 0.2, 1.0), 1.0)

    # ── System collapse ─────────────────────────────────────────────────────
    collapse = clamp(
        (icu_occ - 0.65) * 1.4 * mut_mult / staff_mult
        + (1 - med_avail) * 0.3
        + burnout * 0.2
        - quality * 0.15
    )
    mental = clamp(1 - anxiety * 0.6 - burnout * 0.25 - isolation * 0.15)

    # ── Statistics ──────────────────────────────────────────────────────────
    def stats(arr: np.ndarray) -> Dict[str, float]:
        return {
            "mean": float(arr.mean()),
            "p10":  float(np.percentile(arr, 10)),
            "p50":  float(np.percentile(arr, 50)),
            "p90":  float(np.percentile(arr, 90)),
            "std":  float(arr.std()),
        }

    def prob_above(arr: np.ndarray, threshold: float) -> float:
        return float((arr > threshold).mean())

    # Distribution buckets
    dist = []
    labels = ["Very Low", "Low", "Moderate", "High", "Critical"]
    colors = ["#34D399", "#86EFAC", "#FCD34D", "#FB923C", "#F87171"]
    boundaries = [(0, 0.2), (0.2, 0.4), (0.4, 0.6), (0.6, 0.8), (0.8, 1.0)]
    for (lo, hi), label, color in zip(boundaries, labels, colors):
        dist.append({
            "range": f"{int(lo*100)}–{int(hi*100)}%",
            "count": int(((collapse >= lo) & (collapse < hi)).sum()),
            "label": label,
            "color": color,
        })

    duration_ms = int((time.time() - t0) * 1000)

    return {
        "n": n,
        "means": {
            "icuOcc":   float(icu_occ.mean()),
            "burnout":  float(burnout.mean()),
            "anxiety":  float(anxiety.mean()),
            "collapse": float(collapse.mean()),
            "mental":   float(mental.mean()),
            "quality":  float(quality.mean()),
            "medAvail": float(med_avail.mean()),
        },
        "p90": {
            "icuOcc":   float(np.percentile(icu_occ, 90)),
            "burnout":  float(np.percentile(burnout, 90)),
            "collapse": float(np.percentile(collapse, 90)),
        },
        "probs": {
            "icuOverload":   prob_above(icu_occ, 0.85),
            "severeBurnout": prob_above(burnout, 0.6),
            "mentalCrisis":  prob_above(anxiety, 0.65),
            "collapse":      prob_above(collapse, 0.5),
            "mutation":      float(mutation.mean()),
            "staffFail":     float(staff_fail.mean()),
        },
        "dist": dist,
        "stats": {
            "icuOcc":   stats(icu_occ),
            "burnout":  stats(burnout),
            "anxiety":  stats(anxiety),
            "collapse": stats(collapse),
            "mental":   stats(mental),
        },
        "durationMs": duration_ms,
    }
