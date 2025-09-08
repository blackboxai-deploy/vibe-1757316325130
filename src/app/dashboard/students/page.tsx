'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { mockStudents } from '@/lib/data/mockData';
import { Student } from '@/lib/types';
import { toast } from 'sonner';

export default function StudentsPage() {
  const { user } = useAuth();
  const [students] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesClass = selectedClass === 'all' || student.classId === selectedClass;
      const matchesSection = selectedSection === 'all' || student.section === selectedSection;
      
      return matchesSearch && matchesClass && matchesSection;
    });
  }, [students, searchQuery, selectedClass, selectedSection]);

  const getUniqueClasses = () => {
    const classes = [...new Set(students.map(s => s.classId))];
    return classes.sort();
  };

  const getUniqueSections = () => {
    const sections = [...new Set(students.map(s => s.section))];
    return sections.sort();
  };

  const getStudentInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600 bg-green-100';
    if (percentage >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getFeeStatusColor = (pendingAmount: number) => {
    if (pendingAmount === 0) return 'text-green-600 bg-green-100';
    if (pendingAmount <= 10000) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handleAddStudent = () => {
    toast.success('Student registration form would open here');
    setIsAddDialogOpen(false);
  };

  const StudentCard = ({ student }: { student: Student }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedStudent(student)}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={`https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dc660560-c9d3-4741-a231-0c1eb5d4f96e.png '+')}`} />
            <AvatarFallback className="bg-blue-500 text-white">
              {getStudentInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 truncate">{student.name}</h3>
              <Badge className={`text-xs ${getAttendanceColor(student.attendance.percentage)}`}>
                {student.attendance.percentage}% Attendance
              </Badge>
            </div>
            
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-600">ID: {student.studentId}</p>
              <p className="text-sm text-gray-600">Class: {student.classId}{student.section} | Roll: {student.rollNumber}</p>
              <p className="text-sm text-gray-600">Email: {student.email}</p>
            </div>
            
            <div className="mt-3 flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Grade: {student.academicInfo.grade}
              </Badge>
              <Badge className={`text-xs ${getFeeStatusColor(student.feeStatus.pendingAmount)}`}>
                {student.feeStatus.pendingAmount === 0 ? 'Fees Paid' : `₹${student.feeStatus.pendingAmount} Pending`}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">You don't have permission to view student records.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600">Manage student records, attendance, and academic information</p>
          </div>
          {user.role === 'admin' && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add New Student</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter student's full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="class">Class</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9">Class 9</SelectItem>
                          <SelectItem value="10">Class 10</SelectItem>
                          <SelectItem value="11">Class 11</SelectItem>
                          <SelectItem value="12">Class 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent">Parent Name</Label>
                    <Input id="parent" placeholder="Enter parent's name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  <Button onClick={handleAddStudent} className="w-full">
                    Register Student
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <span className="text-2xl">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{students.length}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              <span className="text-2xl">✅</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(students.reduce((sum, s) => sum + s.attendance.percentage, 0) / students.length)}%
              </div>
              <p className="text-xs text-muted-foreground">School average</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ₹{students.reduce((sum, s) => sum + s.feeStatus.pendingAmount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total outstanding</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
              <span className="text-2xl">🏆</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {students.filter(s => s.academicInfo.grade === 'A' || s.academicInfo.grade === 'A+').length}
              </div>
              <p className="text-xs text-muted-foreground">Grade A students</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Students</Label>
                <Input
                  id="search"
                  placeholder="Search by name, ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="class-filter">Filter by Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {getUniqueClasses().map(cls => (
                      <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="section-filter">Filter by Section</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {getUniqueSections().map(section => (
                      <SelectItem key={section} value={section}>Section {section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Actions</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Export</Button>
                  <Button variant="outline" size="sm">Print</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No students found matching your criteria.</p>
            </CardContent>
          </Card>
        )}

        {/* Student Detail Modal */}
        {selectedStudent && (
          <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Student Details - {selectedStudent.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="flex items-start space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={`https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bb7ff865-1425-4383-9259-fdb2a2a75ca8.png '+')}`} />
                    <AvatarFallback className="bg-blue-500 text-white text-lg">
                      {getStudentInitials(selectedStudent.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Student ID:</span> {selectedStudent.studentId}
                      </div>
                      <div>
                        <span className="font-medium">Class:</span> {selectedStudent.classId}{selectedStudent.section}
                      </div>
                      <div>
                        <span className="font-medium">Roll Number:</span> {selectedStudent.rollNumber}
                      </div>
                      <div>
                        <span className="font-medium">Date of Birth:</span> {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="font-semibold mb-3">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Email:</span> {selectedStudent.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedStudent.phone}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Address:</span> {selectedStudent.address}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h4 className="font-semibold mb-3">Emergency Contact</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedStudent.emergencyContact.name}
                    </div>
                    <div>
                      <span className="font-medium">Relation:</span> {selectedStudent.emergencyContact.relation}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedStudent.emergencyContact.phone}
                    </div>
                    <div>
                      <span className="font-medium">Blood Group:</span> {selectedStudent.bloodGroup || 'Not specified'}
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h4 className="font-semibold mb-3">Academic Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Current Grade:</span> {selectedStudent.academicInfo.grade}
                    </div>
                    <div>
                      <span className="font-medium">Admission Date:</span> {new Date(selectedStudent.admissionDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Previous School:</span> {selectedStudent.academicInfo.previousSchool || 'Not specified'}
                    </div>
                    <div>
                      <span className="font-medium">Previous Class:</span> {selectedStudent.academicInfo.previousClass || 'Not specified'}
                    </div>
                  </div>
                </div>

                {/* Attendance */}
                <div>
                  <h4 className="font-semibold mb-3">Attendance Record</h4>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-600">{selectedStudent.attendance.totalDays}</div>
                      <div className="text-xs text-gray-600">Total Days</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="font-semibold text-green-600">{selectedStudent.attendance.presentDays}</div>
                      <div className="text-xs text-gray-600">Present</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="font-semibold text-red-600">{selectedStudent.attendance.absentDays}</div>
                      <div className="text-xs text-gray-600">Absent</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="font-semibold text-purple-600">{selectedStudent.attendance.percentage}%</div>
                      <div className="text-xs text-gray-600">Percentage</div>
                    </div>
                  </div>
                </div>

                {/* Fee Status */}
                <div>
                  <h4 className="font-semibold mb-3">Fee Status</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-600">₹{selectedStudent.feeStatus.totalFees.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Total Fees</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="font-semibold text-green-600">₹{selectedStudent.feeStatus.paidAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Paid Amount</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="font-semibold text-red-600">₹{selectedStudent.feeStatus.pendingAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                  </div>
                  {selectedStudent.feeStatus.lastPaymentDate && (
                    <p className="text-sm text-gray-600 mt-2">
                      Last payment: {new Date(selectedStudent.feeStatus.lastPaymentDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button size="sm">Edit Student</Button>
                  <Button variant="outline" size="sm">View Grades</Button>
                  <Button variant="outline" size="sm">Attendance History</Button>
                  <Button variant="outline" size="sm">Fee History</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}