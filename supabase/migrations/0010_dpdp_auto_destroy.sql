-- ============================================================
-- VoiceShield — DPDP Automated Data Destruction
-- Supabase pg_cron job: runs every night at midnight IST
-- SIH26104 | AICTE Cyber Security Cell
-- ============================================================
-- INSTRUCTIONS:
-- 1. Go to https://supabase.com/dashboard/project/ynxmidkzwxhsvoyqmpsh/sql/new
-- 2. Paste and run the entire contents of this file.
-- 3. The pg_cron job will be created and will auto-run every night at 18:30 UTC (midnight IST).
-- ============================================================

-- Step 1: Enable pg_cron extension (may already be enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Step 2: Create the cleanup function
CREATE OR REPLACE FUNCTION public.dpdp_auto_destroy()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_events int;
  deleted_sessions int;
  deleted_challenges int;
BEGIN
  -- Delete detection events older than 24 hours
  DELETE FROM public.detection_events
  WHERE created_at < NOW() - INTERVAL '24 hours';
  GET DIAGNOSTICS deleted_events = ROW_COUNT;

  -- Delete challenge responses older than 24 hours
  DELETE FROM public.challenge_responses
  WHERE created_at < NOW() - INTERVAL '24 hours';
  GET DIAGNOSTICS deleted_challenges = ROW_COUNT;

  -- Delete completed/flagged sessions older than 24 hours (keep active ones)
  DELETE FROM public.sessions
  WHERE started_at < NOW() - INTERVAL '24 hours'
  AND status IN ('completed', 'flagged', 'dropped');
  GET DIAGNOSTICS deleted_sessions = ROW_COUNT;

  -- Log the destruction in the audit table (immutable record for DPDP compliance)
  INSERT INTO public.connection_audit_logs (session_id, event_type, metadata)
  VALUES (
    gen_random_uuid()::text,
    'dpdp_auto_destroy',
    jsonb_build_object(
      'destroyed_events', deleted_events,
      'destroyed_sessions', deleted_sessions,
      'destroyed_challenges', deleted_challenges,
      'timestamp', NOW(),
      'policy', 'DPDP Act 2023 - 24hr data retention limit',
      'compliant', true
    )
  );

  RAISE NOTICE 'DPDP Cleanup: % events, % sessions, % challenges destroyed at %',
    deleted_events, deleted_sessions, deleted_challenges, NOW();
END;
$$;

-- Step 3: Schedule it to run every night at 18:30 UTC (= 00:00 IST)
SELECT cron.schedule(
  'voiceshield-dpdp-auto-destroy',   -- Job name
  '30 18 * * *',                      -- Cron: 18:30 UTC = midnight IST
  $$ SELECT public.dpdp_auto_destroy(); $$
);

-- Step 4: Verify the job was created
SELECT jobid, jobname, schedule, command, active
FROM cron.job
WHERE jobname = 'voiceshield-dpdp-auto-destroy';
