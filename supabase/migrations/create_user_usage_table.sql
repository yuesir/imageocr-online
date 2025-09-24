-- 创建用户使用统计表
CREATE TABLE IF NOT EXISTS user_usage (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL, -- 用户邮箱地址
  date DATE NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建唯一索引，确保每个邮箱每天只有一条记录
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_usage_email_date ON user_usage(email, date);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_usage_date ON user_usage(date);
CREATE INDEX IF NOT EXISTS idx_user_usage_email ON user_usage(email);

-- 启用行级安全策略
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许匿名用户和认证用户读取和写入（API需要）
CREATE POLICY "Allow anonymous and authenticated users to manage user_usage" ON user_usage
  FOR ALL USING (true);

-- 授予权限
GRANT ALL PRIVILEGES ON user_usage TO anon;
GRANT ALL PRIVILEGES ON user_usage TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE user_usage_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE user_usage_id_seq TO authenticated;

-- 添加注释
COMMENT ON TABLE user_usage IS '用户使用统计表，用于跟踪已登录用户的每日OCR使用次数';
COMMENT ON COLUMN user_usage.email IS '用户邮箱地址';
COMMENT ON COLUMN user_usage.date IS '使用日期（YYYY-MM-DD格式）';
COMMENT ON COLUMN user_usage.count IS '当日使用次数';
COMMENT ON COLUMN user_usage.created_at IS '记录创建时间';
COMMENT ON COLUMN user_usage.updated_at IS '记录更新时间';