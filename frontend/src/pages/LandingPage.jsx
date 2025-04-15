"use client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Rocket, MessageSquare, Users, Bolt, Shield, ImageIcon, Smartphone, Palette } from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
    <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
    <div className="flex items-center space-x-2">
        <MessageSquare className="h-6 w-6 text-indigo-600" />
        <span className="text-xl font-bold text-indigo-600">ChatSphere</span>
    </div>

    <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center space-x-6">
        <Button variant="ghost" className="text-gray-600 hover:text-indigo-600">
            Features
        </Button>
        <Button variant="ghost" className="text-gray-600 hover:text-indigo-600">
            About
        </Button>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-8 ml-6">
        <Button variant="outline" 
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
            onClick={() => navigate("/login")}
        >
            Login
        </Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700" 
        onClick={() => navigate("/signup")}>
            Sign Up
        </Button>
        </div>
    </div>
    </nav>

      {/* Hero Section */}
    <section className="py-12 px-4 max-w-6xl mx-auto">
    <div className="flex flex-col md:flex-row items-center gap-12">
    {/* Text Content - Left Side */}
    <div className="md:w-1/2 space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
        <span className="text-indigo-600">ChatSphere</span><br />
        Where Connections Happen
      </h1>
      <p className="text-lg md:text-xl text-gray-600">
        The modern way to chat with <span className="font-medium">anyone</span>—friends, 
        communities, or colleagues. Fast, simple, and always in sync.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate("/signup")}>
          Start Chatting <Rocket className="ml-2 h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline">
          See How It Works
        </Button>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Users className="h-4 w-4" />
        <span>Join millions of users worldwide</span>
      </div>
    </div>

        {/* GIF Container - Right Side */}
        <div className="md:w-1/2">        
            <img src="/chatting.gif" alt="ChatSphere in action" className="w-full h-auto" />
        </div>

    </div>
    </section>

    {/* Features Section - Updated for General Use */}
    <section className="py-20 px-6 max-w-6xl mx-auto">
    <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Why Everyone Loves ChatSphere
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Designed for real human connections, with zero compromises.
        </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
        {/* Feature 1: Real-time */}
        <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="items-center text-center">
            <div className="p-4 bg-indigo-100 rounded-full mb-4">
            <Bolt className="h-8 w-8 text-indigo-600" />
            </div>
            <CardTitle>Instant Messages</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-center">
            Watch messages appear in real-time, with typing indicators and read receipts.
            </CardDescription>
        </CardContent>
        </Card>

        {/* Feature 2: Groups */}
        <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="items-center text-center">
            <div className="p-4 bg-indigo-100 rounded-full mb-4">
            <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <CardTitle>Vibrant Groups</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-center">
            Create public or private groups with custom roles and moderation tools.
            </CardDescription>
        </CardContent>
        </Card>

        {/* Feature 3: Media */}
        <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="items-center text-center">
            <div className="p-4 bg-indigo-100 rounded-full mb-4">
            <ImageIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <CardTitle>Rich Media</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-center">
            Share photos, videos, GIFs, and files without size limits.
            </CardDescription>
        </CardContent>
        </Card>

        {/* Feature 4: Privacy */}
        <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="items-center text-center">
            <div className="p-4 bg-indigo-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <CardTitle>Privacy First</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-center">
            End-to-end encryption for sensitive conversations.
            </CardDescription>
        </CardContent>
        </Card>

        {/* Feature 5: Cross-platform */}
        <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="items-center text-center">
            <div className="p-4 bg-indigo-100 rounded-full mb-4">
            <Smartphone className="h-8 w-8 text-indigo-600" />
            </div>
            <CardTitle>Any Device</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-center">
            Seamless sync between mobile, desktop, and web.
            </CardDescription>
        </CardContent>
        </Card>

        {/* Feature 6: Customization */}
        <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="items-center text-center">
            <div className="p-4 bg-indigo-100 rounded-full mb-4">
            <Palette className="h-8 w-8 text-indigo-600" />
            </div>
            <CardTitle>Your Style</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-center">
            Themes, custom emojis, and chat backgrounds.
            </CardDescription>
        </CardContent>
        </Card>
    </div>
    </section>
      {/* CTA Section */}
      <section className="py-20 px-6 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join the Conversation?</h2>
          <p className="text-xl mb-10 opacity-90">
            ChatSphere is free to use, with millions of happy users worldwide. 
          Get started in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input 
              placeholder="Enter your email" 
              className="bg-white text-gray-900 border-none" 
            />
            <Button className="bg-white text-indigo-600 hover:bg-gray-100">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <MessageSquare className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold text-indigo-600">ChatSphere</span>
          </div>
          <div className="flex space-x-6">
            <Button variant="link" className="text-gray-600">
              Privacy
            </Button>
            <Button variant="link" className="text-gray-600">
              Terms
            </Button>
            <Button variant="link" className="text-gray-600">
              Contact
            </Button>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ChatSphere. All rights reserved.
        </div>
      </footer>
    </div>
  );
}