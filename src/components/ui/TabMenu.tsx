import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabMenuProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabMenu: React.FC<TabMenuProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-8 border-b-2 border-gray-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isAi = tab.id === 'ai-picks';
          const isTech = tab.id === 'tech';
          const isGolf = tab.id === 'golf';

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative pb-4 px-2 font-semibold text-base transition-colors duration-200 whitespace-nowrap
              ${isActive
                ? (isAi
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                    : 'text-[#5E57AC]')
                : (isAi
                    ? 'text-purple-600'
                    : 'text-gray-500 hover:text-gray-700')
              }
            `}
            >
            <span className="inline-flex items-center gap-2">
              {/* Icon */}
              {isAi && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={`${isActive ? 'text-purple-500' : 'text-purple-500'}`}>
                  <path d="M12 2l2.39 5.26L20 8.27l-4 3.89L17.18 18 12 15.45 6.82 18 8 12.16 4 8.27l5.61-1.01L12 2z" />
                </svg>
              )}
              {isTech && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={`${isActive ? 'text-[#5E57AC]' : 'text-gray-500'}`}>
                  <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 4v3M17 4v3M7 20v-3M17 20v-3M4 7h3M4 17h3M20 7h-3M20 17h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
              {isGolf && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={`${isActive ? 'text-[#5E57AC]' : 'text-gray-500'}`}>
                  <path d="M5 21v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M5 12l10-4-4 3 4 3-10-2z" fill="currentColor" />
                  <circle cx="18" cy="20" r="1.5" fill="currentColor" />
                </svg>
              )}
              {/* Label */}
              {tab.label}
            </span>
            {isActive && (
              <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-full ${isAi ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' : 'bg-[#5E57AC]'}`}></div>
            )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
