-- MedSim Global — PostgreSQL Schema
-- Run: psql -U postgres -d medsim -f schema.sql

CREATE DATABASE IF NOT EXISTS medsim;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Simulation Records
CREATE TABLE IF NOT EXISTS simulation_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL DEFAULT 'Untitled Simulation',
    params JSONB NOT NULL,
    result JSONB NOT NULL,
    iterations INTEGER NOT NULL DEFAULT 2000,
    duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_simulations_user_id ON simulation_records(user_id);
CREATE INDEX idx_simulations_created_at ON simulation_records(created_at DESC);

-- Scenario Presets (optional, seeded data)
CREATE TABLE IF NOT EXISTS scenario_presets (
    id SERIAL PRIMARY KEY,
    scenario_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    params JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed default scenarios
INSERT INTO scenario_presets (scenario_id, name, description, params) VALUES
('pandemic', 'Pandemic Surge', 'Rapid viral spread overwhelming hospital capacity',
 '{"infection_rate":0.85,"icu_beds":300,"public_panic_level":0.75,"disease_mutation_chance":0.15}'),
('staffing', 'Staffing Crisis', 'Mass healthcare worker burnout and resignations',
 '{"staffing_failure_risk":0.65,"workload":0.85,"sleep_quality":0.2,"doctors_available":80}'),
('supply', 'Supply Collapse', 'Critical medicine and equipment shortages',
 '{"supply_chain_risk":0.7,"medicine_stock":0.2,"economic_pressure":0.75}'),
('mental', 'Mental Health Crisis', 'Widespread psychological collapse',
 '{"isolation_factor":0.85,"economic_pressure":0.8,"sleep_quality":0.25,"public_panic_level":0.7}'),
('optimal', 'Optimal Response', 'Coordinated, well-resourced crisis management',
 '{"infection_rate":0.12,"icu_beds":900,"doctors_available":420,"medicine_stock":0.95}')
ON CONFLICT (scenario_id) DO NOTHING;
