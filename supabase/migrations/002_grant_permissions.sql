-- Grant permissions to anon role for public access
GRANT SELECT ON public.files TO anon;
GRANT INSERT ON public.files TO anon;
GRANT UPDATE ON public.files TO anon;
GRANT DELETE ON public.files TO anon;

GRANT SELECT ON public.ocr_results TO anon;
GRANT INSERT ON public.ocr_results TO anon;
GRANT UPDATE ON public.ocr_results TO anon;
GRANT DELETE ON public.ocr_results TO anon;

-- Grant full permissions to authenticated role
GRANT ALL PRIVILEGES ON public.users TO authenticated;
GRANT ALL PRIVILEGES ON public.user_preferences TO authenticated;
GRANT ALL PRIVILEGES ON public.files TO authenticated;
GRANT ALL PRIVILEGES ON public.ocr_results TO authenticated;
GRANT ALL PRIVILEGES ON public.result_exports TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;