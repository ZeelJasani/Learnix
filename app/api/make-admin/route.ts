import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    const email = 'kunjjarsaniya07@gmail.com';

    const user = await prisma.user.update({
      where: { email },
      data: { role: 'admin' },
    });

    return NextResponse.json({
      success: true,
      message: `User ${email} is now an admin`,
      user
    });
  } catch (error) {
    console.error('Error making user admin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
