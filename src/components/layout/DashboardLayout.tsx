'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  roles: string[];
  icon: string;
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', roles: ['admin', 'teacher', 'student', 'parent'], icon: '🏠' },
  { id: 'students', label: 'Students', href: '/dashboard/students', roles: ['admin', 'teacher'], icon: '👥' },
  { id: 'teachers', label: 'Teachers', href: '/dashboard/teachers', roles: ['admin'], icon: '👨‍🏫' },
  { id: 'classes', label: 'Classes', href: '/dashboard/classes', roles: ['admin', 'teacher'], icon: '📚' },
  { id: 'subjects', label: 'Subjects', href: '/dashboard/subjects', roles: ['admin', 'teacher'], icon: '📖' },
  { id: 'exams', label: 'Examinations', href: '/dashboard/exams', roles: ['admin', 'teacher', 'student'], icon: '📝' },
  { id: 'attendance', label: 'Attendance', href: '/dashboard/attendance', roles: ['admin', 'teacher', 'student', 'parent'], icon: '✅' },
  { id: 'fees', label: 'Fee Management', href: '/dashboard/fees', roles: ['admin', 'parent'], icon: '💰' },
  { id: 'library', label: 'Library', href: '/dashboard/library', roles: ['admin', 'teacher', 'student'], icon: '📚' },
  { id: 'transport', label: 'Transport', href: '/dashboard/transport', roles: ['admin', 'parent'], icon: '🚌' },
  { id: 'reports', label: 'Reports', href: '/dashboard/reports', roles: ['admin', 'teacher'], icon: '📊' },
  { id: 'announcements', label: 'Announcements', href: '/dashboard/announcements', roles: ['admin', 'teacher', 'student', 'parent'], icon: '📢' },
  { id: 'events', label: 'Events', href: '/dashboard/events', roles: ['admin', 'teacher', 'student', 'parent'], icon: '📅' },
  { id: 'settings', label: 'Settings', href: '/dashboard/settings', roles: ['admin'], icon: '⚙️' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getFilteredNavItems = () => {
    return navigationItems.filter(item => 
      user?.role && item.roles.includes(user.role)
    );
  };

  const getUserInitials = () => {
    return user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      teacher: 'bg-blue-100 text-blue-800',
      student: 'bg-green-100 text-green-800',
      parent: 'bg-purple-100 text-purple-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* School Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <img 
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/122d65a6-315f-44f6-932d-7103b3819653.png" 
            alt="School Logo" 
            className="w-10 h-10 rounded-lg"
          />
          <div>
            <h2 className="font-bold text-lg text-gray-900">Self Confidence</h2>
            <p className="text-sm text-gray-600">Academy</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-blue-500 text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user?.name}</p>
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs capitalize ${getRoleBadgeColor(user?.role || '')}`}>
                {user?.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {getFilteredNavItems().map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start text-left h-10 px-3"
              onClick={() => {
                router.push(item.href);
                setIsMobileSidebarOpen(false);
              }}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <p className="text-xs text-gray-500 text-center">
          © 2024 Self Confidence Academy
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setIsMobileSidebarOpen(true)}
                  >
                    <span className="text-xl">☰</span>
                  </Button>
                </SheetTrigger>
              </Sheet>

              <h1 className="text-xl font-semibold text-gray-900">
                School Management System
              </h1>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-blue-500 text-white text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/help')}>
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}