const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { error } = require('./utils/apiResponse');

const app = express();

// 1. Security Headers
app.use(helmet({
  contentSecurityPolicy: false // Allows unpkg and Google Fonts to load safely for interactive API documentation
}));

// 2. Cross-Origin Requests Setup
app.use(cors({
  origin: '*', // Allow all origins for internship evaluation convenience, customisable in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Logger Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 4. Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Global API Rate Limiter
app.use('/api', apiLimiter);

// 6. Base Routes mount
app.use('/api', routes);

// 7. Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 8. Interactive API Documentation (Sleek Dark Mode Swagger UI via CDN)
const swaggerDocument = require('./config/swagger.json');

app.get('/api/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});

app.get('/api-docs', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GitScope Analyzer — Interactive API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366F1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4'%3E%3C/path%3E%3Cpath d='M9 18c-4.51 2-5-2-7-2'%3E%3C/path%3E%3C/svg%3E" />
  <style>
    body {
      background-color: #080b11 !important;
      margin: 0;
      font-family: 'Inter', sans-serif !important;
    }
    .swagger-ui {
      background-color: #080b11 !important;
      color: #d1d5db !important;
      font-family: 'Inter', sans-serif !important;
      padding-bottom: 50px;
    }
    .swagger-ui .info {
      margin: 30px 0 !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
      padding-bottom: 30px !important;
    }
    .swagger-ui .info .title {
      color: #f3f4f6 !important;
      font-family: 'Outfit', sans-serif !important;
      font-weight: 700 !important;
    }
    .swagger-ui .info p, .swagger-ui .info li, .swagger-ui .info td, .swagger-ui .info a {
      color: #9ca3af !important;
    }
    .swagger-ui .info a {
      color: #818cf8 !important;
      text-decoration: none !important;
    }
    .swagger-ui .info a:hover {
      text-decoration: underline !important;
    }
    .swagger-ui .scheme-container {
      background-color: #0f172a !important;
      box-shadow: none !important;
      border: 1px solid rgba(255, 255, 255, 0.05) !important;
      border-radius: 8px !important;
      margin: 20px 0 !important;
      padding: 15px !important;
    }
    .swagger-ui .opblock {
      background: #0f172a !important;
      border: 1px solid rgba(255, 255, 255, 0.05) !important;
      box-shadow: none !important;
      border-radius: 8px !important;
    }
    .swagger-ui .opblock .opblock-summary {
      padding: 10px 15px !important;
    }
    .swagger-ui .opblock .opblock-summary-method {
      border-radius: 6px !important;
      font-family: 'Inter', sans-serif !important;
      font-weight: 700 !important;
    }
    .swagger-ui .opblock-description-wrapper p, .swagger-ui .opblock-external-docs-wrapper p, .swagger-ui .opblock-title_normal p, .swagger-ui .opblock-title_normal {
      color: #e5e7eb !important;
    }
    .swagger-ui .opblock .opblock-summary-path {
      color: #f3f4f6 !important;
      font-family: 'Inter', sans-serif !important;
    }
    .swagger-ui .opblock .opblock-summary-description {
      color: #9ca3af !important;
      font-family: 'Inter', sans-serif !important;
    }
    .swagger-ui .btn {
      background-color: #1e293b !important;
      color: #f3f4f6 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 6px !important;
      box-shadow: none !important;
      transition: all 0.2s !important;
    }
    .swagger-ui .btn:hover {
      background-color: #334155 !important;
      border-color: rgba(255, 255, 255, 0.15) !important;
    }
    .swagger-ui select {
      background-color: #0f172a !important;
      color: #f3f4f6 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 6px !important;
    }
    .swagger-ui input[type=text] {
      background-color: #0f172a !important;
      color: #f3f4f6 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 6px !important;
      padding: 6px 10px !important;
    }
    .swagger-ui .table-container {
      padding: 10px 15px !important;
    }
    .swagger-ui table thead tr td, .swagger-ui table thead tr th {
      color: #f3f4f6 !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    }
    .swagger-ui table tbody tr td {
      padding: 12px 0 !important;
    }
    .swagger-ui .parameters-col_name {
      color: #f3f4f6 !important;
    }
    .swagger-ui .parameter__name.required:after {
      color: #ef4444 !important;
    }
    .swagger-ui .parameter__type {
      color: #818cf8 !important;
    }
    .swagger-ui .responses-table {
      background: transparent !important;
    }
    .swagger-ui .response-col_status {
      color: #f3f4f6 !important;
      font-weight: 600 !important;
    }
    .swagger-ui .response-col_links {
      color: #9ca3af !important;
    }
    .swagger-ui .opblock-body pre {
      background-color: #020617 !important;
      border: 1px solid rgba(255, 255, 255, 0.05) !important;
      border-radius: 6px !important;
      color: #38bdf8 !important;
    }
    .swagger-ui .model-box {
      background-color: #1e293b !important;
      border: 1px solid rgba(255, 255, 255, 0.05) !important;
      border-radius: 6px !important;
      padding: 10px !important;
    }
    .swagger-ui .model {
      color: #f3f4f6 !important;
    }
    .swagger-ui .prop-type {
      color: #818cf8 !important;
    }
    .swagger-ui .prop-format {
      color: #9ca3af !important;
    }
    .swagger-ui .topbar {
      display: none !important;
    }
    .swagger-ui .expand-methods, .swagger-ui .expand-operation {
      color: #9ca3af !important;
    }
    .brand-header {
      background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 22px;
      letter-spacing: -0.5px;
    }
    .brand-logo svg {
      width: 32px;
      height: 32px;
      stroke: #818cf8;
    }
    .back-btn {
      color: #9ca3af;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 6px 16px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.02);
      font-family: 'Inter', sans-serif !important;
    }
    .back-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.15);
    }
  </style>
</head>
<body>
  <div class="brand-header">
    <div class="brand-logo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
      <span>GitScope <span style="color:#818cf8">Analyzer</span></span>
    </div>
    <a href="https://frontend-pi-seven-47.vercel.app" class="back-btn">← Back to Dashboard</a>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
        deepLinking: true
      });
    };
  </script>
</body>
</html>
  `);
});

// 8. 404 Route Fallback
app.use((req, res, next) => {
  return error(res, `Endpoint '${req.originalUrl}' not found. Please verify route paths.`, 404);
});

// 9. Central Error Handler (must be last)
app.use(errorHandler);

module.exports = app;
