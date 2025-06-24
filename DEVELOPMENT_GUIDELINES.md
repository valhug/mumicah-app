# Mumicah Development Guidelines

**Last Updated**: January 23, 2025  
**Project**: Mumicah Language Learning Platform  
**Stack**: Next.js 15, TypeScript, Tailwind CSS, MongoDB

---

## 📋 Table of Contents

1. [Clean Code Guidelines](#clean-code-guidelines)
2. [Next.js Best Practices](#nextjs-best-practices)
3. [Node.js & Express Best Practices](#nodejs--express-best-practices)
4. [TypeScript Guidelines](#typescript-guidelines)
5. [Tailwind CSS Conventions](#tailwind-css-conventions)
6. [File Organization](#file-organization)
7. [Git Workflow](#git-workflow)

---

## 🧹 Clean Code Guidelines

### Constants Over Magic Numbers
```typescript
// ❌ Bad
const sessionTimeout = 1800000;

// ✅ Good
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
```

### Meaningful Names
```typescript
// ❌ Bad
const u = getUserData();
const calc = (x, y) => x * y * 0.1;

// ✅ Good
const currentUser = getUserData();
const calculateDiscountPrice = (price, quantity) => price * quantity * DISCOUNT_RATE;
```

### Smart Comments
```typescript
// ❌ Bad - Comments what the code does
// Increment i by 1
i++;

// ✅ Good - Comments why the code exists
// Retry connection after exponential backoff to prevent overwhelming the server
await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
```

### Single Responsibility
```typescript
// ❌ Bad
function processUserData(user) {
  // Validate user
  if (!user.email) throw new Error('Email required');
  
  // Save to database
  database.save(user);
  
  // Send welcome email
  emailService.sendWelcome(user.email);
  
  // Log activity
  logger.info(`User ${user.id} created`);
}

// ✅ Good
function validateUser(user: User): void {
  if (!user.email) throw new Error('Email required');
}

function saveUser(user: User): Promise<User> {
  return database.save(user);
}

function sendWelcomeEmail(email: string): Promise<void> {
  return emailService.sendWelcome(email);
}
```

### DRY (Don't Repeat Yourself)
```typescript
// ❌ Bad
function formatUserName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

function formatAuthorName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

// ✅ Good
function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}
```

---

## ⚡ Next.js Best Practices

### Project Structure
```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Route groups
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
│   ├── auth.ts           # Authentication config
│   ├── db.ts             # Database connection
│   └── utils.ts          # Helper functions
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── constants/            # Application constants
```

### Components Best Practices
```typescript
// ✅ Server Component (default)
import { getUserProfile } from '@/lib/auth';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = await getUserProfile(params.id);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <ProfileDetails user={user} />
    </div>
  );
}

// ✅ Client Component (when needed)
'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </Suspense>
  );
}
```

### Performance Optimization
```typescript
// ✅ Dynamic loading for non-critical components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});

// ✅ Image optimization
import Image from 'next/image';

export function OptimizedImage() {
  return (
    <Image
      src="/hero-image.webp"
      alt="Hero image"
      width={800}
      height={600}
      priority
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
```

### Data Fetching
```typescript
// ✅ Server-side data fetching
async function getServerSideData() {
  try {
    const response = await fetch('https://api.example.com/data', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Data fetching error:', error);
    return null;
  }
}

// ✅ Client-side data fetching with error handling
'use client';

import { useState, useEffect } from 'react';

export function ClientDataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

---

## 🚀 Node.js & Express Best Practices

### API Route Structure
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = createUserSchema.parse(body);
    
    // Process data
    const user = await createUser(validatedData);
    
    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Database Integration
```typescript
// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

---

## 📝 TypeScript Guidelines

### Type Definitions
```typescript
// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  profile?: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  avatar?: string;
  bio?: string;
  languagePreferences: LanguageLevel[];
  learningGoals: LearningGoal[];
}

export type LanguageLevel = 'beginner' | 'intermediate' | 'advanced' | 'native';

export interface LearningGoal {
  id: string;
  title: string;
  targetDate?: Date;
  completed: boolean;
}

// Use utility types
export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserData = Partial<Pick<User, 'name' | 'profile'>>;
```

### Component Props
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Button({ 
  variant, 
  size, 
  disabled = false, 
  loading = false, 
  children, 
  onClick, 
  className 
}: ButtonProps) {
  // Component implementation
}
```

---

## 🎨 Tailwind CSS Conventions

### Class Organization
```typescript
// ✅ Good - Organized by category
<div className={cn(
  // Layout
  "flex items-center justify-between",
  // Spacing
  "px-4 py-2 mb-4",
  // Appearance
  "bg-white border border-gray-200 rounded-lg shadow-sm",
  // Typography
  "text-sm font-medium text-gray-900",
  // States
  "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
  // Responsive
  "sm:px-6 md:py-3",
  className
)}>
```

### Component Variants with CVA
```typescript
// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

---

## 📁 File Organization

### Naming Conventions
- **Files**: kebab-case (`user-profile.tsx`, `api-client.ts`)
- **Components**: PascalCase (`UserProfile`, `ApiClient`)
- **Hooks**: camelCase with `use` prefix (`useAuth`, `useLocalStorage`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`, `API_BASE_URL`)

### Import Organization
```typescript
// External libraries
import React from 'react';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Internal utilities
import { cn } from '@/lib/utils';
import { connectDB } from '@/lib/db';

// Types
import type { User, CreateUserData } from '@/types';

// Components
import { Button } from '@/components/ui/button';
import { UserCard } from '@/components/user/user-card';

// Relative imports
import './component.css';
```

---

## 🔄 Git Workflow

### Commit Messages
```bash
# Format: <type>(<scope>): <description>

feat(auth): implement magic link authentication
fix(ui): resolve button loading state issue
docs(api): update user endpoint documentation
style(components): improve button component styling
refactor(utils): extract common validation logic
test(auth): add unit tests for login flow
chore(deps): update dependencies to latest versions
```

### Branch Naming
```bash
# Features
feature/user-authentication
feature/community-creation
feature/payment-integration

# Bug fixes
fix/login-redirect-issue
fix/mobile-responsive-navbar

# Chores
chore/update-dependencies
chore/setup-ci-pipeline
```

### Pull Request Guidelines
1. **Title**: Clear, descriptive summary
2. **Description**: What changed and why
3. **Testing**: How to test the changes
4. **Screenshots**: For UI changes
5. **Breaking Changes**: Document any breaking changes

---

## 🧪 Testing Guidelines

### Unit Tests
```typescript
// __tests__/utils/format-name.test.ts
import { formatFullName } from '@/lib/utils';

describe('formatFullName', () => {
  it('should format first and last name correctly', () => {
    expect(formatFullName('John', 'Doe')).toBe('John Doe');
  });

  it('should handle empty strings', () => {
    expect(formatFullName('', '')).toBe('');
    expect(formatFullName('John', '')).toBe('John');
  });

  it('should trim whitespace', () => {
    expect(formatFullName(' John ', ' Doe ')).toBe('John Doe');
  });
});
```

### Component Tests
```typescript
// __tests__/components/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## 🔧 Development Environment

### Required VSCode Extensions
- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind classes
- **Prettier**: Code formatting
- **ESLint**: Code linting
- **TypeScript**: Enhanced TypeScript support
- **Auto Rename Tag**: Automatically rename paired HTML tags
- **Path Intellisense**: Autocomplete for file paths
- **Error Lens**: Inline error highlighting

### Environment Variables
```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mumicah
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RESEND_API_KEY=your-resend-api-key
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

---

**Remember**: These guidelines are living documents. Update them as the project evolves and new patterns emerge.
