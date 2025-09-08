'use client';

import { useAuth } from '@/lib/auth/authContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockDashboardStats, mockAnnouncements, mockEvents } from '@/lib/data/mockData';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const stats = mockDashboardStats;

  const StatCard = ({ title, value, description, color, icon }: {
    title: string;
    value: string | number;
    description: string;
    color: string;
    icon: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className={`text-2xl ${color}`}>{icon}</span>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          description="Enrolled this academic year"
          color="text-blue-600"
          icon="👥"
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          description="Active teaching staff"
          color="text-green-600"
          icon="👨‍🏫"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
          description="Fee collection this year"
          color="text-purple-600"
          icon="💰"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          description="Overall school attendance"
          color="text-orange-600"
          icon="✅"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Fee Collection Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Collected</span>
                <span>₹{((stats.totalRevenue - stats.pendingFees) / 100000).toFixed(1)}L</span>
              </div>
              <Progress value={(stats.totalRevenue - stats.pendingFees) / stats.totalRevenue * 100} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pending</span>
                <span className="text-red-600">₹{(stats.pendingFees / 100000).toFixed(1)}L</span>
              </div>
              <Progress value={stats.pendingFees / stats.totalRevenue * 100} className="bg-red-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Classes</span>
              <Badge variant="secondary">{stats.totalClasses}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">New Admissions</span>
              <Badge className="bg-green-100 text-green-800">{stats.newAdmissions}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Upcoming Events</span>
              <Badge className="bg-blue-100 text-blue-800">{stats.upcomingEvents}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Attendance Rate</span>
                <span>{stats.attendanceRate}%</span>
              </div>
              <Progress value={stats.attendanceRate} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fee Collection Rate</span>
                <span>{Math.round((stats.totalRevenue - stats.pendingFees) / stats.totalRevenue * 100)}%</span>
              </div>
              <Progress value={(stats.totalRevenue - stats.pendingFees) / stats.totalRevenue * 100} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTeacherDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Classes"
          value="3"
          description="Classes assigned to you"
          color="text-blue-600"
          icon="📚"
        />
        <StatCard
          title="My Students"
          value="85"
          description="Students under your guidance"
          color="text-green-600"
          icon="👥"
        />
        <StatCard
          title="Pending Grades"
          value="12"
          description="Assignments to be graded"
          color="text-orange-600"
          icon="📝"
        />
        <StatCard
          title="Attendance Rate"
          value="96%"
          description="Your classes attendance"
          color="text-purple-600"
          icon="✅"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <div>
                  <p className="font-medium">Class 10A - Mathematics</p>
                  <p className="text-sm text-muted-foreground">9:00 AM - 9:45 AM</p>
                </div>
                <Badge>Next</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Class 9B - Physics</p>
                  <p className="text-sm text-muted-foreground">10:30 AM - 11:15 AM</p>
                </div>
                <Badge variant="outline">Upcoming</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Class 10B - Mathematics</p>
                  <p className="text-sm text-muted-foreground">2:00 PM - 2:45 PM</p>
                </div>
                <Badge variant="outline">Upcoming</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Attendance marked for Class 10A</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New assignment created for Mathematics</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Grades submitted for Unit Test 2</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Subjects"
          value="8"
          description="Total subjects this semester"
          color="text-blue-600"
          icon="📚"
        />
        <StatCard
          title="Attendance"
          value="91.7%"
          description="Your attendance rate"
          color="text-green-600"
          icon="✅"
        />
        <StatCard
          title="Pending Fees"
          value="₹20,000"
          description="Outstanding fees"
          color="text-red-600"
          icon="💰"
        />
        <StatCard
          title="Overall Grade"
          value="A"
          description="Current academic grade"
          color="text-purple-600"
          icon="🏆"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <div>
                  <p className="font-medium">Mathematics</p>
                  <p className="text-sm text-muted-foreground">Mrs. Priya Sharma - 9:00 AM</p>
                </div>
                <Badge>Next</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Physics</p>
                  <p className="text-sm text-muted-foreground">Mrs. Priya Sharma - 10:30 AM</p>
                </div>
                <Badge variant="outline">Upcoming</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">English</p>
                  <p className="text-sm text-muted-foreground">Mr. Amit Kumar - 2:00 PM</p>
                </div>
                <Badge variant="outline">Upcoming</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Mathematics Unit Test</p>
                  <p className="text-sm text-muted-foreground">March 1, 2024</p>
                </div>
                <Badge className="bg-green-100 text-green-800">A</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Physics Lab Report</p>
                  <p className="text-sm text-muted-foreground">February 28, 2024</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">A-</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">English Essay</p>
                  <p className="text-sm text-muted-foreground">February 25, 2024</p>
                </div>
                <Badge className="bg-green-100 text-green-800">A+</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderParentDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Children"
          value="1"
          description="Your children in school"
          color="text-blue-600"
          icon="👶"
        />
        <StatCard
          title="Attendance"
          value="91.7%"
          description="Child's attendance rate"
          color="text-green-600"
          icon="✅"
        />
        <StatCard
          title="Pending Fees"
          value="₹20,000"
          description="Outstanding fees"
          color="text-red-600"
          icon="💰"
        />
        <StatCard
          title="Overall Grade"
          value="A"
          description="Child's academic grade"
          color="text-purple-600"
          icon="🏆"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Arjun Singh - Class 10A</CardTitle>
            <CardDescription>Your child's academic overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Attendance Rate</span>
                  <span>91.7%</span>
                </div>
                <Progress value={91.7} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Academic Performance</span>
                  <span>85%</span>
                </div>
                <Progress value={85} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Roll Number</span>
                <Badge variant="secondary">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Class Teacher</span>
                <span className="text-sm font-medium">Mrs. Priya Sharma</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Excellent performance in Mathematics</p>
                  <p className="text-xs text-muted-foreground">March 1, 2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Fee payment due March 31st</p>
                  <p className="text-xs text-muted-foreground">March 5, 2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Parent-Teacher meeting scheduled</p>
                  <p className="text-xs text-muted-foreground">March 20, 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'teacher':
        return renderTeacherDashboard();
      case 'student':
        return renderStudentDashboard();
      case 'parent':
        return renderParentDashboard();
      default:
        return <div>Role not recognized</div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening at Self Confidence Academy today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Today's Date</p>
            <p className="font-medium">{new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>

        {/* Role-based Dashboard Content */}
        {renderDashboardByRole()}

        {/* Recent Announcements and Events */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAnnouncements.slice(0, 3).map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="font-medium text-sm">{announcement.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="border-l-4 border-green-500 pl-4 py-2">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-green-600">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}