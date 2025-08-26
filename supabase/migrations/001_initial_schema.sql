-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE public.user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'en',
  ocr_language TEXT DEFAULT 'eng',
  auto_detect_language BOOLEAN DEFAULT true,
  save_history BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create files table
CREATE TABLE public.files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  upload_status TEXT DEFAULT 'uploading' CHECK (upload_status IN ('uploading', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ocr_results table
CREATE TABLE public.ocr_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  file_id UUID REFERENCES public.files(id) ON DELETE CASCADE NOT NULL,
  extracted_text TEXT NOT NULL,
  confidence_score DECIMAL(5,4),
  language_detected TEXT,
  processing_time INTEGER, -- in milliseconds
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create result_exports table
CREATE TABLE public.result_exports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  ocr_result_id UUID REFERENCES public.ocr_results(id) ON DELETE CASCADE NOT NULL,
  export_format TEXT NOT NULL CHECK (export_format IN ('txt', 'pdf', 'docx', 'json')),
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_files_user_id ON public.files(user_id);
CREATE INDEX idx_files_created_at ON public.files(created_at DESC);
CREATE INDEX idx_ocr_results_user_id ON public.ocr_results(user_id);
CREATE INDEX idx_ocr_results_file_id ON public.ocr_results(file_id);
CREATE INDEX idx_ocr_results_created_at ON public.ocr_results(created_at DESC);
CREATE INDEX idx_result_exports_user_id ON public.result_exports(user_id);
CREATE INDEX idx_result_exports_ocr_result_id ON public.result_exports(ocr_result_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ocr_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.result_exports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for user_preferences table
CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences" ON public.user_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for files table
CREATE POLICY "Users can view own files" ON public.files
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own files" ON public.files
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own files" ON public.files
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own files" ON public.files
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Create RLS policies for ocr_results table
CREATE POLICY "Users can view own OCR results" ON public.ocr_results
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own OCR results" ON public.ocr_results
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own OCR results" ON public.ocr_results
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own OCR results" ON public.ocr_results
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Create RLS policies for result_exports table
CREATE POLICY "Users can view own exports" ON public.result_exports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exports" ON public.result_exports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own exports" ON public.result_exports
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create default user preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ocr_results_updated_at
  BEFORE UPDATE ON public.ocr_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();