'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications'>('account');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
            SocialHub
          </h1>
          <div className="flex items-center space-x-4">
            <Link href="/feed" className="text-sm text-gray-500 hover:text-indigo-600">Home</Link>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
          {(['account', 'privacy', 'notifications'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium capitalize transition ${
                activeTab === tab 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Account Settings */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input 
                    type="text" 
                    defaultValue="User"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input 
                    type="text" 
                    defaultValue="@user"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea 
                    rows={3}
                    placeholder="Tell us about yourself"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Email</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="user@example.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Password</h3>
              <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                Change Password
              </button>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Profile Visibility</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Public Profile</p>
                    <p className="text-sm text-gray-500">Anyone can see your profile</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Show in Search</p>
                    <p className="text-sm text-gray-500">Allow search engines to index your profile</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Show Online Status</p>
                    <p className="text-sm text-gray-500">Let others see when you're online</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                </label>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Content</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Allow Comments</p>
                    <p className="text-sm text-gray-500">Let others comment on your posts</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Allow Shares</p>
                    <p className="text-sm text-gray-500">Let others share your content</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Push Notifications</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">New Followers</p>
                    <p className="text-sm text-gray-500">Get notified when someone follows you</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Likes</p>
                    <p className="text-sm text-gray-500">Get notified when someone likes your posts</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Comments</p>
                    <p className="text-sm text-gray-500">Get notified when someone comments</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Mentions</p>
                    <p className="text-sm text-gray-500">Get notified when someone mentions you</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                </label>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Weekly Digest</p>
                    <p className="text-sm text-gray-500">Receive weekly summary of activity</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Marketing Emails</p>
                    <p className="text-sm text-gray-500">Receive updates about new features</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex items-center justify-between">
          <button 
            onClick={handleLogout}
            className="px-6 py-2 text-red-600 hover:bg-red-50 rounded-xl transition"
          >
            Sign Out
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}
