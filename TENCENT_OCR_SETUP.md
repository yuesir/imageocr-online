# 腾讯云OCR服务配置指南

本项目集成了腾讯云OCR服务，提供高精度的图像文字识别功能。

## 前置条件

1. 拥有腾讯云账号
2. 开通腾讯云OCR服务
3. 获取API密钥

## 配置步骤

### 1. 开通腾讯云OCR服务

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 搜索并进入「文字识别OCR」服务
3. 开通「通用印刷体识别」服务
4. 根据需要选择合适的计费方式

### 2. 获取API密钥

1. 访问 [API密钥管理页面](https://console.cloud.tencent.com/cam/capi)
2. 点击「新建密钥」创建新的API密钥
3. 记录下 `SecretId` 和 `SecretKey`

### 3. 配置环境变量

1. 复制 `.env.example` 文件为 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入腾讯云配置：
   ```env
   # 腾讯云OCR配置
   TENCENT_SECRET_ID=your_actual_secret_id
   TENCENT_SECRET_KEY=your_actual_secret_key
   TENCENT_REGION=ap-beijing
   ```

### 4. 地域选择

根据您的业务需求选择合适的地域：

- `ap-beijing` - 北京
- `ap-shanghai` - 上海
- `ap-guangzhou` - 广州
- `ap-chengdu` - 成都
- `ap-chongqing` - 重庆
- `ap-nanjing` - 南京
- `ap-tianjin` - 天津
- `ap-shenzhen` - 深圳
- `ap-hongkong` - 香港
- `ap-singapore` - 新加坡
- `ap-mumbai` - 孟买
- `ap-seoul` - 首尔
- `ap-bangkok` - 曼谷
- `ap-tokyo` - 东京
- `na-siliconvalley` - 硅谷
- `na-ashburn` - 弗吉尼亚
- `eu-frankfurt` - 法兰克福

## API接口说明

### 接口地址
```
POST /api/ocr/tencent
```

### 请求参数

#### 方式一：通过文件ID
```json
{
  "fileId": "uuid-string"
}
```

#### 方式二：通过图片URL
```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```

#### 方式三：通过Base64编码
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

### 响应格式

```json
{
  "success": true,
  "result": {
    "id": "result-id",
    "text": "识别出的文字内容",
    "confidence": 0.95,
    "language": "zh",
    "word_count": 10,
    "character_count": 25,
    "processing_time": 1500,
    "status": "completed",
    "provider": "tencent",
    "text_detections": [
      {
        "text": "单个文字块",
        "confidence": 0.98,
        "polygon": [
          {"X": 100, "Y": 50},
          {"X": 200, "Y": 50},
          {"X": 200, "Y": 80},
          {"X": 100, "Y": 80}
        ]
      }
    ]
  }
}
```

### 错误处理

常见错误码及处理方式：

- `401` - 认证失败：检查SecretId和SecretKey是否正确
- `400` - 参数错误：检查请求参数格式
- `429` - 请求频率超限：降低请求频率
- `500` - 服务器错误：检查网络连接和服务状态

## 图片要求

- **格式**：JPG、JPEG、PNG、BMP、GIF、WEBP
- **大小**：不超过7MB
- **分辨率**：建议不低于15×15像素，不超过4096×4096像素
- **URL要求**：图片URL需要可公开访问

## 计费说明

腾讯云OCR服务按调用次数计费，具体价格请参考：
[腾讯云OCR计费说明](https://cloud.tencent.com/document/product/866/17619)

## 安全建议

1. **密钥安全**：
   - 不要将API密钥提交到代码仓库
   - 定期轮换API密钥
   - 使用子账号和最小权限原则

2. **访问控制**：
   - 配置IP白名单（如果需要）
   - 监控API调用情况

3. **数据安全**：
   - 敏感图片建议使用HTTPS传输
   - 及时清理临时文件

## 故障排查

### 常见问题

1. **认证失败**
   - 检查SecretId和SecretKey是否正确
   - 确认账号是否开通OCR服务
   - 检查账号余额是否充足

2. **网络错误**
   - 检查服务器网络连接
   - 确认防火墙设置
   - 尝试更换地域

3. **图片识别失败**
   - 检查图片格式和大小
   - 确认图片内容清晰
   - 验证图片URL可访问性

### 调试模式

开发环境下可以查看详细的错误日志：
```bash
npm run dev
```

错误信息会在控制台输出，帮助定位问题。

## 技术支持

如遇到问题，可以：
1. 查看腾讯云OCR官方文档
2. 提交工单到腾讯云技术支持
3. 在项目Issues中反馈问题