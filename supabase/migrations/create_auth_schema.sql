-- Create roles enum
CREATE TYPE user_role AS ENUM (
  'superadmin',
  'company_admin',
  'hr_admin',
  'manager',
  'employee'
);

-- Create user_roles table to manage user roles
CREATE TABLE user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, organization_id)
);

-- Create index for user roles
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_organization ON user_roles(organization_id);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
