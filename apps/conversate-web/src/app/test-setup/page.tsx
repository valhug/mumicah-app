"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { Moon, Sun, MessageCircle, Users, TrendingUp } from "lucide-react";

export default function TestSetupPage() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("spanish");
  
  const personas = [
    {
      name: "Maya",
      role: "Patient Teacher",
      color: "bg-amber-500",
      description: "Gentle guidance for beginners",
      language: "Spanish"
    },
    {
      name: "Alex",
      role: "Casual Friend", 
      color: "bg-green-500",
      description: "Relaxed conversation practice",
      language: "French"
    },
    {
      name: "Luna",
      role: "Cultural Guide",
      color: "bg-purple-500", 
      description: "Deep cultural insights",
      language: "Spanish"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with Theme Toggle */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-brand">Mumicah</h1>
            <Badge variant="secondary">Setup Test</Badge>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Setup Status */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                Setup Status: Successful ✅
              </CardTitle>
              <CardDescription>
                All components and theming are working correctly!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default">ShadCN/UI</Badge>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">Dark/Light Mode</Badge>
                  <span className="text-sm text-muted-foreground">Working</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">Brand Colors</Badge>
                  <span className="text-sm text-muted-foreground">Applied</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Persona Cards Test */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Language Learning Personas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personas.map((persona) => (
              <Card key={persona.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${persona.color} rounded-full flex items-center justify-center text-white font-bold`}>
                      {persona.name[0]}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{persona.name}</CardTitle>
                      <CardDescription>{persona.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{persona.description}</p>
                  <Badge variant="outline">{persona.language}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Demo</CardTitle>
              <CardDescription>
                Test the conversation interface components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language-select">Select Language</Label>                  <select 
                    id="language-select"
                    title="Select language for practice"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="english">English</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message-input">Practice Message</Label>
                  <Input 
                    id="message-input"
                    placeholder="Type your message in the selected language..."
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="default">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Find Partner
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Conversate
              </CardTitle>
              <CardDescription>
                AI-powered conversation practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Practice with Maya, Alex, and Luna - our multilingual AI personas designed for different learning styles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Communities
              </CardTitle>
              <CardDescription>
                Connect with fellow learners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Join language-specific communities and practice with native speakers from around the world.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                DevMentor
              </CardTitle>
              <CardDescription>
                Technical language learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Learn programming and technical concepts while practicing your target language.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
