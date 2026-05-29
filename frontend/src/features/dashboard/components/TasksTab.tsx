"use client";

import { useState } from 'react';
import { ChevronRight, CheckSquare, Trash2 } from 'lucide-react';
import { addTaskAction, toggleTaskAction, deleteTaskAction } from '../actions';
import ConfirmModal from '@/components/ConfirmModal';

export default function TasksTab({ initialTasks }: { initialTasks: any[] }) {
  const [newTaskText, setNewTaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    taskId: number | null;
  }>({ isOpen: false, taskId: null });

  const handleAddTask = async () => {
    if (!newTaskText.trim()) return;
    setIsAdding(true);
    try {
      await addTaskAction(newTaskText);
      setNewTaskText('');
    } catch (err) {
      console.error('Failed to add task', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTaskAction(id);
    } catch (err) {
      console.error('Failed to delete task', err);
    }
    setConfirmModal({ isOpen: false, taskId: null });
  };

  return (
    <div>
      <h2 className="text-4xl font-serif tracking-tighter uppercase text-primary border-b border-primary/20 pb-4 mb-6">Task Manager</h2>
      
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title="Delete Task?"
        message="Are you sure you want to remove this task? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => confirmModal.taskId && handleDeleteTask(confirmModal.taskId)}
        onCancel={() => setConfirmModal({ isOpen: false, taskId: null })}
      />

      <div className="bg-white border text-primary border-primary rounded-none shadow-none p-1">
        <div className="flex gap-2 p-3 bg-light rounded-none border border-gray-100 mb-6">
          <input 
            type="text" 
            placeholder="What's your next study goal?" 
            className="bg-transparent flex-1 outline-none px-2 text-primary/90 font-medium tracking-wide placeholder:text-primary/40"
            value={newTaskText}
            onChange={e => setNewTaskText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAddTask()}
            disabled={isAdding}
          />
          <button 
            onClick={handleAddTask} 
            disabled={isAdding}
            className="bg-primary text-white p-2 rounded-none hover:scale-105 transition-transform disabled:opacity-50"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        {initialTasks.length > 0 ? (
          <div className="space-y-2 p-1">
            {initialTasks.map(t => (
              <div key={t.id} className="bg-white p-4 border-b border-primary/20 hover:border-primary transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={() => toggleTaskAction(t.id)}
                    className={`w-6 h-6 rounded-none border-2 flex items-center justify-center transition-all ${
                      t.status === 'completed' ? 'bg-primary border-primary text-light' : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    {t.status === 'completed' && <div className="w-2.5 h-2.5 bg-white rounded-none " />}
                  </button>
                  <span className={`font-medium tracking-wide transition-all ${
                    t.status === 'completed' ? 'text-gray-300 line-through' : 'text-primary/90'
                  }`}>
                    {t.task}
                  </span>
                </div>
                <button 
                  onClick={() => setConfirmModal({ isOpen: true, taskId: t.id })}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                  title="Delete Task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-primary/40 py-20">
            <div className="w-20 h-20 bg-light rounded-none flex items-center justify-center mx-auto mb-6">
              <CheckSquare size={32} className="opacity-20" />
            </div>
            <p className="font-serif italic">Your study agenda is currently clear.</p>
          </div>
        )}
      </div>
    </div>
  );
}
