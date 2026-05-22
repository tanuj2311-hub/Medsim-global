import numpy as np


def gaussian(mean: float, std: float, size: int = 1) -> np.ndarray:
    """Normal (Gaussian) distribution samples."""
    return np.random.normal(mean, std, size)


def poisson_samples(lam: float, size: int = 1) -> np.ndarray:
    """Poisson distribution samples."""
    lam = max(0.0, min(float(lam), 1e6))
    return np.random.poisson(lam, size)


def clamp(arr: np.ndarray, lo: float = 0.0, hi: float = 1.0) -> np.ndarray:
    return np.clip(arr, lo, hi)


def bernoulli(p: float, size: int = 1) -> np.ndarray:
    """Bernoulli (binary event) samples."""
    return np.random.random(size) < p
