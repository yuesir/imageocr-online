-- 创建IP使用统计表
CREATE TABLE IF NOT EXISTS ip_usage (
  id SERIAL PRIMARY KEY,
  ip VARCHAR(45) NOT NULL, -- 支持IPv4和IPv6
  date DATE NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建唯一索引，确保每个IP每天只有一条记录
CREATE UNIQUE INDEX IF NOT EXISTS idx_ip_usage_ip_date ON ip_usage(ip, date);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_ip_usage_date ON ip_usage(date);
CREATE INDEX IF NOT EXISTS idx_ip_usage_ip ON ip_usage(ip);

-- 启用行级安全策略
ALTER TABLE ip_usage ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许匿名用户和认证用户读取和写入（API需要）
CREATE POLICY "Allow anonymous and authenticated users to manage ip_usage" ON ip_usage
  FOR ALL USING (true);

-- 授予权限
GRANT ALL PRIVILEGES ON ip_usage TO anon;
GRANT ALL PRIVILEGES ON ip_usage TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE ip_usage_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE ip_usage_id_seq TO authenticated;

-- 添加注释
COMMENT ON TABLE ip_usage IS 'IP使用统计表，用于跟踪未登录用户的每日OCR使用次数';
COMMENT ON COLUMN ip_usage.ip IS '客户端IP地址';
COMMENT ON COLUMN ip_usage.date IS '使用日期（YYYY-MM-DD格式）';
COMMENT ON COLUMN ip_usage.count IS '当日使用次数';
COMMENT ON COLUMN ip_usage.created_at IS '记录创建时间';
COMMENT ON COLUMN ip_usage.updated_at IS '记录更新时间';