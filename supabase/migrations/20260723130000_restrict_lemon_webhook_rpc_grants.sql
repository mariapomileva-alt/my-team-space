-- P0-08 follow-up: claim/upsert Lemon RPCs must be service_role only (not anon).
-- Rollback: re-grant execute to anon/authenticated if needed (not recommended).

revoke all on function public.claim_lemon_webhook_event(text, text, text) from public;
revoke all on function public.claim_lemon_webhook_event(text, text, text) from anon;
revoke all on function public.claim_lemon_webhook_event(text, text, text) from authenticated;
grant execute on function public.claim_lemon_webhook_event(text, text, text) to service_role;

revoke all on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz, timestamptz) from public;
revoke all on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz, timestamptz) from anon;
revoke all on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz, timestamptz) from authenticated;
grant execute on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz, timestamptz) to service_role;

revoke all on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz) from public;
revoke all on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz) from anon;
revoke all on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz) from authenticated;
grant execute on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz) to service_role;
