do $$ begin
  create type vs_risk_level as enum ('green', 'amber', 'red');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type vs_profile_role as enum ('analyst', 'admin');
exception when duplicate_object then null;
end $$;
