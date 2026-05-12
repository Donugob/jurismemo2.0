'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signIn, signOut } from '@/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function login(formData: FormData) {
  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    })
  } catch (error: any) {
    if (error.message?.includes('CredentialsSignin')) {
      return { error: 'Invalid email or password' }
    }
    // Re-throw redirect errors so Next.js can handle them
    throw error
  }
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const level = formData.get('level') as string

  if (!email || !password || !username) {
    return { error: 'Email, username, and password are required' }
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })

    if (existingUser) {
      return { error: 'User already exists' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        level: level || '100L'
      }
    })

    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    })

  } catch (error: any) {
    if (error.message?.includes('CredentialsSignin')) {
      return { error: 'Invalid email or password' }
    }
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: '/login' })
}
