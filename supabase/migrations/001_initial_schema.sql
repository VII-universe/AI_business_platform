-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id TEXT NOT NULL, -- Clerk user ID
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'agency')),
  white_label JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users (synced from Clerk)
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- Clerk user ID
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Onboarding data
CREATE TABLE onboarding_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  step_data JSONB NOT NULL DEFAULT '{}',
  completed_steps INTEGER[] NOT NULL DEFAULT '{}',
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- Brand boards
CREATE TABLE brand_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  logo_url TEXT NOT NULL DEFAULT '',
  logo_variants TEXT[] NOT NULL DEFAULT '{}',
  colors JSONB NOT NULL DEFAULT '{}',
  fonts JSONB NOT NULL DEFAULT '{}',
  brand_voice TEXT,
  brand_personality TEXT[] NOT NULL DEFAULT '{}',
  industry TEXT,
  target_audience TEXT,
  guidelines_pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- Model configs
CREATE TABLE model_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'anthropic' CHECK (provider IN ('anthropic', 'openai', 'replicate')),
  model_id TEXT NOT NULL,
  system_prompt TEXT,
  temperature FLOAT DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 2048,
  cost_limit_per_call FLOAT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prompt templates (versioned)
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  module_name TEXT NOT NULL,
  template TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  ab_variant TEXT CHECK (ab_variant IN ('A', 'B')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI audit log
CREATE TABLE ai_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  module_name TEXT NOT NULL,
  model_id TEXT NOT NULL,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  cost_usd FLOAT NOT NULL DEFAULT 0,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  source TEXT,
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  stage TEXT NOT NULL DEFAULT 'new' CHECK (stage IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  ai_insights TEXT,
  last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  channels TEXT[] NOT NULL DEFAULT '{}',
  budget FLOAT NOT NULL DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  ai_strategy TEXT,
  kpis JSONB NOT NULL DEFAULT '{}',
  external_ids JSONB NOT NULL DEFAULT '{}', -- Google/Meta campaign IDs
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Content items
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('blog_post', 'social_post', 'email', 'ad_copy', 'presentation', 'sms')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automations
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB NOT NULL DEFAULT '{}',
  workflow_nodes JSONB NOT NULL DEFAULT '[]',
  workflow_edges JSONB NOT NULL DEFAULT '[]',
  run_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI decisions log
CREATE TABLE ai_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  module_name TEXT NOT NULL,
  decision_type TEXT NOT NULL,
  input_context JSONB,
  decision TEXT NOT NULL,
  reasoning TEXT,
  confidence FLOAT,
  was_applied BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_leads_tenant ON leads(tenant_id);
CREATE INDEX idx_leads_stage ON leads(tenant_id, stage);
CREATE INDEX idx_campaigns_tenant ON campaigns(tenant_id);
CREATE INDEX idx_content_tenant ON content_items(tenant_id, type);
CREATE INDEX idx_audit_log_tenant ON ai_audit_log(tenant_id, created_at DESC);
CREATE INDEX idx_model_configs_lookup ON model_configs(module_name, tenant_id, is_active);

-- Default global model configs
INSERT INTO model_configs (module_name, provider, model_id, temperature, max_tokens) VALUES
  ('brand_strategy', 'anthropic', 'claude-sonnet-4-6', 0.8, 4096),
  ('campaign_strategy', 'anthropic', 'claude-sonnet-4-6', 0.7, 6000),
  ('campaign_optimization', 'anthropic', 'claude-sonnet-4-6', 0.5, 2000),
  ('content_blog_post', 'anthropic', 'claude-sonnet-4-6', 0.8, 4000),
  ('content_ad_copy', 'anthropic', 'claude-sonnet-4-6', 0.9, 2000),
  ('content_email', 'anthropic', 'claude-sonnet-4-6', 0.7, 2000),
  ('content_social_post', 'anthropic', 'claude-sonnet-4-6', 0.9, 1500),
  ('content_social_calendar', 'anthropic', 'claude-sonnet-4-6', 0.8, 8000),
  ('lead_scoring', 'anthropic', 'claude-sonnet-4-6', 0.3, 1000),
  ('weekly_digest', 'anthropic', 'claude-sonnet-4-6', 0.7, 3000);

-- Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_audit_log ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (used in API routes)
-- Application-level tenant_id filtering is enforced in API layer
