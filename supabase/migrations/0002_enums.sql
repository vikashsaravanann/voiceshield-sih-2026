-- Enum types for VoiceShield
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'analyst', 'demo_user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE session_status AS ENUM ('active', 'completed', 'flagged');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE connection_event AS ENUM ('connected', 'disconnected', 'reconnected', 'heartbeat_timeout', 'error');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE auth_event AS ENUM ('signup', 'login_success', 'login_failure', 'logout', 'token_refresh', 'password_change', 'mfa_challenge', 'session_expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
