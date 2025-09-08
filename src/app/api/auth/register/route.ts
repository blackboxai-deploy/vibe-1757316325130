import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword, generateStudentId, generateTeacherId, getAcademicYear } from '@/lib/auth/utils';
import { successResponse, errorResponse, validateRequestBody } from '@/lib/middleware/auth';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
  
  // Student-specific fields
  classId: z.string().optional(),
  section: z.string().optional(),
  dateOfBirth: z.string().optional(),
  parentEmail: z.string().email().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  emergencyRelation: z.string().optional(),
  
  // Teacher-specific fields
  qualification: z.string().optional(),
  experience: z.number().optional(),
  department: z.string().optional(),
  salary: z.number().optional(),
  
  // Parent-specific fields
  occupation: z.string().optional(),
  income: z.number().optional(),
});

type RegisterRequest = z.infer<typeof registerSchema>;

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequestBody(request, (data) => 
      registerSchema.parse(data)
    );

    if (!validation.success) {
      return errorResponse(validation.error || 'Invalid request data', 400);
    }

    const data: RegisterRequest = validation.data!;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      return errorResponse('User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email.toLowerCase(),
          password: hashedPassword,
          phone: data.phone,
          address: data.address,
          role: data.role,
        },
      });

      // Create role-specific record
      let roleSpecificData = {};

      switch (data.role) {
        case 'STUDENT':
          if (!data.classId || !data.section || !data.dateOfBirth) {
            throw new Error('Missing required fields for student registration');
          }

          const student = await tx.student.create({
            data: {
              userId: user.id,
              studentId: generateStudentId(),
              classId: data.classId,
              section: data.section,
              rollNumber: await getNextRollNumber(tx, data.classId, data.section),
              dateOfBirth: new Date(data.dateOfBirth),
              admissionDate: new Date(),
              emergencyName: data.emergencyName || '',
              emergencyPhone: data.emergencyPhone || '',
              emergencyRelation: data.emergencyRelation || '',
            },
          });

          roleSpecificData = { studentId: student.studentId };
          break;

        case 'TEACHER':
          if (!data.qualification || !data.department) {
            throw new Error('Missing required fields for teacher registration');
          }

          const teacher = await tx.teacher.create({
            data: {
              userId: user.id,
              teacherId: generateTeacherId(),
              qualification: data.qualification,
              experience: data.experience || 0,
              department: data.department,
              salary: data.salary || 0,
              joiningDate: new Date(),
            },
          });

          roleSpecificData = { teacherId: teacher.teacherId };
          break;

        case 'PARENT':
          const parent = await tx.parent.create({
            data: {
              userId: user.id,
              parentId: `PAR${user.id.slice(-6)}`,
              occupation: data.occupation || '',
              income: data.income,
            },
          });

          roleSpecificData = { parentId: parent.parentId };
          break;

        case 'ADMIN':
          await tx.admin.create({
            data: {
              userId: user.id,
              department: 'Administration',
            },
          });
          break;
      }

      return { user, roleSpecificData };
    });

    // Return success response (exclude password)
    const userData = {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
      phone: result.user.phone,
      address: result.user.address,
      ...result.roleSpecificData,
    };

    return successResponse(
      { user: userData },
      'User registered successfully',
      201
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    return errorResponse(
      'An error occurred during registration',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}

// Helper function to get next roll number
async function getNextRollNumber(tx: any, classId: string, section: string): Promise<number> {
  const lastStudent = await tx.student.findFirst({
    where: { classId, section },
    orderBy: { rollNumber: 'desc' },
  });

  return (lastStudent?.rollNumber || 0) + 1;
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}