"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardApi } from '@/lib/api';
import { addGradeAction, deleteGradeAction } from '../actions';
import Toast, { ToastType } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

export default function GradesTab({ initialGrades, allCourses }: { initialGrades: any[], allCourses: any[] }) {
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('A');
  const [gradeError, setGradeError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '', type: 'success', isVisible: false
  });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });

  // Filter available courses synchronously on the client
  const availableCourses = allCourses.filter(c => 
    c.level === selectedLevel && c.semester === `${selectedLevel} ${selectedSemester}`
  );

  useEffect(() => {
    if (showGradeModal && selectedCourse) {
      const existing = initialGrades.find(g => g.course_code === selectedCourse && g.level === selectedLevel && g.semester.includes(selectedSemester));
      if (existing) {
        setSelectedGrade(existing.grade);
      } else {
        setSelectedGrade('A');
      }
    }
  }, [selectedCourse, showGradeModal, initialGrades, selectedLevel, selectedSemester]);

  const handleAddGrade = async () => {
    if (!selectedCourse) {
      setGradeError('Please select a course');
      return;
    }
    setIsAdding(true);
    try {
      await addGradeAction({
        course_code: selectedCourse,
        grade: selectedGrade,
        level: selectedLevel,
        semester: `${selectedLevel} ${selectedSemester}`
      });
      setShowGradeModal(false);
      setToast({ message: 'Grade saved successfully!', type: 'success', isVisible: true });
    } catch (err) {
      setGradeError('Failed to add grade');
      setToast({ message: 'Error saving grade', type: 'error', isVisible: true });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteGrade = async (id: number) => {
    try {
      await deleteGradeAction(id);
      setToast({ message: 'Grade deleted', type: 'info', isVisible: true });
    } catch (e) {
      setToast({ message: 'Failed to delete grade', type: 'error', isVisible: true });
    }
    setConfirmModal({ isOpen: false, id: null });
  };

  const gradePoints: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
  
  const filteredGrades = initialGrades.filter(g => {
    const levelMatch = selectedLevel === 'All' || g.level === selectedLevel;
    const semesterMatch = selectedSemester === 'All' || g.semester.includes(selectedSemester);
    return levelMatch && semesterMatch;
  });

  const calculateCgpa = (data = initialGrades) => {
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

  const calculateSemesterGpa = () => calculateCgpa(filteredGrades);

  return (
    <div>
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={() => setToast({ ...toast, isVisible: false })} />
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title="Delete Grade?"
        message="Are you sure you want to remove this course grade? Your CGPA will be recalculated."
        confirmLabel="Delete"
        onConfirm={() => confirmModal.id && handleDeleteGrade(confirmModal.id)}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />

      {showGradeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-none p-8 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-primary mb-6">Add New Grade</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary/40 uppercase mb-2">Grade for {selectedLevel} - {selectedSemester}</label>
                <select 
                  className="input-field" 
                  value={selectedCourse} 
                  onChange={e => setSelectedCourse(e.target.value)}
                >
                  <option value="">-- Select Course --</option>
                  {availableCourses.map(c => {
                    const existing = initialGrades.find(g => g.course_code === c.course_code && g.level === selectedLevel && g.semester.includes(selectedSemester));
                    return (
                      <option key={c.id} value={c.course_code}>
                        {existing ? `[EDIT] ${c.course_code}: ${c.title} (Current: ${existing.grade})` : `[ENTER] ${c.course_code}: ${c.title}`}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-primary/40 uppercase mb-2">Score/Grade</label>
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
                <button onClick={() => setShowGradeModal(false)} className="flex-1 py-3 text-primary/60 font-bold hover:bg-light">Cancel</button>
                <button onClick={handleAddGrade} disabled={isAdding} className="flex-1 py-3 bg-primary text-white font-bold disabled:opacity-50">Save Grade</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-4xl font-serif tracking-tighter uppercase text-primary border-b border-primary/20 pb-4 mb-8">Academic Performance</h2>
        <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto mt-4 md:mt-0">
            <select 
            value={selectedLevel} 
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="p-2 border border-gray-200 rounded-none text-sm bg-white focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="All">All Levels</option>
              <option>100L</option><option>200L</option><option>300L</option><option>400L</option><option>500L</option>
            </select>
            <select 
            value={selectedSemester} 
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="p-2 border border-gray-200 rounded-none text-sm bg-white focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="All">All Semesters</option>
              <option value="Semester 1">1st Semester</option>
              <option value="Semester 2">2nd Semester</option>
            </select>
            {selectedLevel !== 'All' && selectedSemester !== 'All' && (
              <button 
              onClick={() => {setSelectedCourse(''); setGradeError(''); setShowGradeModal(true)}}
              className="col-span-2 md:col-span-1 px-4 py-3 md:py-2 bg-primary text-white text-xs uppercase tracking-widest font-bold border border-primary shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
              >
                + Add Grade
              </button>
            )}
        </div>
      </div>

      <motion.div layout className={`grid grid-cols-1 gap-4 mb-8 ${selectedLevel === 'All' && selectedSemester === 'All' ? '' : 'sm:grid-cols-2'}`}>
        <AnimatePresence mode="popLayout">
          {!(selectedLevel === 'All' && selectedSemester === 'All') && (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-6 border-l-4 border-l-primary border-y border-r border-primary/20 relative shadow-sm"
            >
              <p className="text-[10px] uppercase tracking-widest font-bold text-primary/60 mb-2">
                {selectedLevel !== 'All' && selectedSemester !== 'All' 
                  ? `${selectedLevel} • ${selectedSemester.replace('Semester ', '')} Semester GPA` 
                  : selectedLevel !== 'All' 
                    ? `${selectedLevel} CGPA` 
                    : `${selectedSemester} GPA (All Levels)`}
              </p>
              <h3 className="text-5xl font-serif tracking-tighter text-primary">{calculateSemesterGpa()}</h3>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div layout transition={{ duration: 0.4 }} className="bg-white p-6 border-l-4 border-l-secondary border-y border-r border-primary/20 relative shadow-sm h-full">
          <p className="text-[10px] uppercase tracking-widest font-bold text-primary/60 mb-2">General CGPA</p>
          <h3 className="text-5xl font-serif tracking-tighter text-primary">{calculateCgpa()}</h3>
        </motion.div>
      </motion.div>
      
      {filteredGrades.length > 0 ? (
        <>
          <div className="md:hidden space-y-4 mb-4">
            {filteredGrades.map(g => (
              <div key={g.id} className="bg-white p-4 border border-primary/20 relative shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-primary font-serif tracking-tight text-xl">{g.course_code}</div>
                    <div className="text-[10px] uppercase tracking-widest text-primary/60 font-bold mt-1 line-clamp-1">{g.course?.title}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-3xl font-bold text-primary leading-none">{g.grade}</span>
                  </div>
                </div>
                <div className="flex justify-between items-end border-t border-primary/10 pt-3 mt-1">
                  <div className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                    {g.level} • {g.semester.replace(`${g.level} `, '')}
                  </div>
                  <button onClick={() => setConfirmModal({ isOpen: true, id: g.id })} className="text-red-500/80 font-bold text-[10px] uppercase tracking-widest">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-primary/40 font-bold">
                <th className="pb-4 pr-4">Course Code</th>
                <th className="pb-4 px-4">Level</th>
                <th className="pb-4 px-4">Semester</th>
                <th className="pb-4 px-4 text-right">Grade</th>
                <th className="pb-4 pl-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredGrades.map(g => (
                <tr key={g.id} className="text-primary/90 hover:bg-light transition-colors group">
                  <td className="py-4 pr-4">
                    <div className="font-bold text-primary">{g.course_code}</div>
                    <div className="text-[10px] text-primary/40 font-medium tracking-wide line-clamp-1">{g.course?.title}</div>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium tracking-wide">{g.level}</td>
                  <td className="py-4 px-4 text-sm text-primary/60">{g.semester.replace(`${g.level} `, '')}</td>
                  <td className="py-4 px-4 text-right">
                    <span className={`inline-block px-3 py-1 rounded-none text-xs font-black ${
                      g.grade === 'A' ? 'bg-green-100 text-green-700' :
                      g.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                      g.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {g.grade}
                    </span>
                  </td>
                  <td className="py-4 pl-4 text-right opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setConfirmModal({ isOpen: true, id: g.id })} className="text-gray-300 hover:text-red-500 font-bold text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      ) : (
        <div className="bg-light rounded-none p-12 border border-gray-100 text-center">
          <p className="text-primary/60 mb-2">No grades found for the selected criteria.</p>
          <p className="text-xs text-primary/40 italic">Try changing the filters or adding a new grade.</p>
        </div>
      )}
    </div>
  );
}
