-- DPDP data-minimisation control: remove transient voice-session evidence after 24 hours.
-- Sessions own detection events and audit rows, so the cascade removes dependent records.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

SELECT cron.unschedule('voiceshield-dpdp-retention')
WHERE EXISTS (
  SELECT 1
  FROM cron.job
  WHERE jobname = 'voiceshield-dpdp-retention'
);

SELECT cron.schedule(
  'voiceshield-dpdp-retention',
  '0 0 * * *',
  $$DELETE FROM public.sessions WHERE started_at < now() - interval '24 hours'$$
);
