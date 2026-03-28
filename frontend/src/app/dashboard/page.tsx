"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  User, 
  FileText, 
  CheckSquare, 
  ChevronRight, 
  Mail, 
  Phone,
  LayoutDashboard,
  Trash2,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { dashboardApi, authApi } from '@/lib/api';
import Toast, { ToastType } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('grades');
  const [grades, setGrades] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering & Search states
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceLevelFilter, setResourceLevelFilter] = useState('All');
  
  // Form states
  const [newTaskText, setNewTaskText] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<any>({});

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });
  
  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const router = useRouter();
  const { user, logout, loading: authLoading, refreshProfile } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        level: user.level || '100L',
        preferredCourses: user.preferredCourses || ''
      });
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [gradesData, resourcesData, tasksData] = await Promise.all([
        dashboardApi.getGrades(),
        dashboardApi.getResources(),
        dashboardApi.getTasks(),
      ]);
      setGrades(gradesData);
      setResources(resourcesData);
      setTasks(tasksData);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const gradePoints: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
  
  const filteredGrades = grades.filter(g => {
    const levelMatch = selectedLevel === 'All' || g.level === selectedLevel;
    const semesterMatch = selectedSemester === 'All' || g.semester.includes(selectedSemester);
    return levelMatch && semesterMatch;
  });

  const calculateCgpa = (data = grades) => {
    let totalPoints = 0;
    let totalUnits = 0;
    data.forEach(g => {
      const units = g.course?.credit_units || 3;
      const points = gradePoints[g.grade] || 0;
      totalPoints += points * units;
      totalUnits += units;
    });
    return totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : "0.00";
  };

  const calculateSemesterGpa = () => {
    if (selectedLevel === 'All' || selectedSemester === 'All') return calculateCgpa(grades);
    return calculateCgpa(filteredGrades);
  };

  // Handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await authApi.updateProfile(profileForm);
      await refreshProfile();
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskText.trim()) return;
    try {
      await dashboardApi.addTask({ task: newTaskText, due_date: null });
      setNewTaskText('');
      fetchData();
      showToast('Task added successfully!');
    } catch (err) {
      showToast('Failed to add task', 'error');
    }
  };

  const handleToggleTask = async (id: number) => {
    try {
      await dashboardApi.toggleTask(id);
      fetchData();
    } catch (err) {
      console.error('Failed to toggle task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Task?",
      message: "Are you sure you want to remove this task? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await dashboardApi.deleteTask(id);
          fetchData();
          showToast('Task removed', 'info');
        } catch (err) {
          showToast('Failed to delete task', 'error');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const filteredResources = resources.filter(r => {
    const levelMatch = resourceLevelFilter === 'All' || r.level === resourceLevelFilter;
    const searchMatch = r.title.toLowerCase().includes(resourceSearch.toLowerCase()) || 
                        (r.description && r.description.toLowerCase().includes(resourceSearch.toLowerCase()));
    return levelMatch && searchMatch;
  });

  // Grade Form states
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('A');
  const [gradeError, setGradeError] = useState('');

  const fetchAvailableCourses = async (level: string, sem: string) => {
    if (level === 'All' || sem === 'All') return;
    try {
      const courses = await dashboardApi.getAvailableCourses(level, `${level} ${sem}`);
      setAvailableCourses(courses);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (selectedLevel !== 'All' && selectedSemester !== 'All') {
      fetchAvailableCourses(selectedLevel, selectedSemester);
    }
  }, [selectedLevel, selectedSemester]);

  useEffect(() => {
    if (showGradeModal && selectedCourse) {
      const existing = grades.find(g => g.course_code === selectedCourse && g.level === selectedLevel && g.semester.includes(selectedSemester));
      if (existing) {
        setSelectedGrade(existing.grade);
      } else {
        setSelectedGrade('A');
      }
    }
  }, [selectedCourse, showGradeModal, grades, selectedLevel, selectedSemester]);

  const handleAddGrade = async () => {
    if (!selectedCourse) {
      setGradeError('Please select a course');
      return;
    }
    try {
      await dashboardApi.addGrade({
        course_code: selectedCourse,
        grade: selectedGrade,
        level: selectedLevel,
        semester: selectedSemester
      });
      setShowGradeModal(false);
      fetchData();
      showToast('Grade saved successfully!');
    } catch (err) {
      setGradeError('Failed to add grade');
      showToast('Error saving grade', 'error');
    }
  };

  const handleDeleteGrade = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Grade?",
      message: "Are you sure you want to remove this course grade? This action cannot be undone and your CGPA will be recalculated.",
      onConfirm: async () => {
        try {
          await dashboardApi.deleteGrade(id);
          fetchData();
          showToast('Grade deleted', 'info');
        } catch (e) {
          showToast('Failed to delete grade', 'error');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const tabs = [
    { id: 'grades', label: 'Grades', icon: <GraduationCap size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'resources', label: 'Resources', icon: <FileText size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
  ];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 relative">
        <Toast 
          message={toast.message} 
          type={toast.type} 
          isVisible={toast.isVisible} 
          onClose={() => setToast({ ...toast, isVisible: false })} 
        />
        
        <ConfirmModal 
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel="Delete"
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        />
        
        {/* Modal for Adding Grade */}
        {showGradeModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-primary mb-6">Add New Grade</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Grade for {selectedLevel} - {selectedSemester}</label>
                  <select 
                    className="input-field" 
                    value={selectedCourse} 
                    onChange={e => setSelectedCourse(e.target.value)}
                  >
                    <option value="">-- Select Course --</option>
                    {availableCourses.map(c => {
                      const existing = grades.find(g => g.course_code === c.course_code && g.level === selectedLevel && g.semester.includes(selectedSemester));
                      return (
                        <option key={c.id} value={c.course_code}>
                          {existing ? `[EDIT] ${c.course_code}: ${c.title} (Current: ${existing.grade})` : `[ENTER] ${c.course_code}: ${c.title}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Score/Grade</label>
                  <select 
                    className="input-field"
                    value={selectedGrade}
                    onChange={e => setSelectedGrade(e.target.value)}
                  >
                    <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>F</option>
                  </select>
                </div>
                {gradeError && <p className="text-red-500 text-xs">{gradeError}</p>}
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setShowGradeModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                  <button onClick={handleAddGrade} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20">Add Grade</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=2c3e50&color=fff`} className="w-12 h-12 rounded-full" alt="Profile" />
              <div>
                <h3 className="font-bold text-gray-800 truncate max-w-[120px]">{user.username}</h3>
                <p className="text-sm text-gray-500">{user.level || '100L'} Law</p>
              </div>
            </div>
            
            <nav className="flex flex-col gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    activeTab === tab.id 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3 font-medium">
                    {tab.icon}
                    {tab.label}
                  </div>
                  {activeTab === tab.id && <ChevronRight size={18} />}
                </button>
              ))}
              
              <button onClick={logout} className="flex items-center justify-between p-3 rounded-lg transition-all text-red-500 hover:bg-red-50 hover:text-red-700 mt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 font-medium">
                  <LogOut size={20} />
                  Logout
                </div>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'grades' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-serif font-bold text-primary">Academic Performance</h2>
                    <div className="flex gap-2">
                       <select 
                        value={selectedLevel} 
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="p-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary outline-none"
                       >
                         <option value="All">All Levels</option>
                         <option>100L</option><option>200L</option><option>300L</option><option>400L</option><option>500L</option>
                       </select>
                       <select 
                        value={selectedSemester} 
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="p-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary outline-none"
                       >
                         <option value="All">All Semesters</option>
                         <option value="Semester 1">1st Semester</option>
                         <option value="Semester 2">2nd Semester</option>
                       </select>
                       {selectedLevel !== 'All' && selectedSemester !== 'All' && (
                         <button 
                          onClick={() => {setSelectedCourse(''); setGradeError(''); setShowGradeModal(true)}}
                          className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-md transition-all whitespace-nowrap"
                         >
                           + Add Grade
                         </button>
                       )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg">
                      <p className="opacity-80 font-medium mb-1">
                        {selectedLevel === 'All' ? 'Overall Avg' : `${selectedLevel} GPA`}
                      </p>
                      <h3 className="text-4xl font-bold">{calculateSemesterGpa()}</h3>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-700 text-white p-6 rounded-xl shadow-lg">
                      <p className="opacity-80 font-medium mb-1">General CGPA</p>
                      <h3 className="text-4xl font-bold">{calculateCgpa()}</h3>
                    </div>
                  </div>
                  
                  {filteredGrades.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                            <th className="pb-4 pr-4">Course Code</th>
                            <th className="pb-4 px-4">Level</th>
                            <th className="pb-4 px-4">Semester</th>
                            <th className="pb-4 px-4 text-right">Grade</th>
                            <th className="pb-4 pl-4"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredGrades.map(g => (
                            <tr key={g.id} className="text-gray-700 hover:bg-gray-50 transition-colors group">
                              <td className="py-4 pr-4">
                                <div className="font-bold text-gray-800">{g.course_code}</div>
                                <div className="text-[10px] text-gray-400 font-medium line-clamp-1">{g.course?.title}</div>
                              </td>
                              <td className="py-4 px-4 text-sm font-medium">{g.level}</td>
                              <td className="py-4 px-4 text-sm text-gray-500">{g.semester.replace(`${g.level} `, '')}</td>
                              <td className="py-4 px-4 text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                                  g.grade === 'A' ? 'bg-green-100 text-green-700' :
                                  g.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                  g.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {g.grade}
                                </span>
                              </td>
                              <td className="py-4 pl-4 text-right opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => handleDeleteGrade(g.id)} className="text-gray-300 hover:text-red-500 font-bold text-sm">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-12 border border-gray-100 text-center">
                      <p className="text-gray-500 mb-2">No grades found for the selected criteria.</p>
                      <p className="text-xs text-gray-400 italic">Try changing the filters or adding a new grade.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="max-w-xl">
                  <h2 className="text-2xl font-serif font-bold text-primary mb-6">Manage Profile</h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">First Name</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={profileForm.firstName} 
                          onChange={e => setProfileForm({...profileForm, firstName: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Last Name</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={profileForm.lastName} 
                          onChange={e => setProfileForm({...profileForm, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Email Address</label>
                      <input type="email" className="input-field bg-gray-50 text-gray-400 cursor-not-allowed" value={user.email} disabled />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Phone Number</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={profileForm.phoneNumber} 
                        onChange={e => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Home Address</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={profileForm.address} 
                        onChange={e => setProfileForm({...profileForm, address: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Academic Level</label>
                      <select 
                        className="input-field" 
                        value={profileForm.level} 
                        onChange={e => setProfileForm({...profileForm, level: e.target.value})}
                      >
                        <option>100L</option><option>200L</option><option>300L</option><option>400L</option><option>500L</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Preferred Courses (Optional)</label>
                      <textarea 
                        className="input-field min-h-[100px] py-3" 
                        placeholder="e.g. Criminal Law, Tort Law"
                        value={profileForm.preferredCourses} 
                        onChange={e => setProfileForm({...profileForm, preferredCourses: e.target.value})}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isUpdatingProfile}
                      className="btn-primary w-full py-4 text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'resources' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-serif font-bold text-primary">Academic Resources</h2>
                    <div className="flex flex-1 max-w-md gap-2">
                       <input 
                        type="text" 
                        placeholder="Search resources..." 
                        className="input-field flex-1 text-sm py-2"
                        value={resourceSearch}
                        onChange={e => setResourceSearch(e.target.value)}
                       />
                       <select 
                        className="p-2 border border-gray-200 rounded-lg text-sm bg-white outline-none"
                        value={resourceLevelFilter}
                        onChange={e => setResourceLevelFilter(e.target.value)}
                       >
                         <option value="All">All Levels</option>
                         <option>100L</option><option>200L</option><option>300L</option><option>400L</option><option>500L</option>
                       </select>
                    </div>
                  </div>
                  
                  {filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                      {filteredResources.map(r => (
                        <div key={r.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-primary/40 hover:shadow-md transition-all group relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-primary/10" />
                          <div className="relative flex items-start justify-between">
                            <div className="pr-8">
                              <span className="text-[10px] uppercase tracking-widest font-black text-primary/40 mb-2 block">
                                {r.resource_type} • {r.level}
                              </span>
                              <h3 className="font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">{r.title}</h3>
                              <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{r.description || 'Access legal documents, past questions, and lecture notes for your level.'}</p>
                            </div>
                            <div className="bg-gray-50 p-2.5 rounded-xl group-hover:bg-primary/10 transition-colors">
                              <FileText className="text-gray-400 group-hover:text-primary" size={20} />
                            </div>
                          </div>
                          <a 
                            href={r.file_path.startsWith('http') ? r.file_path : `http://localhost:4000/${r.file_path}`} 
                            target="_blank" 
                            className="inline-flex items-center gap-2 text-primary text-xs font-bold hover:gap-3 transition-all"
                          >
                            Download Material <ChevronRight size={14} />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-20 border border-dashed border-gray-200 text-center">
                      <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 font-medium">No materials match your search.</p>
                      <button onClick={() => {setResourceSearch(''); setResourceLevelFilter('All')}} className="mt-4 text-primary text-sm font-bold hover:underline">Clear all filters</button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'tasks' && (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-primary mb-6">Task Manager</h2>
                  <div className="bg-white rounded-xl border border-gray-100 p-1">
                    <div className="flex gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-6">
                      <input 
                        type="text" 
                        placeholder="What's your next study goal?" 
                        className="bg-transparent flex-1 outline-none px-2 text-gray-700 font-medium placeholder:text-gray-400"
                        value={newTaskText}
                        onChange={e => setNewTaskText(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAddTask()}
                      />
                      <button onClick={handleAddTask} className="bg-primary text-white p-2 rounded-lg hover:scale-105 transition-transform">
                        <ChevronRight size={24} />
                      </button>
                    </div>
                    
                    {tasks.length > 0 ? (
                      <div className="space-y-2 p-1">
                        {tasks.map(t => (
                          <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-50 hover:border-gray-100 hover:shadow-sm transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4 flex-1">
                              <button 
                                onClick={() => handleToggleTask(t.id)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  t.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-gray-200 hover:border-primary'
                                }`}
                              >
                                {t.status === 'completed' && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
                              </button>
                              <span className={`font-medium transition-all ${
                                t.status === 'completed' ? 'text-gray-300 line-through' : 'text-gray-700'
                              }`}>
                                {t.task}
                              </span>
                            </div>
                            <button 
                              onClick={() => handleDeleteTask(t.id)}
                              className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                              title="Delete Task"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-20">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckSquare size={32} className="opacity-20" />
                        </div>
                        <p className="font-serif italic">Your study agenda is currently clear.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

      </main>
      <Footer />
    </div>
  );
}
