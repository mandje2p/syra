import { Users, Phone, Calendar, FileCheck, Bell } from 'lucide-react';
import { useState } from 'react';

interface PerformanceProps {
  onNotificationClick: () => void;
  notificationCount: number;
}

export default function Performance({ onNotificationClick, notificationCount }: PerformanceProps) {
  const [selectedTab, setSelectedTab] = useState<'generales' | 'leads-chauds'>('generales');
  const [duration, setDuration] = useState('2 semaines');

  const kpis = [
    { label: 'Nombre de leads', value: '335424', icon: Users, color: 'from-blue-400 to-blue-600' },
    { label: 'À rappeler', value: '5859', icon: Phone, color: 'from-violet-400 to-violet-600' },
    { label: 'RDV pris', value: '11566', icon: Calendar, color: 'from-indigo-400 to-indigo-600' },
    { label: 'Signés', value: '181', icon: FileCheck, color: 'from-purple-400 to-purple-600' },
  ];

  const generateLineChartData = (points: number) => {
    const data = [];
    for (let i = 0; i < points; i++) {
      data.push(Math.random() * 2000 + 500);
    }
    return data;
  };

  const generateDates = (days: number) => {
    const dates = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).replace('.', ''));
    }
    return dates;
  };

  const leadsData = generateLineChartData(14);
  const rdvData = generateLineChartData(14);
  const dates = generateDates(13);

  const maxLeads = Math.max(...leadsData);
  const maxRdv = Math.max(...rdvData);

  const createSVGPath = (data: number[], max: number, width: number, height: number) => {
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (value / max) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Performance</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Analysez vos données et optimisez vos résultats</p>
        </div>
        <button onClick={onNotificationClick} className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-105 relative flex-shrink-0">
          <Bell className="w-5 h-5 text-gray-900 dark:text-gray-300" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-light shadow-lg animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>
      </header>

      <div className="p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="glass-card glass-card-hover p-6 floating-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-gray-500 font-light">{kpi.label}</span>
                </div>
                <p className="text-3xl font-light text-gray-900">{kpi.value}</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto">
          <button
            onClick={() => setSelectedTab('generales')}
            className={`px-4 md:px-5 py-2 text-xs md:text-sm font-light rounded-full transition-all whitespace-nowrap ${
              selectedTab === 'generales'
                ? 'text-blue-600 bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            Générales
          </button>
          <button
            onClick={() => setSelectedTab('leads-chauds')}
            className={`px-4 md:px-5 py-2 text-xs md:text-sm font-light rounded-full transition-all whitespace-nowrap ${
              selectedTab === 'leads-chauds'
                ? 'text-blue-600 bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            Leads chauds
          </button>
        </div>

        <div className="glass-card p-4 md:p-6 lg:p-8 floating-shadow mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h3 className="text-base md:text-lg font-light text-gray-900 mb-1">Durée</h3>
              <p className="text-xs md:text-sm text-gray-500 font-light">Visualisez les métriques de votre entreprise.</p>
            </div>
            <div>
              <label className="block text-xs md:text-sm text-gray-600 font-light mb-2">Sélectionnez une durée:</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full md:w-auto px-4 py-2 bg-white border border-gray-200 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
              >
                <option>7 jours</option>
                <option>2 semaines</option>
                <option>1 mois</option>
                <option>3 mois</option>
              </select>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-base font-light text-gray-900">Leads utilisés par jour</h4>
                <span className="text-xl md:text-2xl font-light text-gray-900">{Math.round(maxLeads)}</span>
              </div>
              <div className="relative h-64">
                <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path
                    d={createSVGPath(leadsData, maxLeads, 1000, 180) + ' L 1000,200 L 0,200 Z'}
                    fill="url(#lineGradient1)"
                  />

                  <path
                    d={createSVGPath(leadsData, maxLeads, 1000, 180)}
                    fill="none"
                    stroke="#818CF8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {leadsData.map((value, index) => {
                    const x = (index / (leadsData.length - 1)) * 1000;
                    const y = 180 - (value / maxLeads) * 180;
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#818CF8"
                        className="hover:r-6 transition-all cursor-pointer"
                      />
                    );
                  })}
                </svg>

                <div className="flex justify-between mt-4">
                  {dates.map((date, index) => (
                    <span key={index} className="text-xs text-gray-400 font-light transform -rotate-45 origin-left">
                      {date}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 mt-6">
                  <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                  <span className="text-sm text-gray-600 font-light">Nombre de leads</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-12">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-base font-light text-gray-900">Rendez-vous pris par jour</h4>
                <span className="text-xl md:text-2xl font-light text-gray-900">{Math.round(maxRdv)}</span>
              </div>
              <div className="relative h-64">
                <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path
                    d={createSVGPath(rdvData, maxRdv, 1000, 180) + ' L 1000,200 L 0,200 Z'}
                    fill="url(#lineGradient2)"
                  />

                  <path
                    d={createSVGPath(rdvData, maxRdv, 1000, 180)}
                    fill="none"
                    stroke="#818CF8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {rdvData.map((value, index) => {
                    const x = (index / (rdvData.length - 1)) * 1000;
                    const y = 180 - (value / maxRdv) * 180;
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#818CF8"
                        className="hover:r-6 transition-all cursor-pointer"
                      />
                    );
                  })}
                </svg>

                <div className="flex justify-between mt-4">
                  {dates.map((date, index) => (
                    <span key={index} className="text-xs text-gray-400 font-light transform -rotate-45 origin-left">
                      {date}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 mt-6">
                  <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                  <span className="text-sm text-gray-600 font-light">Nombre de leads</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
