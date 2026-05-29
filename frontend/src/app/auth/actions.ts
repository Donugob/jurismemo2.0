'use server';

import { redirect } from 'next/navigation';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { loginSchema, registerSchema } from '@/lib/zod';

import { headers } from 'next/headers';

// Zero-Cost In-Memory Rate Limiter (Protects individual Vercel instances from spam)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limitData = rateLimitMap.get(ip);
  if (!limitData || now > limitData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }
  if (limitData.count >= 5) { // Max 5 attempts per minute per IP
    return false;
  }
  limitData.count++;
  return true;
}

export async function login(formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return { error: 'Too many requests. Please try again in a minute.' };
  }

  const data = Object.fromEntries(formData.entries());
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    return { error: 'Invalid fields provided.' };
  }

  const { email, password } = parsed.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials.' };
        default:
          return { error: 'Something went wrong.' };
      }
    }
    
    throw error;
  }
  
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return { error: 'Too many requests. Please try again in a minute.' };
  }

  const data = Object.fromEntries(formData.entries());
  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    return { error: 'Invalid data provided. Please check all fields.' };
  }

  const { email, password } = parsed.data;

  // Generate a unique username from email
  const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
  const username = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
  const level = '100L'; // Default level, they can change this in dashboard later

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email }
    });

    if (existingUser) {
      return { error: 'An account with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        level,
      }
    });
    
  } catch (error) {
    console.error('Signup Error:', error);
    return { error: 'An error occurred during registration.' };
  }

  // Auto-login after successful registration
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Registered successfully, but auto-login failed. Please log in manually.' };
    }
    throw error;
  }
  
  redirect('/dashboard');
}

export async function logout() {
  await signOut({ redirectTo: '/login' });
}
