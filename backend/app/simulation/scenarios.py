DEFAULT = {
    "infection_rate": 0.35, "icu_beds": 500, "doctors_available": 200,
    "nurses_available": 600, "medicine_stock": 0.75, "sleep_quality": 0.6,
    "isolation_factor": 0.35, "workload": 0.45, "economic_pressure": 0.4,
    "disease_mutation_chance": 0.05, "staffing_failure_risk": 0.08,
    "supply_chain_risk": 0.1, "public_panic_level": 0.3,
}

SCENARIOS = [
    {
        "id": "pandemic", "name": "Pandemic Surge", "emoji": "🦠", "color": "#F87171",
        "description": "Rapid viral spread overwhelming hospital capacity",
        "params": {**DEFAULT, "infection_rate": 0.85, "icu_beds": 300, "public_panic_level": 0.75, "disease_mutation_chance": 0.15},
    },
    {
        "id": "staffing", "name": "Staffing Crisis", "emoji": "👨‍⚕️", "color": "#FCD34D",
        "description": "Mass healthcare worker burnout and resignations",
        "params": {**DEFAULT, "staffing_failure_risk": 0.65, "workload": 0.85, "sleep_quality": 0.2, "doctors_available": 80},
    },
    {
        "id": "supply", "name": "Supply Collapse", "emoji": "📦", "color": "#FB923C",
        "description": "Critical medicine and equipment shortages",
        "params": {**DEFAULT, "supply_chain_risk": 0.7, "medicine_stock": 0.2, "economic_pressure": 0.75},
    },
    {
        "id": "mental", "name": "Mental Health Crisis", "emoji": "🧠", "color": "#A78BFA",
        "description": "Widespread psychological collapse and social isolation",
        "params": {**DEFAULT, "isolation_factor": 0.85, "economic_pressure": 0.8, "sleep_quality": 0.25, "public_panic_level": 0.7},
    },
    {
        "id": "optimal", "name": "Optimal Response", "emoji": "✅", "color": "#34D399",
        "description": "Coordinated, well-resourced crisis management",
        "params": {**DEFAULT, "infection_rate": 0.12, "icu_beds": 900, "doctors_available": 420, "medicine_stock": 0.95, "staffing_failure_risk": 0.01, "public_panic_level": 0.08},
    },
]
