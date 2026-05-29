import { unstable_cache } from 'next/cache';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardClient from '@/features/dashboard/components/DashboardClient';

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = parseInt(session.user.id);

  const getCachedResources = unstable_cache(
    async () => prisma.resource.findMany({ 
      take: 50, 
      orderBy: { upload_date: 'desc' } 
    }),
    ['dashboard-resources'],
    { revalidate: 3600, tags: ['resources'] }
  );

  // Fetch all dashboard data in parallel on the server
  const [dbUser, grades, resources, tasks, allCourses] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.grade.findMany({ 
      where: { user_id: userId },
      include: { course: true }
    }),
    getCachedResources(),
    prisma.task.findMany({ 
      where: { user_id: userId },
      take: 50,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.course.findMany({
      select: { id: true, course_code: true, title: true, level: true, semester: true, credit_units: true }
    })
  ]);

  if (!dbUser) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-light text-primary">
      <Navbar />
      <DashboardClient 
        user={dbUser} 
        initialGrades={grades} 
        initialResources={resources} 
        initialTasks={tasks} 
        allCourses={allCourses}
      />
      <Footer />
    </div>
  );
}
