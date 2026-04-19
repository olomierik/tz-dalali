CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = _user_id
      AND role = ANY (ARRAY['admin'::public.user_role, 'superadmin'::public.user_role])
  );
$$;

DROP POLICY IF EXISTS admin_all_users ON public.users;

CREATE POLICY admin_all_users
ON public.users
FOR ALL
TO public
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));