"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, User, FileText, CheckSquare, ChevronRight, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import GradesTab from './GradesTab';
import ProfileTab from './ProfileTab';
import ResourcesTab from './ResourcesTab';
import TasksTab from './TasksTab';

export default function DashboardClient({ 
  user, 
  initialGrades, 
  initialResources, 
  initialTasks,
  allCourses
}: { 
  user: any, 
  initialGrades: any[], 
  initialResources: any[], 
  initialTasks: any[],
  allCourses: any[]
}) {
  const [activeTab, setActiveTab] = useState('grades');

  const tabs = [
    { id: 'grades', label: 'Grades', icon: <GraduationCap size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'resources', label: 'Resources', icon: <FileText size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 relative pt-24 pb-12">
      {/* Sidebar */}
      <aside className="hidden md:block md:w-64 shrink-0">
        <div className="bg-white border text-primary border-primary rounded-none shadow-none p-6 sticky top-28">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=2c3e50&color=fff`} className="w-12 h-12 rounded-none" alt="Profile" />
            <div>
              <h3 className="font-bold text-primary truncate max-w-[120px]">{user.username}</h3>
              <p className="text-sm text-primary/60">{user.level || '100L'} Law</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between p-3 rounded-none transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white ' 
                    : 'text-primary/80 hover:bg-light hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-3 font-medium tracking-wide">
                  {tab.icon}
                  {tab.label}
                </div>
                {activeTab === tab.id && <ChevronRight size={18} />}
              </button>
            ))}
            
            <button onClick={() => signOut()} className="flex items-center justify-between p-3 rounded-none transition-all text-red-500 hover:bg-red-50 hover:text-red-700 mt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 font-medium tracking-wide">
                <LogOut size={20} />
                Logout
              </div>
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="md:hidden w-full overflow-x-auto mb-6 border-b border-primary/20 sticky top-[72px] bg-light z-40 pb-2 -mx-4 px-4 w-[calc(100%+2rem)] scrollbar-hide">
        <div className="flex gap-2 w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-[10px] uppercase tracking-widest font-bold border transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary text-light border-primary' 
                  : 'bg-white text-primary/60 border-primary/20 shadow-sm'
              }`}
            >
              {tab.icon && <span className="opacity-70 scale-75">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <section className="flex-1 bg-white border text-primary border-primary rounded-none shadow-none p-4 sm:p-6 md:p-10 min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'grades' && <GradesTab initialGrades={initialGrades} allCourses={allCourses} />}
            {activeTab === 'profile' && <ProfileTab user={user} />}
            {activeTab === 'resources' && <ResourcesTab initialResources={initialResources} />}
            {activeTab === 'tasks' && <TasksTab initialTasks={initialTasks} />}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
