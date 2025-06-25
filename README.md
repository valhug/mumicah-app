# Mumicah - Language Learning Platform

A modern, AI-powered language learning platform focused on conversation practice and cultural immersion.

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
cd mumicah-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

### Environment Variables

Required environment variables (see `.env.example`):

- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `OPENAI_API_KEY` - OpenAI API key for AI conversations
- `NEXT_PUBLIC_APP_URL` - Application URL

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
├── lib/             # Utility functions and configurations
├── models/          # Database models
├── services/        # Business logic and API integrations
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

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
