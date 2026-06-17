import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShieldAlert, Menu, X, Search, 
  Grid, Bell, Mail, LogOut, Eye, RefreshCw, CheckCircle2, 
  Loader2, UserPlus, Contact
} from 'lucide-react';
import { getSession, clearSession } from '../utils/auth';
import type { AuthSession } from '../utils/auth';
import { fetchDashboardData } from '../services/api';

interface DashboardProps {
  onLogout: () => void;
}

interface MenuItem {
  name: string;
  icon: any;
  path: string;
  active?: boolean;
  hasDropdown?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('User & Master ID Request');

  // Load session & check token on mount
  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      handleLogout();
      return;
    }
    setSession(currentSession);

    // Call the external API using the token
    const testApiCall = async () => {
      try {
        await fetchDashboardData(currentSession.token);
        console.log("Dashboard API connection verified.");
      } catch (err: any) {
        console.warn("API Call with token failed, falling back to local layout data. Error:", err.message);
      }
    };

    testApiCall();
  }, []);

  const handleLogout = () => {
    clearSession();
    onLogout();
  };

  if (!session) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  // Sidebar navigation data structure
  const sidebarMenu: MenuSection[] = [
    {
      title: 'Navigation',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', active: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`bg-[#fcfbf9] border-r border-slate-200/60 flex flex-col z-30 transition-all duration-300 shrink-0 ${
        sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'
      } fixed md:static h-screen`}>
        
        {/* Sidebar Brand Title */}
        <div className={`border-b border-slate-200/60 flex items-center h-16 shrink-0 ${
          sidebarOpen ? 'p-4 justify-between' : 'p-0 justify-center w-full'
        }`}>
          <div className={`flex items-center gap-2 overflow-hidden ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
              A
            </div>
            {sidebarOpen && (
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-sm text-slate-800 tracking-tight leading-none">
                  AdminUX <span className="text-rose-500 text-[10px] bg-rose-50 px-1 py-0.5 rounded ml-0.5">PRO</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Admin Dashboard
                </span>
              </div>
            )}
          </div>
          
          {/* Close button for mobile views */}
          {sidebarOpen && (
            <button 
              type="button" 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Sidebar Scroll Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 text-left">
          {sidebarMenu.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              {sidebarOpen && (
                <h4 className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  {group.title}
                </h4>
              )}
              <ul className="space-y-1">
                {group.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <a
                      href={item.path}
                      className={`flex items-center rounded-xl text-sm font-semibold transition-all ${
                        sidebarOpen ? 'px-3 py-2.5 justify-between' : 'p-2.5 justify-center'
                      } ${
                        item.active 
                          ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
                        <item.icon className={`w-4.5 h-4.5 ${item.active ? 'text-indigo-600' : 'text-slate-400'}`} />
                        {sidebarOpen && <span>{item.name}</span>}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="p-3 border-t border-slate-200/60 bg-[#fcfbf9]/50 shrink-0">
          {sidebarOpen ? (
            <div className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-card">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-login-green text-login-gold font-bold flex items-center justify-center shadow-inner text-sm shrink-0">
                  {session.firstName[0]}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate leading-none">
                    {session.firstName} {session.lastName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-1">
                    Code: {session.userCode}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="w-9 h-9 rounded-xl bg-login-green text-login-gold font-bold flex items-center justify-center shadow-inner text-sm ring-1 ring-emerald-800/10" title={`${session.firstName} ${session.lastName}`}>
                {session.firstName[0]}
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-center"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="bg-white border-b border-slate-100 h-16 shrink-0 flex items-center justify-between px-4 md:px-6 z-20">
          <div className="flex items-center gap-4 flex-1">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search container */}
            <div className="relative max-w-md w-full hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-slate-50 border-0 pl-9 pr-4 py-2 text-xs rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* API Auth Status badge removed */}

            {/* Grid icon */}
            <button className="p-1.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 hidden xs:block">
              <Grid className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="p-1.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white">
                12
              </span>
            </button>

            {/* Chat messages */}
            <button className="p-1.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 relative">
              <Mail className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white">
                5
              </span>
            </button>

            {/* User Profile - First Character Placeholder */}
            <div className="flex items-center border-l border-slate-100 pl-4">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center shadow-md text-sm ring-2 ring-indigo-100">
                {session.firstName ? session.firstName[0].toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* CONTAINER CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          
          {/* Action Tabs row */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 flex-wrap">
            {['User & Master ID Request', 'Master ID Request', 'Business ID Request'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Stats row cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            
            {/* Stat Card 1 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">New Users</span>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1">12</h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Today</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    ▲ 8%
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Master ID Request</span>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1">36</h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Today</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    ▲ 12%
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Contact className="w-5 h-5" />
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Re-requests</span>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1">21</h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Today</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    ▼ 5%
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Verified</span>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1">18</h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Today</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    ▲ 15%
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Stat Card 5 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card flex items-center justify-between col-span-2 md:col-span-1">
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pending Verification</span>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1">30</h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Total Pending</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Three-Column Users List Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMN 1: Users ID Request */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-extrabold text-slate-800 text-sm">Users ID Request</h4>
                  <a href="#viewall" onClick={(e) => e.preventDefault()} className="text-indigo-600 text-xs font-bold hover:underline">View all</a>
                </div>
                
                {/* Column Lists */}
                <div className="space-y-4">
                  
                  {/* Item 1 */}
                  <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs uppercase leading-none">KAVIN SHARMA</h5>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">MU_123456 • BANGALORE</p>
                      </div>
                    </div>
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                      <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                        16+ <Eye className="w-3 h-3 inline" /> Message
                      </span>
                      <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                        AD. 1234567890123
                      </span>
                      <span className="bg-pink-50 text-pink-600 px-2 py-0.5 rounded-md">
                        Guardian +91 9995559999
                      </span>
                    </div>
                    {/* Action button */}
                    <button 
                      onClick={() => alert('Verification successfully triggered for Kavin Sharma')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm shadow-indigo-100"
                    >
                      Verify Now
                    </button>
                  </div>

                  {/* Item 2 */}
                  <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs uppercase leading-none">KAVIN SHARMA</h5>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">MU_123456 • BANGALORE</p>
                      </div>
                    </div>
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                      <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                        16+ <Eye className="w-3 h-3 inline" /> Message
                      </span>
                      <span className="bg-pink-50 text-pink-600 px-2 py-0.5 rounded-md">
                        User +91 9995559999
                      </span>
                    </div>
                    {/* Action button */}
                    <button 
                      onClick={() => alert('Verification successfully triggered for Kavin Sharma')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm shadow-indigo-100"
                    >
                      Verify Now
                    </button>
                  </div>

                </div>
              </div>
              <button 
                onClick={() => alert('Navigating to full user list...')}
                className="w-full border border-indigo-200 hover:bg-indigo-50 text-indigo-600 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer mt-4"
              >
                View All New Users
              </button>
            </div>

            {/* COLUMN 2: Master ID Request */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-extrabold text-slate-800 text-sm">Master ID Request</h4>
                  <a href="#viewall" onClick={(e) => e.preventDefault()} className="text-indigo-600 text-xs font-bold hover:underline">View all</a>
                </div>

                <div className="space-y-4">
                  
                  {/* Item 1 */}
                  <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs uppercase leading-none">abhishek</h5>
                        <p className="text-[10px] text-indigo-600 font-bold mt-1">BHA_XXXXXXXX • BANGALORE</p>
                      </div>
                    </div>
                    {/* Extra details */}
                    <div className="text-[10px] text-slate-500 font-semibold space-y-1 pl-1 border-l-2 border-indigo-200">
                      <p>Master ID: <span className="font-bold text-slate-700">MU_123456</span></p>
                      <p>Request Date: <span className="font-bold text-slate-700">11-12-2024</span></p>
                    </div>
                    {/* Action button */}
                    <button 
                      onClick={() => alert('Verification successfully triggered for abhishek')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-sm shadow-indigo-100"
                    >
                      Verify Now
                    </button>
                  </div>

                  {/* Item 2 */}
                  <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1547037579-f0fc020ac3be?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs uppercase leading-none">ROHAN TALPADHI</h5>
                        <p className="text-[10px] text-indigo-600 font-bold mt-1">BHA_XXXXXXXX • BANGALORE</p>
                      </div>
                    </div>
                    {/* Extra details */}
                    <div className="text-[10px] text-slate-500 font-semibold space-y-1 pl-1 border-l-2 border-indigo-200">
                      <p>Master ID: <span className="font-bold text-slate-700">MU_123456</span></p>
                      <p>Request Date: <span className="font-bold text-slate-700">11-12-2024</span></p>
                    </div>
                    {/* Action button */}
                    <button 
                      onClick={() => alert('Verification successfully triggered for Rohan Talpadhi')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-sm shadow-indigo-100"
                    >
                      Verify Now
                    </button>
                  </div>

                  {/* Item 3 */}
                  <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs uppercase leading-none">ROHAN TALPADHI</h5>
                        <p className="text-[10px] text-indigo-600 font-bold mt-1">BHA_XXXXXXXX • BANGALORE</p>
                      </div>
                    </div>
                    {/* Extra details */}
                    <div className="text-[10px] text-slate-500 font-semibold space-y-1 pl-1 border-l-2 border-indigo-200">
                      <p>Master ID: <span className="font-bold text-slate-700">MU_123456</span></p>
                      <p>Request Date: <span className="font-bold text-slate-700">11-12-2024</span></p>
                    </div>
                    {/* Action button */}
                    <button 
                      onClick={() => alert('Verification successfully triggered for Rohan Talpadhi')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-sm shadow-indigo-100"
                    >
                      Verify Now
                    </button>
                  </div>

                </div>
              </div>
              <button 
                onClick={() => alert('Navigating to Master ID list...')}
                className="w-full border border-indigo-200 hover:bg-indigo-50 text-indigo-600 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer mt-4"
              >
                View All ID Requests
              </button>
            </div>

            {/* COLUMN 3: New ID Re-requests */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-extrabold text-slate-800 text-sm">New ID Re-requests</h4>
                  <a href="#viewall" onClick={(e) => e.preventDefault()} className="text-indigo-600 text-xs font-bold hover:underline">View all</a>
                </div>

                <div className="space-y-4">
                  
                  {/* Item 1 */}
                  <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs uppercase leading-none">ROHAN TALPADHI</h5>
                        <p className="text-[10px] text-pink-600 font-bold mt-1">MU_123456 • BANGALORE</p>
                      </div>
                    </div>
                    {/* Extra details */}
                    <div className="text-[10px] text-slate-500 font-semibold space-y-1 pl-1 border-l-2 border-pink-200">
                      <p className="font-bold text-pink-600">Master ID Re-Request</p>
                      <p>Master ID: <span className="font-bold text-slate-700">MU_123456</span></p>
                      <p>Request Date: <span className="font-bold text-slate-700">11-12-2024</span></p>
                    </div>
                    {/* Action button */}
                    <button 
                      onClick={() => alert('Verification successfully triggered for Rohan Talpadhi')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-sm shadow-indigo-100"
                    >
                      Verify Now
                    </button>
                  </div>

                  {/* Item 2 */}
                  <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs uppercase leading-none">ROHAN TALPADHI</h5>
                        <p className="text-[10px] text-pink-600 font-bold mt-1">BHA_XXXXXXXX • BANGALORE</p>
                      </div>
                    </div>
                    {/* Extra details */}
                    <div className="text-[10px] text-slate-500 font-semibold space-y-1 pl-1 border-l-2 border-pink-200">
                      <p className="font-bold text-pink-600">Master ID Re-Request</p>
                      <p>Master ID: <span className="font-bold text-slate-700">MU_123456</span></p>
                      <p>Request Date: <span className="font-bold text-slate-700">11-12-2024</span></p>
                    </div>
                    {/* Action button */}
                    <button 
                      onClick={() => alert('Verification successfully triggered for Rohan Talpadhi')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-sm shadow-indigo-100"
                    >
                      Verify Now
                    </button>
                  </div>

                  {/* Item 3 */}
                  <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs uppercase leading-none">ROHAN TALPADHI</h5>
                        <p className="text-[10px] text-pink-600 font-bold mt-1">BHA_XXXXXXXX • BANGALORE</p>
                      </div>
                    </div>
                    {/* Extra details */}
                    <div className="text-[10px] text-slate-500 font-semibold space-y-1 pl-1 border-l-2 border-pink-200">
                      <p className="font-bold text-pink-600">Master ID Re-Request</p>
                      <p>Master ID: <span className="font-bold text-slate-700">MU_123456</span></p>
                      <p>Request Date: <span className="font-bold text-slate-700">11-12-2024</span></p>
                    </div>
                    {/* Action button */}
                    <button 
                      onClick={() => alert('Verification successfully triggered for Rohan Talpadhi')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-sm shadow-indigo-100"
                    >
                      Verify Now
                    </button>
                  </div>

                </div>
              </div>
              <button 
                onClick={() => alert('Navigating to Re-requests list...')}
                className="w-full border border-indigo-200 hover:bg-indigo-50 text-indigo-600 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer mt-4"
              >
                View All Re-requests
              </button>
            </div>

          </div>

          {/* Verification Steps Progress flows */}
          <div className="space-y-6">
            
            {/* Flow 1: User Verification */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium text-left">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">User Verification</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Pipeline visual flow indicator</p>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  30 Pending
                </span>
              </div>
              
              {/* Stepper container */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
                
                {/* Step 1 */}
                <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 p-3.5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    1
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Submitted</h6>
                    <p className="text-base font-extrabold text-slate-700 mt-0.5">30</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 p-3.5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    2
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">In Review</h6>
                    <p className="text-base font-extrabold text-slate-700 mt-0.5">12</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 p-3.5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    3
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Under Verification</h6>
                    <p className="text-base font-extrabold text-slate-700 mt-0.5">10</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 p-3.5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    4
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Approved</h6>
                    <p className="text-base font-extrabold text-slate-700 mt-0.5">25</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 p-3.5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    5
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Rejected</h6>
                    <p className="text-base font-extrabold text-slate-700 mt-0.5">5</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Flow 2: Master ID Verification */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium text-left">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Master ID Verification</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Pipeline visual flow indicator</p>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  45 Pending
                </span>
              </div>
              
              {/* Stepper container */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
                
                {/* Step 1 */}
                <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 p-3.5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    1
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Submitted</h6>
                    <p className="text-base font-extrabold text-slate-700 mt-0.5">45</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 p-3.5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    2
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">In Review</h6>
                    <p className="text-base font-extrabold text-slate-700 mt-0.5">18</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 p-3.5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    3
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Under Verification</h6>
                    <p className="text-base font-extrabold text-slate-700 mt-0.5">15</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 p-3.5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    4
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Approved</h6>
                    <p className="text-base font-extrabold text-slate-700 mt-0.5">35</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 p-3.5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    5
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Rejected</h6>
                    <p className="text-base font-extrabold text-slate-700 mt-0.5">7</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
