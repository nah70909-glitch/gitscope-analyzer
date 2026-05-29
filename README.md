# 🚀 GitScope Analyzer — AI-Powered GitHub Developer Intelligence Platform

> **A premium developer metrics SaaS platform that calculates, indexes, and visualizes developer intelligence insights from the GitHub REST API.** Designed as a production-grade full-stack platform, featuring structured MVC routing, automatic database dialect fallback support, detailed scoring algorithms, and a gorgeous glassmorphic dashboard built using React, Tailwind CSS, and Recharts.

---

## 🌐 Live Production Deployments

* **🚀 Live SaaS Application**: [https://frontend-pi-seven-47.vercel.app](https://frontend-pi-seven-47.vercel.app)
* **📖 Interactive API Specs (Swagger UI)**: [https://gitscope-analyzer-production.up.railway.app/api-docs](https://gitscope-analyzer-production.up.railway.app/api-docs)
* **🟢 Backend Health Check**: [https://gitscope-analyzer-production.up.railway.app/health](https://gitscope-analyzer-production.up.railway.app/health)

---

## 💎 Key Features

- **🔎 High-Performance Profile Analysis**: Resolves any public GitHub profile in real-time. Instantly pulls and indexes profile info and public repository databases (supporting pagination for highly active accounts).
- **⚡ Log-Scaled Intelligent Scoring**: Grades developer profiles on a mathematically balanced, logarithmic scale from **0 to 100**, assigning official engineering ranks like *10x Mythic Developer*, *Elite Architect*, and *Rising Tech Lead*.
- **📊 Interactive Charts & Analytics Widgets**: Visualizes programming language frequency (grouped by official colors) and repository sizes with fluid mouseover details using Recharts.
- **🏆 Live Aggregated Leaderboard**: Highlights tracked developer rankings, allowing direct profile loading or cascade deletion of historical records.
- **📈 Global System Analytics**: Monitors tracked platform-wide metrics (average age of accounts, stars per profile, and rank distributions).
- **⚙️ Double-Click & Zero-Config SQLite Fallback**: Instantly runs out-of-the-box by automatically defaulting to SQLite if a local MySQL instance is not configured in the `.env` parameters!

---

## 🛠️ Stack & Architecture

### Frontend
- **Framework**: React 18 (Vite, fast hot reloading)
- **Styling**: Tailwind CSS (custom dark mode theme, backdrop-filters, custom scroll bars)
- **Animations**: Framer Motion (sleek slide-ins and fade-out layouts)
- **Charts**: Recharts (responsive vector gauges and bar graphs)
- **Client**: Axios (preconfigured timeout hooks and baseURL bindings)

### Backend
- **Framework**: Node.js & Express.js (centralised routers)
- **Database Layer**: Sequelize ORM (supporting MySQL & SQLite dialecting)
- **Security Headers**: Helmet & CORS configurations
- **Logging**: Morgan (formatted console outputs)
- **Input Inspection**: Custom regex validations for query parameter paths

---

## 🗄️ Database Design (MySQL Schema)

Sequelize automatically generates these tables and relationship structures on application startup:

### 1. `developers`
Contains primary credentials, accumulated metrics, and intelligence rankings.
- `id` (INT, Primary Key, Auto-Increment)
- `username` (VARCHAR, Unique, Indexed)
- `name` (VARCHAR, Nullable)
- `avatarUrl` (VARCHAR, Nullable)
- `bio` (TEXT, Nullable)
- `location`, `blog`, `company`, `twitterUsername` (VARCHAR, Nullable)
- `followers`, `following`, `publicRepos` (INT, Default `0`)
- `totalStars`, `totalForks` (INT, Default `0`)
- `accountAgeYears` (FLOAT, Default `0.0`)
- `topLanguage` (VARCHAR, Default `'None'`)
- `mostStarredRepo` (VARCHAR, Nullable)
- `developerScore` (INT, Default `0`, Indexed)
- `developerRank` (VARCHAR, Default `'Code Novice'`)
- `githubCreatedAt` (DATE, Nullable)
- `lastAnalyzedAt` (DATE)

### 2. `repositories`
Aggregates codebase details from analyzed developers (connected with a **one-to-many cascading delete relation** to the parent `developers` record).
- `id` (INT, Primary Key, Auto-Increment)
- `developerId` (INT, Foreign Key references `developers.id`, Cascade Delete)
- `name` (VARCHAR, Non-Null)
- `description` (TEXT, Nullable)
- `language` (VARCHAR, Default `'None'`, Indexed)
- `stars`, `forks`, `watchers`, `size` (INT, Default `0`)
- `githubUrl` (VARCHAR, Nullable)
- `isFork` (BOOLEAN, Default `false`)

### 3. `search_histories`
Stores search history analytics to feed the recent search widgets.
- `id` (INT, Primary Key)
- `username` (VARCHAR, Unique)
- `searchCount` (INT, Default `1`)
- `lastSearchedAt` (DATE)

---

## 🎛️ The Developer Scoring Engine

Calculations are evaluated logarithmically to reward active builders, capping at a maximum of **100 Points**:

1. **Followers Count** (Max **25 Points**): `Math.min(25, Math.round(Math.log10(followers + 1) * 7.5))`
2. **Aggregated Stars** (Max **35 Points**): `Math.min(35, Math.round(Math.log10(totalStars + 1) * 10))`
3. **Aggregated Forks** (Max **15 Points**): `Math.min(15, Math.round(Math.log10(totalForks + 1) * 5))`
4. **Account Age / Longevity** (Max **10 Points**): `Math.min(10, Math.round(years * 1.5))`
5. **Codebase Diversity / Repos count** (Max **15 Points**): `Math.min(15, Math.round(Math.log10(reposCount + 1) * 5))`

### Rank Assignment Matrix:
- **`80 - 100`**: `10x Mythic Developer` (Immense community impact, exceptional metrics)
- **`60 - 79`**: `Elite Architect` (Outstanding technical skills and popular systems)
- **`40 - 59`**: `Rising Tech Lead` (Solid profiles with diverse repository counts)
- **`20 - 39`**: `Scrappy Builder` (Active repositories with steady traction)
- **`< 20`**: `Code Novice` (Getting started on their engineering journey)

---

## 📡 REST API Specifications

All JSON responses strictly follow the production-grade standard format:
```json
{
  "success": true,
  "message": "Custom operation message details",
  "data": {}
}
```

| HTTP Method | Route Endpoint | Purpose | Validation |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/analyze/:username` | Trigger GitHub API fetch, calculate score, and upsert DB | Username constraints regex (max 39 chars) |
| **GET** | `/api/users` | List analyzed developer profiles with pagination and filters | Supported queries: `page`, `limit`, `sortBy`, `search`, `language` |
| **GET** | `/api/users/:id` | Fetch full developer details with all nested repositories | Validates positive integer parameters |
| **DELETE**| `/api/users/:id` | Cascades delete developer and repository tables by ID | Validates positive integer parameters |
| **GET** | `/api/top-developers` | Fetch the top 10 ranked profiles (Leaderboard) | None |
| **GET** | `/api/trending` | Fetch recently analyzed developer profiles | None |
| **GET** | `/api/stats/platform` | Aggregate global developer stars, forks, language distributions | None |
| **GET** | `/api/search?language=js`| Return list of developers matching the top language query | Requires query string parameter `language` |

---

## 🚀 Setup & Launch (Local Execution)

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- Optional: [MySQL Server](https://www.mysql.com/) (If unconfigured, the app falls back to a zero-config SQLite file automatically!)

### Step 1: Clone and Enter Directory
```bash
git clone <repository-url>
cd "git scope analyzer"
```

### Step 2: Configure Environment (.env)
Create a `.env` file in the `backend/` folder:
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and update details as needed:
```env
PORT=5000
NODE_ENV=development

# MySQL Configurations
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=gitscope_db

# GitHub API (Optional but highly recommended to raise API cap from 60 to 5000/hr)
# GITHUB_TOKEN=your_personal_access_token
```

> **💡 SQLite Zero-Config Tip:**
> If you don't have MySQL installed, simply update `backend/.env` to:
> ```env
> DB_DIALECT=sqlite
> ```
> The system will instantly spin up a local `.sqlite` file database inside the `backend` folder with zero configuration!

### Step 3: Install & Start Backend
```bash
cd backend
npm install
npm run start
```
*The server will boot on `http://localhost:5000` and automatically create the database structure and sync schemas.*

### Step 4: Install & Start Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The browser will launch on `http://localhost:3000` with hot-reloading active.*

---

## 🧪 Running DB Sanity Checks
Verify that the database associations, primary keys, and foreign cascading logic are operating properly by running:
```bash
cd backend
node src/test-db.js
```
*The script initializes a sandbox, creates mock entries, tests cascading deletions, and logs clean validation logs.*

---

## ☁️ Deployment Guidelines

### 1. Backend (Render / Railway)
- Connect your GitHub repository.
- Root directory: `backend`
- Start Command: `npm run start`
- Inject environment parameters: `PORT`, `NODE_ENV=production`, `DB_DIALECT` (along with production MySQL server settings), and `GITHUB_TOKEN`.

### 2. Frontend (Vercel)
- Connect the same repository.
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Inject environment variable: `VITE_API_URL` pointing to your deployed backend address (e.g. `https://gitscope-api.onrender.com/api`).

---

## 🔮 Future Improvements Roadmap
- [ ] **GitHub OAuth Integration**: Let developers authenticate to immediately pull and analyze private repository code structures.
- [ ] **Deep Code Quality Scans**: Integrate ESLint metrics and comment-to-code ratios to reward clean code practices.
- [ ] **Developer Matchmaking Engine**: Allow tech recruiters to search for candidates based on customized scoring weights.
