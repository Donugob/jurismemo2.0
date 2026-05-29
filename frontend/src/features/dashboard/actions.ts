"use server";

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addTaskAction(task: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  
  await prisma.task.create({
    data: {
      user_id: parseInt(session.user.id),
      task,
    }
  });
  revalidatePath('/dashboard');
}

export async function toggleTaskAction(id: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task || task.user_id !== parseInt(session.user.id)) throw new Error('Not found');

  await prisma.task.update({
    where: { id },
    data: { status: task.status === 'completed' ? 'pending' : 'completed' }
  });
  revalidatePath('/dashboard');
}

export async function deleteTaskAction(id: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await prisma.task.deleteMany({
    where: { id, user_id: parseInt(session.user.id) }
  });
  revalidatePath('/dashboard');
}

export async function addGradeAction(data: { course_code: string, grade: string, level: string, semester: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const existing = await prisma.grade.findFirst({
    where: {
      user_id: parseInt(session.user.id),
      course_code: data.course_code,
      level: data.level,
      semester: data.semester
    }
  });

  if (existing) {
    await prisma.grade.update({
      where: { id: existing.id },
      data: { grade: data.grade }
    });
  } else {
    await prisma.grade.create({
      data: {
        user_id: parseInt(session.user.id),
        ...data
      }
    });
  }
  revalidatePath('/dashboard');
}

export async function deleteGradeAction(id: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await prisma.grade.deleteMany({
    where: { id, user_id: parseInt(session.user.id) }
  });
  revalidatePath('/dashboard');
}

export async function updateProfileAction(data: any) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await prisma.user.update({
    where: { id: parseInt(session.user.id) },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      address: data.address,
      level: data.level,
      preferredCourses: data.preferredCourses
    }
  });
  revalidatePath('/dashboard');
}
