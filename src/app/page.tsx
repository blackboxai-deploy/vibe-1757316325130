'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { User } from '@/lib/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role'] | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !role) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password, role);
    
    if (result.success) {
      toast.success('Login successful!');
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
    }
    setIsLoading(false);
  };

  const demoCredentials = [
    { role: 'admin', email: 'admin@selfconfidence.edu', name: 'Dr. Rajesh Kumar' },
    { role: 'teacher', email: 'priya.teacher@selfconfidence.edu', name: 'Mrs. Priya Sharma' },
    { role: 'student', email: 'arjun.student@selfconfidence.edu', name: 'Arjun Singh' },
    { role: 'parent', email: 'vikram.parent@selfconfidence.edu', name: 'Mr. Vikram Singh' }
  ];

  const fillDemoCredentials = (demoRole: User['role'], demoEmail: string) => {
    setRole(demoRole);
    setEmail(demoEmail);
    setPassword('demo123'); // Any password works for demo
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex items-center justify-center gap-8">
        {/* School Info Section */}
        <div className="hidden lg:block w-1/2 text-center">
          <div className="space-y-6">
            <img 
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/909753e2-5895-43b8-9a62-f36265eeb83d.png" 
              alt="Self Confidence Academy Logo" 
              className="mx-auto w-32 h-32 rounded-full shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Self Confidence Academy
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Building Tomorrow's Leaders Today
              </p>
              <p className="text-gray-500 leading-relaxed">
                Empowering students with knowledge, confidence, and character. 
                Our comprehensive education system nurtures academic excellence 
                and personal growth in a supportive environment.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">30+</div>
                <div className="text-sm text-gray-600">Teachers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full lg:w-1/2 max-w-md">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                School Management System
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Select Your Role</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as User['role'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  Demo Credentials (Click to auto-fill):
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {demoCredentials.map((demo) => (
                    <Button
                      key={demo.role}
                      variant="outline"
                      size="sm"
                      className="text-xs p-2 h-auto"
                      type="button"
                      onClick={() => fillDemoCredentials(demo.role as User['role'], demo.email)}
                    >
                      <div className="text-center">
                        <div className="font-medium capitalize">{demo.role}</div>
                        <div className="text-gray-500">{demo.name}</div>
                      </div>
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Password: demo123 (for all accounts)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* School Contact Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>📧 admin@selfconfidence.edu | 📞 +91-9876543210</p>
            <p>📍 Self Confidence Academy, New Delhi, India</p>
          </div>
        </div>
      </div>
    </div>
  );
}