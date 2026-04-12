import React, { useState, useEffect } from 'react';
import {
    User as UserIcon, Mail, Calendar, Save,
    Camera, ShieldCheck, BadgeCheck, Loader2
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import API_ENDPOINTS from '../config/apiConfig';
import { useToast } from '../store/toastStore';

const Profile = () => {
    const { user, token, login } = useAuthStore();
    const { addToast } = useToast();

    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setIsSaving(true);

        try {
            const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.PROFILE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update profile');
            }

            const updatedUser = await response.json();

            // Update local store with data from backend (ensuring _id mapping)
            login(token, {
                ...updatedUser,
                id: updatedUser._id || updatedUser.id
            });

            addToast('Profile updated successfully', 'success');
        } catch (err: any) {
            addToast(err.message || 'Failed to update profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    const createdAtDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }) : 'N/A';

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header section */}
            <div className="flex flex-col gap-1 border-b border-slate-200 dark:border-slate-800 pb-6">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">User Profile</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Manage your identity and account security settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* Left: Avatar & Quick Info */}
                <div className="md:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col items-center text-center space-y-4">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                                {user.name}
                                <BadgeCheck className="h-5 w-5 text-indigo-500" />
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                        </div>

                        <div className="pt-4 w-full border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Verified Status</span>
                            <span className="text-emerald-500">Active</span>
                        </div>
                    </div>

                    <div className="bg-indigo-600/5 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                            <Calendar className="h-5 w-5" />
                            <h3 className="font-black text-xs uppercase tracking-wider">Account Metadata</h3>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Member Since</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{createdAtDate}</p>
                        </div>
                    </div>
                </div>

                {/* Right: Editable Form */}
                <div className="md:col-span-8 flex flex-col gap-6">
                    <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl space-y-8">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <UserIcon className="h-5 w-5 text-indigo-500" />
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your name"
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Enter your email"
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-indigo-500/20 transition-all active:scale-95 group"
                            >
                                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />}
                                {isSaving ? 'Saving Changes...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>

                    <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-6 flex items-start gap-4">
                        <div className="p-2 bg-rose-500/10 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-rose-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">Account Resilience</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your profile data is critical for accurate stability modeling. Ensure your email is up-to-date for system recovery protocols.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
