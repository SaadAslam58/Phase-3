import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckSquare, BarChart3, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader className="space-y-4">
            <CardTitle className="text-4xl md:text-5xl font-bold tracking-tight">
              Todo Dashboard
            </CardTitle>
            <CardDescription className="text-lg md:text-xl">
              Organize your tasks efficiently with our powerful and intuitive
              task management platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="w-full sm:w-auto px-8">
              <Link href="/login">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Task Management Feature */}
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckSquare className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Task Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Create, organize, and track your tasks with ease. Stay on top
                  of your to-do list effortlessly.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Real-time Dashboard Feature */}
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <BarChart3 className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Real-time Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Monitor your progress with live updates and insightful
                  analytics at a glance.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Secure & Private Feature */}
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Your data is protected with industry-standard security.
                  Privacy is our priority.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Todo Dashboard. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
