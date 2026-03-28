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
  CheckSquare
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
    if (!authLoading) {
      if (!user || user.id !== 1) {
        router.push('/dashboard');
      } else {
        fetchAdminData();
      }
    }
  }, [user, authLoading]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, usersData, resourcesData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        dashboardApi.getResources() // Reuse existing
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

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.firstName && u.firstName.toLowerCase().includes(userSearch.toLowerCase())) ||
    (u.lastName && u.lastName.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const [news, setNews] = useState<any[]>([]);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsForm, setNewsForm] = useState({ title: '', content: '', category: 'News', level: 'All' });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ 
    title: '', description: '', level: '100L', type: 'Lecture Notes', file: null as File | null 
  });
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'resources', label: 'Resources', icon: <FileText size={20} /> },
    { id: 'news', label: 'News & Alerts', icon: <BookOpen size={20} /> },
  ];

  const handleDeleteResource = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Resource?",
      message: "Are you sure you want to remove this academic resource? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await adminApi.deleteResource(id);
          fetchAdminData();
          showToast('Resource deleted');
        } catch (err) {
          showToast('Failed to delete resource', 'error');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  useEffect(() => {
    if (activeTab === 'news') fetchNews();
  }, [activeTab]);

  if (authLoading || (user && user.id !== 1)) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading Admin Panel...</div>;
  }

  const handleFileUpload = async () => {
    if (!uploadForm.file) return showToast('Please select a file', 'info');
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('level', uploadForm.level);
    formData.append('type', uploadForm.type);

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/admin/resources/upload`;
    console.log('Uploading to:', apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { error: await response.text() || 'Unknown server error' };
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      showToast('Resource uploaded successfully!');
      setShowUploadModal(false);
      setUploadForm({ title: '', description: '', level: '100L', type: 'Lecture Notes', file: null });
      fetchAdminData();
    } catch (err: any) {
      console.error('Upload Error:', err);
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const fetchNews = async () => {
    try {
      const data = await dashboardApi.getNews();
      setNews(data);
    } catch (err) { console.error(err); }
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

  const handleDeleteNews = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete News?",
      message: "Are you sure you want to remove this announcement?",
      onConfirm: async () => {
        try {
          await adminApi.deleteNews(id);
          fetchNews();
          showToast('News deleted');
        } catch (err) {
          showToast('Failed to delete news', 'error');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Toast {...toast} onClose={() => setToast({ ...toast, isVisible: false })} />
      <ConfirmModal 
        {...confirmModal} 
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
      />

      <main className="flex-1 pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white p-3 rounded-xl shadow-lg shadow-red-200">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Admin Control</h1>
              <p className="text-gray-500 text-sm">System administration and performance insights.</p>
            </div>
          </div>
          <button 
            onClick={fetchAdminData}
            className="p-2 text-gray-400 hover:text-primary transition-all hover:bg-white rounded-lg border border-transparent hover:border-gray-200"
          >
            Refresh Data
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-28">
              <nav className="flex flex-col gap-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${
                      activeTab === tab.id 
                        ? 'bg-red-50 text-red-600 border border-red-100' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">System Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-600">All Systems Operational</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <section className="flex-1 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8 min-h-[600px] relative">
            
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                    <div className="text-blue-600 mb-4"><Users size={32} /></div>
                    <p className="text-sm font-bold text-blue-800 uppercase tracking-wider">Total Students</p>
                    <p className="text-4xl font-serif font-bold text-blue-900">{stats?.totalUsers || 0}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                    <div className="text-emerald-600 mb-4"><BookOpen size={32} /></div>
                    <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Resources Available</p>
                    <p className="text-4xl font-serif font-bold text-emerald-900">{stats?.totalResources || 0}</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl">
                    <div className="text-purple-600 mb-4"><GraduationCap size={32} /></div>
                    <p className="text-sm font-bold text-purple-800 uppercase tracking-wider">Grades Recorded</p>
                    <p className="text-4xl font-serif font-bold text-purple-900">{stats?.totalGradesRecorded || 0}</p>
                  </div>
                </div>

                <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[150px]">
                   <p className="text-gray-400 font-medium">Quick stats and activity visualizer coming soon...</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && !selectedUserInsight && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900">Student Directory</h2>
                    <p className="text-gray-500 text-sm">Monitor academic progress and user activity.</p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="input-field pl-10 w-full sm:w-64"
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                        <th className="p-4 rounded-tl-xl">Student</th>
                        <th className="p-4">Level</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4 text-right rounded-tr-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-gray-900">{u.firstName} {u.lastName}</div>
                            <div className="text-xs text-secondary font-medium">@{u.username}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold whitespace-nowrap">
                              {u.level}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-500">{u.email}</td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => fetchUserInsights(u.id)}
                              className="text-primary text-xs font-bold hover:underline"
                            >
                              View Insights
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="py-12 text-center text-gray-400">No users found matching "{userSearch}"</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && selectedUserInsight && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <button 
                  onClick={() => setSelectedUserInsight(null)}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                  <ArrowLeft size={16} /> <span className="text-sm font-bold">Back to Directory</span>
                </button>
                
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-3xl font-serif font-bold text-gray-900">
                          {selectedUserInsight.user.firstName} {selectedUserInsight.user.lastName}
                        </h2>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded">
                          {selectedUserInsight.user.level}
                        </span>
                      </div>
                      <p className="text-gray-500">@{selectedUserInsight.user.username} • {selectedUserInsight.user.email}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center min-w-[120px]">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">General CGPA</p>
                      <p className="text-3xl font-serif font-bold text-secondary">{selectedUserInsight.cgpa}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                       <GraduationCap size={20} className="text-secondary" /> Academic Records
                    </h3>
                    <div className="space-y-3">
                      {selectedUserInsight.grades.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">No grades recorded for this student yet.</p>
                      ) : (
                        selectedUserInsight.grades.map((g: any) => (
                          <div key={g.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl">
                            <div>
                              <div className="text-sm font-bold text-gray-800">{g.course.course_code}</div>
                              <div className="text-[10px] text-gray-400 font-medium">{g.course.title}</div>
                            </div>
                            <div className="px-3 py-1 bg-gray-50 text-gray-800 font-bold rounded text-lg border border-gray-100">
                              {g.grade}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                       <CheckSquare size={20} className="text-secondary" /> Recent Tasks
                    </h3>
                    <div className="space-y-3">
                      {selectedUserInsight.tasks.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">No tasks created by this student.</p>
                      ) : (
                        selectedUserInsight.tasks.map((t: any) => (
                          <div key={t.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl opacity-80">
                            <div className={`w-2 h-2 rounded-full ${t.is_completed ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                            <span className={`text-sm ${t.is_completed ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>
                              {t.task}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Resource Repository</h2>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                  >
                    <Upload size={18} /> Upload New
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map(res => (
                    <div key={res.id} className="p-4 border border-gray-100 rounded-xl bg-white hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="bg-gray-100 p-2 rounded-lg text-gray-500"><FileText size={20} /></div>
                        <button 
                          onClick={() => handleDeleteResource(res.id)}
                          className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">{res.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{res.level} • {res.type}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'news' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900">News & Announcements</h2>
                    <p className="text-gray-500 text-sm">Post updates to the student body.</p>
                  </div>
                  <button 
                    onClick={() => setShowNewsModal(true)}
                    className="bg-secondary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <BookOpen size={18} /> Post News
                  </button>
                </div>

                <div className="space-y-4">
                  {news.map(item => (
                    <div key={item.id} className="p-5 border border-gray-100 rounded-2xl bg-white hover:border-secondary/20 transition-all flex items-start justify-between group">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded uppercase">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteNews(item.id)}
                        className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {news.length === 0 && (
                    <div className="py-12 text-center text-gray-400">No news posted yet.</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Modals outside tab logic */}
            {showNewsModal && (
              <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Create Announcement</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title</label>
                      <input 
                        className="input-field" 
                        type="text" 
                        placeholder="Announcing Exam Timetable..."
                        value={newsForm.title}
                        onChange={e => setNewsForm({...newsForm, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
                        <select className="input-field" value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value})}>
                          <option>News</option><option>Exam</option><option>Blog</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Target Level</label>
                        <select className="input-field" value={newsForm.level} onChange={e => setNewsForm({...newsForm, level: e.target.value})}>
                          <option>All</option><option>100L</option><option>200L</option><option>300L</option><option>400L</option><option>500L</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Content</label>
                      <textarea 
                        className="input-field min-h-[150px] py-3" 
                        placeholder="Write your announcement here..."
                        value={newsForm.content}
                        onChange={e => setNewsForm({...newsForm, content: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button onClick={() => setShowNewsModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all">Cancel</button>
                      <button onClick={handleCreateNews} className="flex-1 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Publish</button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {showUploadModal && (
              <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Upload size={20} className="text-primary" /> Upload Study Material
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Resource Title</label>
                      <input 
                        className="input-field" 
                        type="text" 
                        placeholder="e.g., Constitutional Law II Lecture Notes"
                        value={uploadForm.title}
                        onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
                        <select className="input-field" value={uploadForm.type} onChange={e => setUploadForm({...uploadForm, type: e.target.value})}>
                          <option>Lecture Notes</option><option>Past Questions</option><option>Cases</option><option>Textbooks</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Target Level</label>
                        <select className="input-field" value={uploadForm.level} onChange={e => setUploadForm({...uploadForm, level: e.target.value})}>
                          <option>100L</option><option>200L</option><option>300L</option><option>400L</option><option>500L</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description (Optional)</label>
                      <textarea 
                        className="input-field min-h-[80px] py-3" 
                        placeholder="Brief description of the material..."
                        value={uploadForm.description}
                        onChange={e => setUploadForm({...uploadForm, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">File (PDF, Docx, etc.)</label>
                      <div className="relative group">
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
                        <div className={`p-6 border-2 border-dashed rounded-xl text-center transition-all ${uploadForm.file ? 'border-primary bg-primary/5' : 'border-gray-200 group-hover:border-primary/40'}`}>
                          <Upload className={`mx-auto mb-2 ${uploadForm.file ? 'text-primary' : 'text-gray-300'}`} size={32} />
                          <p className="text-sm font-medium text-gray-600">
                            {uploadForm.file ? uploadForm.file.name : 'Click to select or drag and drop'}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Max size: 10MB</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        disabled={uploading}
                        onClick={() => setShowUploadModal(false)} 
                        className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button 
                        disabled={uploading || !uploadForm.file || !uploadForm.title}
                        onClick={handleFileUpload} 
                        className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Uploading...
                          </>
                        ) : (
                          'Upload Resource'
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
            
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
