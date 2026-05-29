"use client";

import { useState } from 'react';
import { updateProfileAction } from '../actions';
import Toast, { ToastType } from '@/components/Toast';

export default function ProfileTab({ user }: { user: any }) {
  const [profileForm, setProfileForm] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phoneNumber: user.phoneNumber || '',
    address: user.address || '',
    level: user.level || '100L',
    preferredCourses: user.preferredCourses || ''
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '', type: 'success', isVisible: false
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfileAction(profileForm);
      setToast({ message: 'Profile updated successfully!', type: 'success', isVisible: true });
    } catch (err) {
      setToast({ message: 'Failed to update profile', type: 'error', isVisible: true });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-xl relative">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
      <h2 className="text-4xl font-serif tracking-tighter uppercase text-primary border-b border-primary/20 pb-4 mb-8">Manage Profile</h2>
      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-primary/40 mb-2">First Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={profileForm.firstName} 
              onChange={e => setProfileForm({...profileForm, firstName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-primary/40 mb-2">Last Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={profileForm.lastName} 
              onChange={e => setProfileForm({...profileForm, lastName: e.target.value})}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-primary/40 mb-2">Email Address</label>
          <input type="email" className="input-field bg-light text-primary/40 cursor-not-allowed" value={user.email} disabled />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-primary/40 mb-2">Phone Number</label>
          <input 
            type="text" 
            className="input-field" 
            value={profileForm.phoneNumber} 
            onChange={e => setProfileForm({...profileForm, phoneNumber: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-primary/40 mb-2">Home Address</label>
          <input 
            type="text" 
            className="input-field" 
            value={profileForm.address} 
            onChange={e => setProfileForm({...profileForm, address: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-primary/40 mb-2">Academic Level</label>
          <select 
            className="input-field" 
            value={profileForm.level} 
            onChange={e => setProfileForm({...profileForm, level: e.target.value})}
          >
            <option>100L</option><option>200L</option><option>300L</option><option>400L</option><option>500L</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-primary/40 mb-2">Preferred Courses (Optional)</label>
          <textarea 
            className="input-field min-h-[100px] py-3" 
            placeholder="e.g. Criminal Law, Tort Law"
            value={profileForm.preferredCourses} 
            onChange={e => setProfileForm({...profileForm, preferredCourses: e.target.value})}
          />
        </div>
        <button 
          type="submit" 
          disabled={isUpdating}
          className="btn-primary w-full py-4 text-white font-bold shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isUpdating ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
