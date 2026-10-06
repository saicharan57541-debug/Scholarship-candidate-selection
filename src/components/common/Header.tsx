import React, { useState } from 'react';
import { UserProfile, NotificationItem } from '../../types';
import { 
  Bell, 
  User, 
  RotateCcw, 
  Check, 
  ChevronDown, 
  GraduationCap, 
  ShieldCheck, 
  X,
  ExternalLink,
  Award
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  notifications: NotificationItem[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onResetData: () => void;
  onOpenAwardLetter?: (applicationId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  activeTab,
  onSelectTab,
  notifications,
  onMarkNotificationAsRead,
  onClearAllNotifications,
  onResetData,
  onOpenAwardLetter,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadNotifs = notifications.filter(
    (n) => (n.recipientId === currentUser.id || (currentUser.role === 'admin' && n.recipientId === 'admin') || n.recipientId === 'all') && !n.read
  );

  const userNotifs = notifications.filter(
    (n) => n.recipientId === currentUser.id || (currentUser.role === 'admin' && n.recipientId === 'admin') || n.recipientId === 'all'
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ZONE 1: Single text wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                SCHOLAR<span className="text-indigo-600">SELECT</span>
              </span>
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Metropolitan Institute</span>
              <span aria-hidden="true">·</span>
              <span>Financial Aid Portal</span>
            </div>
          </div>

          {/* ZONE 2: 4-6 Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`hover:text-slate-900 transition-colors cursor-pointer py-1 border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              {currentUser.role === 'admin' ? 'Admin Board' : 'Dashboard'}
            </button>

            <button
              onClick={() => onSelectTab('schemes')}
              className={`hover:text-slate-900 transition-colors cursor-pointer py-1 border-b-2 ${
                activeTab === 'schemes'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Scholarship Schemes
            </button>

            <button
              onClick={() => onSelectTab('eligibility')}
              className={`hover:text-slate-900 transition-colors cursor-pointer py-1 border-b-2 ${
                activeTab === 'eligibility'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Eligibility Checker
            </button>

            <button
              onClick={() => onSelectTab('applications')}
              className={`hover:text-slate-900 transition-colors cursor-pointer py-1 border-b-2 ${
                activeTab === 'applications'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              {currentUser.role === 'admin' ? 'Review Applications' : 'My Applications'}
            </button>

            <button
              onClick={() => onSelectTab('merit-list')}
              className={`hover:text-slate-900 transition-colors cursor-pointer py-1 border-b-2 ${
                activeTab === 'merit-list'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Merit Lists
            </button>

            <button
              onClick={() => onSelectTab('reports')}
              className={`hover:text-slate-900 transition-colors cursor-pointer py-1 border-b-2 ${
                activeTab === 'reports'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Analytics
            </button>
          </nav>

          {/* ZONE 3: Primary Actions (Role Switcher, Notifications, User) */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Reset */}
            <button
              onClick={onResetData}
              title="Reset sample data to fresh initial state"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowUserMenu(false);
                }}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer focus:outline-none"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown Popover */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Notifications ({unreadNotifs.length} new)
                    </span>
                    {userNotifs.length > 0 && (
                      <button
                        onClick={onClearAllNotifications}
                        className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {userNotifs.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications right now.
                      </div>
                    ) : (
                      userNotifs.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 text-xs transition-colors hover:bg-slate-50 ${
                            !item.read ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-900">{item.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{item.date}</span>
                          </div>
                          <p className="text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                          <div className="mt-2 flex items-center justify-between">
                            {item.applicationId && onOpenAwardLetter && item.type === 'selection' ? (
                              <button
                                onClick={() => {
                                  onOpenAwardLetter(item.applicationId!);
                                  setShowNotifMenu(false);
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                              >
                                <Award className="w-3.5 h-3.5" /> View Award Letter
                              </button>
                            ) : <span />}
                            {!item.read && (
                              <button
                                onClick={() => onMarkNotificationAsRead(item.id)}
                                className="text-[11px] text-slate-500 hover:text-slate-800"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User & Role Switcher Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer text-left focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                  {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:block text-xs">
                  <p className="font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{currentUser.role === 'admin' ? 'Board Chair' : 'Student'}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Selection Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                      Switch Active Account
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Explore as student applicant or committee admin
                    </p>
                  </div>

                  <div className="py-1">
                    {allUsers.map((user) => {
                      const isSelected = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            onSelectUser(user);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs hover:bg-slate-50 transition-colors cursor-pointer ${
                            isSelected ? 'bg-indigo-50/60 font-semibold text-indigo-900' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              user.role === 'admin' ? 'bg-indigo-900 text-white' : 'bg-slate-200 text-slate-800'
                            }`}>
                              {user.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{user.name}</p>
                              <p className="text-[10px] text-slate-500">
                                {user.role === 'admin' ? 'Evaluation Board (Admin)' : `Student · ${user.studentId}`}
                              </p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-4 pt-2 pb-1 border-t border-slate-100 text-[11px] text-slate-400">
                    Active Role: <span className="font-semibold text-slate-700 uppercase">{currentUser.role}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center gap-3 overflow-x-auto py-2.5 border-t border-slate-100 text-xs text-slate-600 scrollbar-none">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap font-medium px-2 py-1 rounded ${
              activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
            }`}
          >
            {currentUser.role === 'admin' ? 'Admin Board' : 'Dashboard'}
          </button>
          <button
            onClick={() => onSelectTab('schemes')}
            className={`whitespace-nowrap font-medium px-2 py-1 rounded ${
              activeTab === 'schemes' ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
            }`}
          >
            Schemes
          </button>
          <button
            onClick={() => onSelectTab('eligibility')}
            className={`whitespace-nowrap font-medium px-2 py-1 rounded ${
              activeTab === 'eligibility' ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
            }`}
          >
            Eligibility
          </button>
          <button
            onClick={() => onSelectTab('applications')}
            className={`whitespace-nowrap font-medium px-2 py-1 rounded ${
              activeTab === 'applications' ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
            }`}
          >
            {currentUser.role === 'admin' ? 'Applications' : 'My Apps'}
          </button>
          <button
            onClick={() => onSelectTab('merit-list')}
            className={`whitespace-nowrap font-medium px-2 py-1 rounded ${
              activeTab === 'merit-list' ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
            }`}
          >
            Merit List
          </button>
          <button
            onClick={() => onSelectTab('reports')}
            className={`whitespace-nowrap font-medium px-2 py-1 rounded ${
              activeTab === 'reports' ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
            }`}
          >
            Analytics
          </button>
        </div>
      </div>
    </header>
  );
};
