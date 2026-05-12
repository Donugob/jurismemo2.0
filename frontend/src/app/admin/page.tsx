"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Upload, 
  Users, 
  FileText, 
  Trash2, 
  Edit, 
  Search, 
  BarChart3, 
  BookOpen,
  ArrowLeft,
  GraduationCap,
  CheckSquare,
  Plus,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  ExternalLink,
  Lock,
  X
} from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { adminApi, dashboardApi } from '@/lib/api';
import Toast, { ToastType } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  
  // Insight Modal
  const [selectedUserInsight, setSelectedUserInsight] = useState<any>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  // News & Upload States
  const [news, setNews] = useState<any[]>([]);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsForm, setNewsForm] = useState({ title: '', content: '', category: 'News', level: 'All' });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ 
    title: '', description: '', level: '100L', type: 'Lecture Notes', file: null as File | null 
  });

  // Toast & Modal states
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '', type: 'success', isVisible: false
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: '', message: '', onConfirm: () => {}
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  useEffect(() => {
    if (!authLoading && user && user.email === 'donugob1@gmail.com') {
      fetchAdminData();
    }
  }, [user, authLoading]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, usersData, resourcesData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        dashboardApi.getResources()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setResources(resourcesData);
    } catch (err) {
      showToast('Failed to fetch admin data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInsights = async (userId: number) => {
    setIsInsightLoading(true);
    try {
      const insight = await adminApi.getUserInsights(userId);
      setSelectedUserInsight(insight);
    } catch (err) {
      showToast('Failed to fetch user insights', 'error');
    } finally {
      setIsInsightLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      const data = await dashboardApi.getNews();
      setNews(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (activeTab === 'news') fetchNews();
  }, [activeTab]);

  const handleFileUpload = async () => {
    if (!uploadForm.file) return showToast('Please select a file', 'info');
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('level', uploadForm.level);
    formData.append('type', uploadForm.type);

    const apiUrl = '/api/resources'; // Point to the internal API route

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        // No headers needed for multipart/form-data with cookies
        body: formData
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { error: await response.text() || 'Unknown server error' };
      }
      
      if (!response.ok) throw new Error(data.error || 'Upload failed');
      
      showToast('Resource uploaded successfully!');
      setShowUploadModal(false);
      setUploadForm({ title: '', description: '', level: '100L', type: 'Lecture Notes', file: null });
      fetchAdminData();
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateNews = async () => {
    try {
      await adminApi.createNews(newsForm);
      setShowNewsModal(false);
      setNewsForm({ title: '', content: '', category: 'News', level: 'All' });
      fetchNews();
      showToast('News published!');
    } catch (err) {
      showToast('Failed to publish news', 'error');
    }
  };

  const handleDeleteResource = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Confirm Deletion",
      message: "This action will permanently remove this academic resource. Proceed?",
      onConfirm: async () => {
        try {
          await adminApi.deleteResource(id);
          fetchAdminData();
          showToast('Resource deleted');
        } catch (err) {
          showToast('Deletion failed', 'error');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteNews = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Remove Announcement?",
      message: "This will remove the news item from all student dashboards.",
      onConfirm: async () => {
        try {
          await adminApi.deleteNews(id);
          fetchNews();
          showToast('News deleted');
        } catch (err) {
          showToast('Deletion failed', 'error');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.firstName && u.firstName.toLowerCase().includes(userSearch.toLowerCase())) ||
    (u.lastName && u.lastName.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Students', icon: Users },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'news', label: 'Announcements', icon: BookOpen },
  ];

  if (authLoading || (user && user.email !== 'donugob1@gmail.com')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-light font-serif text-primary p-6 text-center">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xl md:text-2xl italic"
        >
          Authenticating administrative credentials...
        </motion.div>
      </div>
    );
  }

  const PageHeader = ({ title, subtitle, actions }: any) => (
    <div className="mb-12 md:mb-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-primary/10 pb-8 md:pb-12">
        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-secondary mb-4"
          >
            <Shield className="w-4 h-4 md:w-5 md:h-5 text-secondary" strokeWidth={1.5} />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">Administrative Protocol</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-8xl font-serif text-primary leading-tight md:leading-none mb-4 md:mb-6"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-primary/60 font-serif italic max-w-lg"
          >
            {subtitle}
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          {actions}
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-light selection:bg-secondary/10 overflow-x-hidden">
      <Navbar />
      <Toast {...toast} onClose={() => setToast({ ...toast, isVisible: false })} />
      <ConfirmModal 
        {...confirmModal} 
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
      />

      <main className="flex-1 pt-24 md:pt-32 pb-12 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        
        {/* Navigation / Index */}
        <div className="flex overflow-x-auto no-scrollbar gap-8 md:gap-12 border-b border-primary/5 mb-12 md:mb-20 scroll-smooth">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedUserInsight(null); }}
              className={`pb-4 md:pb-6 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] transition-all relative group flex items-center gap-2 md:gap-3 whitespace-nowrap ${
                activeTab === tab.id ? 'text-primary' : 'text-primary/30 hover:text-primary/60'
              }`}
            >
              <tab.icon className="w-4 h-4 md:w-5 md:h-5 text-current" strokeWidth={activeTab === tab.id ? 2 : 1.5} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="tab-active"
                  className="absolute bottom-0 left-0 w-full h-1 bg-secondary"
                />
              )}
            </button>
          ))}
        </div>

        <section className="relative">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <PageHeader 
                  title="Overview" 
                  subtitle="Comprehensive metrics and system health indicators for the JurisMemo ecosystem."
                  actions={
                    <button 
                      onClick={fetchAdminData}
                      className="btn-outline flex items-center gap-2 text-xs md:text-sm py-3 px-6"
                    >
                      <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                      Sync Records
                    </button>
                  }
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-primary/10 border border-primary/10">
                  <div className="bg-light p-8 md:p-12 hover:bg-white transition-colors group">
                    <Users className="text-secondary mb-8 md:mb-12 group-hover:scale-110 transition-transform duration-500 w-8 h-8 md:w-12 md:h-12" strokeWidth={1} />
                    <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/40 mb-2">Academic Population</h3>
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl md:text-7xl font-serif text-primary tracking-tighter">{stats?.totalUsers || 0}</span>
                      <span className="text-xs md:text-sm font-serif italic text-primary/40">Verified Students</span>
                    </div>
                  </div>
                  <div className="bg-light p-8 md:p-12 hover:bg-white transition-colors group">
                    <FileText className="text-secondary mb-8 md:mb-12 group-hover:scale-110 transition-transform duration-500 w-8 h-8 md:w-12 md:h-12" strokeWidth={1} />
                    <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/40 mb-2">Curated Materials</h3>
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl md:text-7xl font-serif text-primary tracking-tighter">{stats?.totalResources || 0}</span>
                      <span className="text-xs md:text-sm font-serif italic text-primary/40">Resource Units</span>
                    </div>
                  </div>
                  <div className="bg-light p-8 md:p-12 hover:bg-white transition-colors group md:col-span-2 lg:col-span-1">
                    <GraduationCap className="text-secondary mb-8 md:mb-12 group-hover:scale-110 transition-transform duration-500 w-8 h-8 md:w-12 md:h-12" strokeWidth={1} />
                    <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/40 mb-2">Evaluation Data</h3>
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl md:text-7xl font-serif text-primary tracking-tighter">{stats?.totalGradesRecorded || 0}</span>
                      <span className="text-xs md:text-sm font-serif italic text-primary/40">Individual Records</span>
                    </div>
                  </div>
                </div>

                <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
                  <div className="space-y-8">
                    <div className="border-l-4 border-secondary pl-6 md:pl-8">
                      <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">System Governance</h2>
                      <p className="text-base md:text-lg text-primary/60 font-serif italic leading-relaxed">
                        Currently monitoring all administrative gateways. Ensuring seamless distribution of academic materials to 100L through 500L student brackets.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6 p-6 md:p-8 bg-primary/5 rounded-sm border border-primary/5">
                      <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_#8c1d1d]" />
                      <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary/70">Central Neural Link: Operational</span>
                    </div>
                  </div>
                  <div className="relative aspect-video bg-primary/5 border border-primary/10 overflow-hidden flex items-center justify-center rounded-sm">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-10" />
                    <div className="z-10 text-center px-6">
                      <BarChart3 size={48} className="mx-auto text-primary/10 mb-4" />
                      <p className="font-serif italic text-primary/40 text-base md:text-lg">Visual activity mapping coming soon.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {!selectedUserInsight ? (
                  <>
                    <PageHeader 
                      title="Directory" 
                      subtitle="A curated index of all students registered within the JurisMemo network. Monitor academic standing and engagement."
                      actions={
                        <div className="relative group w-full lg:w-96">
                          <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={18} />
                          <input 
                            type="text" 
                            placeholder="Find student by name or id..." 
                            className="bg-primary/5 border-none px-12 md:px-16 py-3 md:py-4 w-full font-serif italic text-base md:text-lg focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-primary/20 rounded-none"
                            value={userSearch}
                            onChange={e => setUserSearch(e.target.value)}
                          />
                        </div>
                      }
                    />

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white border border-primary/5">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-primary/10 text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40">
                            <th className="p-8">Identification</th>
                            <th className="p-8">Academic Year</th>
                            <th className="p-8">Communication</th>
                            <th className="p-8 text-right">Access</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                          {filteredUsers.map((u, idx) => (
                            <motion.tr 
                              key={u.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="group hover:bg-light transition-colors"
                            >
                              <td className="p-8">
                                <div className="font-serif text-2xl text-primary mb-1">{u.firstName} {u.lastName}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-primary/30">@{u.username}</div>
                              </td>
                              <td className="p-8">
                                <span className="text-sm font-bold uppercase tracking-widest border border-primary/10 px-4 py-2 bg-white">
                                  {u.level}
                                </span>
                              </td>
                              <td className="p-8 text-lg font-serif italic text-primary/60">{u.email}</td>
                              <td className="p-8 text-right">
                                <button 
                                  onClick={() => fetchUserInsights(u.id)}
                                  className="text-primary/40 hover:text-secondary flex items-center gap-2 justify-end ml-auto group/btn transition-all"
                                >
                                  <span className="text-xs font-bold uppercase tracking-widest translate-x-0 transition-all">View Dossier</span>
                                  <ChevronRight size={20} />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {filteredUsers.map((u, idx) => (
                        <motion.div 
                          key={u.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => fetchUserInsights(u.id)}
                          className="bg-white border border-primary/5 p-6 active:bg-light transition-colors relative group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="font-serif text-xl text-primary">{u.firstName} {u.lastName}</div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-primary/30">@{u.username}</div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest border border-primary/10 px-3 py-1 bg-white">
                              {u.level}
                            </span>
                          </div>
                          <div className="text-sm font-serif italic text-primary/60 mb-4">{u.email}</div>
                          <div className="flex items-center justify-end text-secondary text-[10px] font-bold uppercase tracking-widest gap-1">
                            Review Dossier <ChevronRight size={14} />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {filteredUsers.length === 0 && (
                      <div className="py-24 text-center">
                        <p className="font-serif italic text-xl md:text-2xl text-primary/20 font-light">No matching records found in directory.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-5xl mx-auto"
                  >
                    <button 
                      onClick={() => setSelectedUserInsight(null)}
                      className="flex items-center gap-4 text-primary/40 hover:text-primary mb-8 md:mb-12 transition-colors uppercase text-[10px] md:text-xs font-bold tracking-widest"
                    >
                      <ArrowLeft size={16} /> Return to Directory
                    </button>

                    <div className="bg-white border border-primary/5 p-8 md:p-16 relative overflow-hidden rounded-sm">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl" />
                      
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16 md:mb-20 relative z-10">
                        <div>
                          <div className="flex items-center gap-4 mb-6">
                            <span className="px-4 py-1 bg-secondary text-light text-[10px] font-bold uppercase tracking-widest">
                              {selectedUserInsight.user.level} Protocol
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Ref: #{selectedUserInsight.user.id}</span>
                          </div>
                          <h2 className="text-4xl md:text-7xl font-serif text-primary mb-4 leading-tight uppercase tracking-tighter">
                            {selectedUserInsight.user.firstName}<br className="hidden md:block" /> {selectedUserInsight.user.lastName}
                          </h2>
                          <p className="text-lg md:text-xl font-serif italic text-primary/60">@{selectedUserInsight.user.username} — {selectedUserInsight.user.email}</p>
                        </div>
                        <div className="border border-primary/10 p-8 md:p-12 text-center bg-white shadow-2xl shadow-primary/5 min-w-[160px] md:min-w-[200px]">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-4">Academic CGPA</p>
                          <p className="text-5xl md:text-6xl font-serif text-secondary font-bold tracking-tighter">{selectedUserInsight.cgpa}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 relative z-10">
                        <div>
                          <div className="flex items-center justify-between border-primary/10 mb-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                              <GraduationCap size={16} className="text-secondary" /> Academic Journal
                            </h3>
                          </div>
                          <div className="space-y-6">
                            {selectedUserInsight.grades.length === 0 ? (
                              <p className="font-serif italic text-primary/30">Zero data points recorded for this semester.</p>
                            ) : (
                              selectedUserInsight.grades.map((g: any, idx: number) => (
                                <motion.div 
                                  key={g.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-center justify-between pb-6 border-b border-primary/5 last:border-none"
                                >
                                  <div className="pr-4">
                                    <div className="text-base md:text-lg font-serif text-primary leading-tight mb-1">{g.course.title}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/40">{g.course.course_code}</div>
                                  </div>
                                  <div className="text-3xl md:text-4xl font-serif text-secondary">{g.grade}</div>
                                </motion.div>
                              ))
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
                            <CheckSquare size={16} className="text-secondary" /> Engagement Log
                          </h3>
                          <div className="space-y-4">
                            {selectedUserInsight.tasks.length === 0 ? (
                              <p className="font-serif italic text-primary/30">No recorded intellectual tasks for this period.</p>
                            ) : (
                              selectedUserInsight.tasks.map((t: any, idx: number) => (
                                <motion.div 
                                  key={t.id}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-start gap-4 p-5 md:p-6 bg-primary/5 border border-primary/5 group rounded-sm"
                                >
                                  <div className={`mt-1.5 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ring-2 md:ring-4 ring-offset-2 md:ring-offset-4 ring-offset-light ${t.is_completed ? 'bg-secondary ring-secondary/10' : 'bg-primary/20 ring-primary/5'}`} />
                                  <span className={`font-serif text-base md:text-lg leading-tight ${t.is_completed ? 'line-through text-primary/30 italic' : 'text-primary/70'}`}>
                                    {t.task}
                                  </span>
                                </motion.div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div 
                key="resources"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PageHeader 
                  title="Archive" 
                  subtitle="Centralized management of intellectual property. Manage lecture materials, case studies, and examination records."
                  actions={
                    <button 
                      onClick={() => setShowUploadModal(true)}
                      className="btn-primary flex items-center gap-2 group text-xs md:text-sm py-4 px-8 w-full md:w-auto"
                    >
                      <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                      Incorporate Material
                    </button>
                  }
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
                  {resources.map((res, idx) => (
                    <motion.div 
                      key={res.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white border border-primary/10 p-8 md:p-10 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden rounded-sm"
                    >
                      <div className="flex justify-between items-start mb-10 md:mb-12">
                        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-light transition-colors">
                          <FileText className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
                        </div>
                        <button 
                          onClick={() => handleDeleteResource(res.id)}
                          className="text-primary/20 hover:text-secondary md:opacity-0 group-hover:opacity-100 transition-all p-2"
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                      <h4 className="font-serif text-xl md:text-2xl text-primary leading-tight mb-4 group-hover:text-secondary transition-colors line-clamp-2 min-h-[3rem] md:min-h-[3.5rem]">{res.title}</h4>
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/5">
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2 py-1 bg-primary/5">{res.level}</span>
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2 py-1 bg-primary/5">{res.type}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'news' && (
              <motion.div 
                key="news"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PageHeader 
                  title="Gazette" 
                  subtitle="Public dissemination of institutional updates and faculty alerts. Control the flow of information across the platform."
                  actions={
                    <button 
                      onClick={() => setShowNewsModal(true)}
                      className="btn-secondary flex items-center gap-3 text-xs md:text-sm py-4 px-8 w-full md:w-auto"
                    >
                      <Plus size={18} />
                      Publish Article
                    </button>
                  }
                />

                <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
                  {news.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group flex flex-col md:flex-row gap-6 md:gap-12 pb-12 border-b border-primary/10 last:border-none"
                    >
                      <div className="md:w-48 shrink-0">
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-2">{item.category}</div>
                        <div className="font-serif italic text-primary/40 text-sm md:text-base">
                          {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-3xl md:text-4xl font-serif text-primary mb-4 md:mb-6 group-hover:text-secondary transition-colors duration-500 leading-tight">{item.title}</h4>
                        <p className="text-lg md:text-xl font-serif italic text-primary/60 leading-relaxed max-w-3xl mb-8">{item.content}</p>
                        <button 
                          onClick={() => handleDeleteNews(item.id)}
                          className="flex items-center gap-2 text-primary/20 hover:text-secondary text-[10px] font-bold uppercase tracking-widest transition-colors py-2"
                        >
                          <Trash2 size={14} /> Remove Article
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {news.length === 0 && (
                    <div className="py-24 text-center border border-dashed border-primary/10">
                      <p className="font-serif italic text-xl md:text-2xl text-primary/20 font-light px-6">The Gazette archive is currently empty.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Modals - Redesigned Editorial Style with Scaling Fixes */}
        <AnimatePresence>
          {showNewsModal && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 bg-primary/20 backdrop-blur-xl">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-light p-8 md:p-12 lg:p-16 w-full max-w-[95vw] md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto border border-primary/10 shadow-[0_40px_100px_rgba(0,0,0,0.15)] relative no-scrollbar rounded-sm"
              >
                <div className="absolute top-0 right-0 p-4 md:p-8 sticky top-0 bg-light/80 backdrop-blur-sm z-10 flex justify-end">
                  <button onClick={() => setShowNewsModal(false)} className="text-primary/20 hover:text-primary transition-colors p-2"><X className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1} /></button>
                </div>

                <div className="mb-10 md:mb-12">
                  <h3 className="text-4xl md:text-5xl font-serif text-primary mb-4 tracking-tighter">Publish Article</h3>
                  <p className="font-serif italic text-primary/40 text-base md:text-lg">Broadcast information to the student body.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-12">
                  <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 mb-3 block">Editorial Title</label>
                      <input 
                        className="w-full bg-transparent border-b border-primary/10 pb-3 text-xl md:text-2xl font-serif focus:outline-none focus:border-secondary transition-colors placeholder:text-primary/10 rounded-none" 
                        type="text" 
                        placeholder="Article Headline..."
                        value={newsForm.title}
                        onChange={e => setNewsForm({...newsForm, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 mb-3 block">Classification</label>
                        <select className="w-full bg-transparent border-b border-primary/10 pb-3 text-sm font-bold uppercase focus:outline-none rounded-none" value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value})}>
                          <option>News</option><option>Exam</option><option>Blog</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 mb-3 block">Target Audience</label>
                        <select className="w-full bg-transparent border-b border-primary/10 pb-3 text-sm font-bold uppercase focus:outline-none rounded-none" value={newsForm.level} onChange={e => setNewsForm({...newsForm, level: e.target.value})}>
                          <option>All</option><option>100L</option><option>200L</option><option>300L</option><option>400L</option><option>500L</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 mb-3 block">Content Body</label>
                    <textarea 
                      className="w-full bg-primary/5 p-6 md:p-8 min-h-[150px] md:min-h-[200px] font-serif text-base md:text-lg focus:outline-none focus:bg-primary/5 transition-colors placeholder:text-primary/10 italic rounded-none" 
                      placeholder="Compose your message here..."
                      value={newsForm.content}
                      onChange={e => setNewsForm({...newsForm, content: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 sticky bottom-0 bg-light/80 backdrop-blur-sm pt-4 md:pt-8">
                  <button onClick={handleCreateNews} className="btn-secondary flex-1 py-4 md:py-6 text-base md:text-lg uppercase tracking-widest font-bold">Transmit Dispatch</button>
                </div>
              </motion.div>
            </div>
          )}

          {showUploadModal && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 bg-primary/20 backdrop-blur-xl">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white p-8 md:p-12 lg:p-16 w-full max-w-[95vw] md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto border border-primary/10 shadow-[0_40px_100px_rgba(0,0,0,0.15)] relative no-scrollbar rounded-sm"
              >
                <div className="absolute top-0 right-0 p-4 md:p-8 sticky top-0 bg-white/80 backdrop-blur-sm z-10 flex justify-end">
                  <button onClick={() => setShowUploadModal(false)} className="text-primary/20 hover:text-primary transition-colors p-2"><X className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1} /></button>
                </div>

                <div className="mb-10 md:mb-12">
                  <h3 className="text-4xl md:text-5xl font-serif text-primary mb-4 tracking-tighter">Archive Node</h3>
                  <p className="font-serif italic text-primary/40 text-base md:text-lg">Incorporate new academic intellectual property.</p>
                </div>

                <div className="space-y-10 md:space-y-12">
                  <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 mb-3 block">Material Title</label>
                      <input 
                        className="w-full bg-transparent border-b border-primary/10 pb-3 text-xl md:text-2xl font-serif focus:outline-none focus:border-primary transition-colors placeholder:text-primary/10 rounded-none" 
                        type="text" 
                        placeholder="e.g. Constitutional Law Lecture Notes"
                        value={uploadForm.title}
                        onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 mb-3 block">Material Type</label>
                        <select className="w-full bg-transparent border-b border-primary/10 pb-3 text-sm font-bold uppercase focus:outline-none rounded-none" value={uploadForm.type} onChange={e => setUploadForm({...uploadForm, type: e.target.value})}>
                          <option>Lecture Notes</option><option>Past Questions</option><option>Cases</option><option>Textbooks</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 mb-3 block">Accessibility Range</label>
                        <select className="w-full bg-transparent border-b border-primary/10 pb-3 text-sm font-bold uppercase focus:outline-none rounded-none" value={uploadForm.level} onChange={e => setUploadForm({...uploadForm, level: e.target.value})}>
                          <option>100L</option><option>200L</option><option>300L</option><option>400L</option><option>500L</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 mb-3 block">Physical Representation (File)</label>
                      <div className="relative group bg-light border border-dashed border-primary/20 p-8 md:p-12 text-center hover:border-secondary transition-all cursor-pointer rounded-sm">
                        <input 
                          type="file" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setUploadForm(prev => ({
                              ...prev, 
                              file,
                              title: prev.title || (file ? file.name.split('.')[0] : '')
                            }));
                          }}
                        />
                        <Upload className={`mx-auto mb-4 md:mb-6 ${uploadForm.file ? 'text-secondary' : 'text-primary/10'} w-10 h-10 md:w-12 md:h-12`} strokeWidth={1} />
                        <p className="font-serif italic text-base md:text-lg text-primary/60 px-4">
                          {uploadForm.file ? uploadForm.file.name : 'Select or drag material into frame'}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/20 mt-4">Document limit: 10 megabytes</p>
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm pt-4 md:pt-8 last:mb-0">
                    <button 
                      disabled={uploading || !uploadForm.file || !uploadForm.title}
                      onClick={handleFileUpload} 
                      className="btn-primary w-full py-4 md:py-6 text-base md:text-lg uppercase tracking-widest font-bold flex items-center justify-center gap-4 disabled:opacity-30 disabled:hover:shadow-none"
                    >
                      {uploading ? (
                        <>
                          <RefreshCw className="animate-spin w-5 h-5 md:w-6 md:h-6" />
                          Indexing Records...
                        </>
                      ) : (
                        'Commit to Archive'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Global Loading Overlay */}
        <AnimatePresence>
          {isLoading && !activeTab && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-light/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 text-center"
            >
              <div className="max-w-xs md:max-w-md">
                <div className="w-16 h-16 md:w-24 md:h-24 border-t-2 border-secondary rounded-full animate-spin mx-auto mb-8" />
                <p className="font-serif italic text-xl md:text-2xl text-primary animate-pulse tracking-widest whitespace-nowrap">Compiling Administrative Data...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
