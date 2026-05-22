# MedSim Global — API Reference

Base URL: `http://localhost:8000`  
All protected routes require: `Authorization: Bearer <token>`

---

## Auth

### POST /api/auth/register
Create a new account.
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```
Returns: `{ "access_token": "...", "token_type": "bearer" }`

### POST /api/auth/login
OAuth2 form-encoded login.
```
username=jane@example.com&password=secret123
```
Returns: `{ "access_token": "...", "token_type": "bearer" }`

### GET /api/auth/me 🔒
Returns current user profile.

---

## Simulation

### POST /api/simulation/run
Run a Monte Carlo simulation.
```json
{
  "params": {
    "infection_rate": 0.35,
    "icu_beds": 500,
    "doctors_available": 200,
    "nurses_available": 600,
    "medicine_stock": 0.75,
    "sleep_quality": 0.6,
    "isolation_factor": 0.35,
    "workload": 0.45,
    "economic_pressure": 0.4,
    "disease_mutation_chance": 0.05,
    "staffing_failure_risk": 0.08,
    "supply_chain_risk": 0.1,
    "public_panic_level": 0.3
  },
  "iterations": 2000
}
```

**Response:**
```json
{
  "n": 2000,
  "means": {
    "icuOcc": 0.42, "burnout": 0.31, "anxiety": 0.38,
    "collapse": 0.19, "mental": 0.61, "quality": 0.58, "medAvail": 0.71
  },
  "p90": { "icuOcc": 0.71, "burnout": 0.52, "collapse": 0.44 },
  "probs": {
    "icuOverload": 0.12, "severeBurnout": 0.08,
    "mentalCrisis": 0.14, "collapse": 0.07,
    "mutation": 0.05, "staffFail": 0.08
  },
  "dist": [
    { "range": "0–20%", "count": 1240, "color": "#34D399", "label": "Very Low" },
    ...
  ],
  "duration_ms": 187
}
```

### GET /api/simulation/scenarios
Returns all 5 preset crisis scenarios.

### GET /api/simulation/timeline
Returns a 22-step projected crisis escalation timeline.

### POST /api/simulation/save 🔒
Save a simulation for the current user.
```json
{ "name": "My Scenario", "params": {...}, "result": {...} }
```

### GET /api/simulation/list 🔒
List saved simulations (latest 20).

### DELETE /api/simulation/delete/{id} 🔒
Delete a saved simulation.

---

## Reports

### POST /api/reports/generate 🔒
Generate a downloadable text report.
```json
{ "simulation_id": 42 }
```
or
```json
{ "params": {...}, "result": {...} }
```
Returns: `text/plain` file download.

---

## Health

### GET /health
Returns `{ "status": "healthy" }`.
