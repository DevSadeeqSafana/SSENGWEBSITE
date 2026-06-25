import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail, createUser, getNextMembershipNumber } from '@/lib/queries/users';

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, phone, state, specialty } = await req.json();

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate unique membership number SSE/MEM/YYYY/XXXX
    let membershipNumber = null;
    try {
      membershipNumber = await getNextMembershipNumber();
    } catch (e) {
      console.error('Failed to generate membership number:', e);
      // Fallback in case of DB queries errors
      membershipNumber = `SSE/MEM/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Insert user into database
    const userId = await createUser({
      email,
      password_hash: passwordHash,
      role: 'MEMBER', // Default role
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      membership_number: membershipNumber,
      membership_type: 'ASSOCIATE', // Default starting type
      membership_status: 'PENDING', // Default starting status (pending admin approval)
      state: state || null,
      country: 'Nigeria',
      specialty: specialty || null
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Account registered successfully. Membership is pending activation.',
        userId,
        membershipNumber
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
