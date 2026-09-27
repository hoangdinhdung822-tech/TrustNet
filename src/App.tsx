import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { HomeFeed } from './pages/HomeFeed';
import { FactCheckPage } from './pages/FactCheckPage';
import { InspectorPage } from './pages/InspectorPage';
import { SearchPage } from './pages/SearchPage';
import { AcademyPage } from './pages/AcademyPage';
import { ScenariosPage } from './pages/ScenariosPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { SchoolIntroPage } from './pages/SchoolIntroPage';
import { DatabaseService } from './services/dbMock';
import { User } from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<User>(DatabaseService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Sync dark mode class with root html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleUserUpdate = (updated: User) => {
    setCurrentUser({ ...updated });
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Background Cyber Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Top Navbar */}
      <Navbar
        user={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
      />

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 relative z-10">
        
        {/* Left Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdminMode={isAdminMode}
        />

        {/* Dynamic Main Page Content */}
        <main className="flex-1 py-6 min-w-0">
          {activeTab === 'feed' && (
            <HomeFeed
              user={currentUser}
              onUserUpdate={handleUserUpdate}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'school' && (
            <SchoolIntroPage
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'factcheck' && (
            <FactCheckPage
              user={currentUser}
              onUserUpdate={handleUserUpdate}
            />
          )}

          {activeTab === 'inspector' && (
            <InspectorPage />
          )}

          {activeTab === 'search' && (
            <SearchPage />
          )}

          {activeTab === 'academy' && (
            <AcademyPage
              user={currentUser}
              onUserUpdate={handleUserUpdate}
            />
          )}

          {activeTab === 'scenarios' && (
            <ScenariosPage
              user={currentUser}
              onUserUpdate={handleUserUpdate}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              user={currentUser}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard />
          )}
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

    </div>
  );
}

export default App;
