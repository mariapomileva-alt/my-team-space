-- If team_billing still has legacy Stripe column names, rename to Lemon Squeezy.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'team_billing' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE public.team_billing RENAME COLUMN stripe_customer_id TO lemon_customer_id;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'team_billing' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE public.team_billing RENAME COLUMN stripe_subscription_id TO lemon_subscription_id;
  END IF;
END $$;
