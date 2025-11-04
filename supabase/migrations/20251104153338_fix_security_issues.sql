/*
  # Fix Security Issues

  1. Remove unused index
    - Drop `idx_messages_timestamp` as it's not being used in queries

  2. Fix function search path security
    - Add `SECURITY DEFINER` and set explicit `search_path` for `update_updated_at_column` function
    - This prevents search_path manipulation attacks

  3. Notes
    - The function will now run with the privileges of the function owner
    - Search path is explicitly set to prevent malicious schema injection
*/

-- Drop unused index
DROP INDEX IF EXISTS idx_messages_timestamp;

-- Recreate the update_updated_at_column function with proper security
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
