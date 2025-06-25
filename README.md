# Mumicah Ecosystem - Monorepo

A comprehensive language learning and development ecosystem consisting of three interconnected applications: **Conversate** (language learning), **DevMentor** (software engineering), and **ContentFlow** (content creation).

## 🏗️ Architecture

This monorepo uses **Turborepo** with **pnpm workspaces** to manage multiple applications and shared packages efficiently.

```
mumicah-ecosystem/
├── apps/                        # Applications
│   ├── conversate-web/          # Language learning web app (Current)
│   ├── devmentor-web/          # Software engineering platform (Planned)
│   ├── contentflow-web/        # Content creation platform (Planned)
│   ├── mobile-app/             # Unified mobile app (Planned)
│   └── admin-dashboard/        # Management console (Planned)
├── packages/                   # Shared packages
│   ├── shared/                 # Common utilities and types
│   ├── ui/                     # Shared component library (Planned)
│   ├── auth/                   # Authentication system (Planned)
│   └── database/               # Shared database models (Planned)
├── scripts/                    # Development scripts
├── types/                      # Global type definitions
└── project-planning/           # Strategic documents (private)
```

## 🌟 Features

- **AI-Powered Conversations**: Practice with intelligent AI personas that adapt to your skill level
- **Multi-Language Support**: Learn Spanish, French, German, Italian, and more
- **Speech Analysis**: Advanced pronunciation feedback and improvement suggestions
- **Cultural Context**: Learn not just the language, but the culture behind it
- **Progress Tracking**: Detailed analytics to track your learning journey
- **Community Features**: Connect with other learners and native speakers

## 🚀 Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **UI Components**: ShadCN/UI with Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI GPT-4, Anthropic Claude
- **Speech Processing**: OpenAI Whisper
- **Deployment**: Vercel

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- MongoDB instance

### Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd mumicah-ecosystem
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp apps/conversate-web/.env.example apps/conversate-web/.env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
# Start all apps
pnpm dev

# Or start specific app
pnpm conversate:dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

### Monorepo Commands

```bash
# Build all apps
pnpm build

# Start development for all apps
pnpm dev

# Run conversate-web only
pnpm conversate:dev

# Type check all packages
pnpm type-check

# Lint all packages
pnpm lint
```

### Environment Variables

Required environment variables (see `.env.example`):

- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `OPENAI_API_KEY` - OpenAI API key for AI conversations
- `NEXT_PUBLIC_APP_URL` - Application URL

## 📁 Project Structure

```
apps/conversate-web/src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
├── lib/             # Utility functions and configurations
├── models/          # Database models
├── services/        # Business logic and API integrations
├── types/           # TypeScript type definitions
└── data/            # Static data and conversation patterns

packages/
├── shared/          # Common utilities and types
└── ui/              # Shared component library (planned)
```

## 🌟 Ecosystem Vision

### **Current: Conversate** - Language Learning Platform
- ✅ AI-powered conversations with unique personas
- ✅ Speech recognition and synthesis
- ✅ Adaptive difficulty adjustment
- ✅ Progress tracking and analytics

### **Planned: DevMentor** - Software Engineering Platform
- 🟡 AI coding mentors with different specialties
- 🟡 Code review and feedback systems
- 🟡 Project-based learning paths
- 🟡 Technical skill assessments

### **Planned: ContentFlow** - Content Creation Platform
- 🟡 Multilingual content creation tools
- 🟡 Translation assistance
- 🟡 Community publishing platform
- 🟡 Revenue sharing for creators

### **Planned: Mobile App** - Unified Experience
- 🟡 Single app for all three platforms
- 🟡 Tab-based navigation
- 🟡 Offline capabilities
- 🟡 Voice-first interactions

## 🎯 Core Concepts

### AI Personas

The platform features multiple AI personas, each with unique:
- Teaching styles and approaches
- Cultural backgrounds and expertise
- Conversation patterns and feedback methods

### Learning Progression

- **CEFR Level Tracking**: Standard European framework progression
- **Skill-Based Assessment**: Conversation fluency, pronunciation, cultural competency
- **Adaptive Difficulty**: Content adjusts to user performance in real-time

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Documentation](https://docs.mumicah.com)
- [Support](https://support.mumicah.com)
- [Community](https://community.mumicah.com)

---

Built with ❤️ for language learners worldwide.
