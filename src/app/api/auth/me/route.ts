import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      user: {
        name: payload.name as string,
        role: payload.role as string,
        userId: payload.userId as string,
      }
    }, { status: 200 });
  } catch (err) {
    // Token invalid/expired
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
