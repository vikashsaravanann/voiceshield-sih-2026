-- Replace the initial cleanup job with a schema-safe, idempotent policy.
-- detection_events uses `timestamp` (not created_at), and connection audit
-- records use a restricted enum that cannot represent maintenance events.
CREATE OR REPLACE FUNCTION public.dpdp_auto_destroy()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.challenge_responses
  WHERE created_at < now() - interval '24 hours';

  DELETE FROM public.detection_events
  WHERE timestamp < now() - interval '24 hours';

  DELETE FROM public.connection_audit_logs
  WHERE timestamp < now() - interval '24 hours';

  DELETE FROM public.auth_audit_logs
  WHERE timestamp < now() - interval '24 hours';

  DELETE FROM public.sessions
  WHERE started_at < now() - interval '24 hours';
END;
$$;

DO $$
BEGIN
  PERFORM cron.unschedule(jobid)
  FROM cron.job
  WHERE jobname IN (
    'voiceshield-dpdp-auto-destroy',
    'voiceshield-dpdp-retention'
  );
EXCEPTION
  WHEN undefined_table OR undefined_function THEN NULL;
END $$;

SELECT cron.schedule(
  'voiceshield-dpdp-retention',
  '30 18 * * *',
  $$SELECT public.dpdp_auto_destroy()$$
);
