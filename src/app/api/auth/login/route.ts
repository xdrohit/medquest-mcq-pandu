import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting based on IP
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const isAllowed = rateLimit(ip, 5, 60000); // 5 attempts per minute
    if (!isAllowed) {
      return NextResponse.json({ message: 'Too many login attempts. Try again later.' }, { status: 429 });
    }

    await dbConnect();
    const { email, password, rememberMe, isHiddenAdminRoute } = await req.json();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Role-based security check for hidden admin route
    // If logging in via standard /login, block admins.
    // If logging in via secret route, block students.
    if (isHiddenAdminRoute && user.role !== 'admin') {
      return NextResponse.json({ message: 'Access denied.' }, { status: 403 });
    }
    if (!isHiddenAdminRoute && user.role === 'admin') {
      return NextResponse.json({ message: 'Admins must use the secure portal.' }, { status: 403 });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT (Expire in 30 days if rememberMe, else 1 day)
    const expiresIn = rememberMe ? '30d' : '1d';
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 1 * 24 * 60 * 60; // seconds

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn }
    );

    // Create response
    const response = NextResponse.json(
      { message: 'Login successful', user: { name: user.name, role: user.role, email: user.email } },
      { status: 200 }
    );

    // Set HTTP-only cookie for token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
