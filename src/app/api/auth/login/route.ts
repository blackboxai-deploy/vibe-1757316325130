import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyPassword, generateToken } from '@/lib/auth/utils';
import { successResponse, errorResponse, validateRequestBody } from '@/lib/middleware/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'], {
    required_error: 'Role is required'
  }),
});

type LoginRequest = z.infer<typeof loginSchema>;

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequestBody(request, (data) => 
      loginSchema.parse(data)
    );

    if (!validation.success) {
      return errorResponse(validation.error || 'Invalid request data', 400);
    }

    const { email, password, role }: LoginRequest = validation.data!;

    // Find user by email and role
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        role: role,
        isActive: true,
      },
      include: {
        student: true,
        teacher: true,
        parent: true,
        admin: true,
      },
    });

    if (!user) {
      return errorResponse(
        'Invalid credentials or role mismatch', 
        401
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse('Invalid credentials', 401);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Prepare user data (excluding password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      // Include role-specific data
      ...(user.student && { 
        studentId: user.student.studentId,
        classId: user.student.classId,
        section: user.student.section,
        rollNumber: user.student.rollNumber
      }),
      ...(user.teacher && { 
        teacherId: user.teacher.teacherId,
        department: user.teacher.department,
        qualification: user.teacher.qualification
      }),
      ...(user.parent && { 
        parentId: user.parent.parentId,
        occupation: user.parent.occupation
      }),
    };

    const response = successResponse({
      user: userData,
      token,
      expiresIn: '24h',
    }, 'Login successful');

    // Set HTTP-only cookie for additional security
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse(
      'An error occurred during login',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
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