import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80 dark:bg-gray-900/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">CampusConnect</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link to="#features" className="text-sm text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors">
                Features
              </Link>
              <Link to="#how-it-works" className="text-sm text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors">
                How It Works
              </Link>
              <Link to="#stats" className="text-sm text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors">
                Stats
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Link to="/auth/login">Log In</Link>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background pointer-events-none dark:from-primary/10 dark:via-accent/10 dark:to-gray-900" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5">
              <Sparkles className="w-3 h-3 mr-1.5 inline" />
              The University Talent Marketplace
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Connect with talent. <span className="text-primary">Build together.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              The on-campus platform where students discover opportunities, collaborate on projects, and build their
              future—one connection at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base px-8">
                Start Exploring
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 bg-transparent dark:border-gray-700 dark:text-gray-100">
                Post an Opportunity
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground dark:text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Free for students</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Instant matching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Real-time chat</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 border-y border-border/40 bg-muted/30 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-sm text-muted-foreground dark:text-gray-300">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-sm text-muted-foreground dark:text-gray-300">Opportunities Posted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">85%</div>
              <div className="text-sm text-muted-foreground dark:text-gray-300">Match Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground dark:text-gray-300">Platform Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Role Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              One platform. <span className="text-primary">Two powerful modes.</span>
            </h2>
            <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
              Switch seamlessly between finding talent and seeking opportunities—all without logging out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Talent Finder Card */}
            <Card className="p-8 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg dark:bg-gray-900">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Talent Finder</h3>
              <p className="text-muted-foreground dark:text-gray-300 mb-6 leading-relaxed">
                Post opportunities, manage applicants, and find the perfect collaborators for your projects.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Create and manage job posts with ease</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">View applicant profiles and match scores</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Track applications and shortlist candidates</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Analytics on views and engagement</span>
                </li>
              </ul>
            </Card>

            {/* Talent Seeker Card */}
            <Card className="p-8 border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-lg dark:bg-gray-900">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Talent Seeker</h3>
              <p className="text-muted-foreground dark:text-gray-300 mb-6 leading-relaxed">
                Discover opportunities, apply with custom proposals, and track your application status.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Browse personalized job recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Filter by type, skills, and interests</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Save and bookmark opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Real-time application status tracking</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/30 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">CampusConnect</span>
              </div>
              <p className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed">
                The university talent marketplace connecting students for collaboration and growth.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-300">
                <li><Link to="#features" className="hover:text-foreground dark:hover:text-white transition-colors">Features</Link></li>
                <li><Link to="#how-it-works" className="hover:text-foreground dark:hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="#" className="hover:text-foreground dark:hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-300">
                <li><Link to="#" className="hover:text-foreground dark:hover:text-white transition-colors">About</Link></li>
                <li><Link to="#" className="hover:text-foreground dark:hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="#" className="hover:text-foreground dark:hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-300">
                <li><Link to="#" className="hover:text-foreground dark:hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="#" className="hover:text-foreground dark:hover:text-white transition-colors">Terms</Link></li>
                <li><Link to="#" className="hover:text-foreground dark:hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground dark:text-gray-400">
            <p>&copy; 2025 CampusConnect. Built for SURGE '25 Web Hackathon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
