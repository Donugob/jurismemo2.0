'use server';

import { redirect } from 'next/navigation';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { loginSchema, registerSchema } from '@/lib/zod';

import { headers } from 'next/headers';

import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
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


const resend = new Resend(process.env.RESEND_API_KEY);

export async function requestPasswordReset(formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return { error: 'Too many requests. Please try again in a minute.' };
  }

  const email = formData.get('email') as string;
  if (!email || typeof email !== 'string') {
    return { error: 'Valid email is required.' };
  }

  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return { success: 'If an account with that email exists, a recovery link has been sent.' };
    }

    // Check if token already exists for this email
    const existingToken = await prisma.passwordResetToken.findFirst({
      where: { email }
    });
    
    // Create new token
    const token = uuidv4();
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour from now

    if (existingToken) {
      await prisma.passwordResetToken.update({
        where: { id: existingToken.id },
        data: { token, expires }
      });
    } else {
      await prisma.passwordResetToken.create({
        data: { email, token, expires }
      });
    }

    // Determine the host URL
    const headersList = await headers();
    let hostUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!hostUrl) {
      const host = headersList.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      hostUrl = `${protocol}://${host}`;
    }

    const resetLink = `${hostUrl}/reset-password?token=${token}`;

    // Send email using Resend
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is not set. Token generated but email not sent:', resetLink);
      return { success: 'If an account with that email exists, a recovery link has been sent. (Development Mode: Check server logs for link)' };
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'JurisMemo <onboarding@resend.dev>',
      to: email,
      subject: 'Reset your password for JurisMemo',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e293b; text-transform: uppercase; letter-spacing: 1px;">Password Reset Request</h2>
          <p style="color: #475569; line-height: 1.6;">You requested a password reset for your JurisMemo account. Click the button below to set a new password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; background-color: #1e293b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">Reset Password</a>
          </div>
          <p style="color: #475569; font-size: 14px;">If you did not request this, please ignore this email. This link will expire in 1 hour.</p>
        </div>
      `
    });

    return { success: 'If an account with that email exists, a recovery link has been sent.' };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}

export async function resetPassword(formData: FormData) {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;

  if (!token || !password) {
    return { error: 'Missing required fields.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  try {
    const existingToken = await prisma.passwordResetToken.findFirst({
      where: { token }
    });

    if (!existingToken) {
      return { error: 'Invalid or expired token.' };
    }

    if (new Date(existingToken.expires) < new Date()) {
      return { error: 'Token has expired. Please request a new one.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await prisma.user.update({
      where: { email: existingToken.email },
      data: { password: hashedPassword }
    });

    // Delete used token
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    });

    return { success: 'Password reset successfully. You can now log in.' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { error: 'An error occurred while resetting your password.' };
  }
}
