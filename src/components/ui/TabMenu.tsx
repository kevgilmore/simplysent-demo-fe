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
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative pb-4 px-2 font-semibold text-base transition-colors duration-200 whitespace-nowrap
              ${activeTab === tab.id
                ? 'text-[#5E57AC]'
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5E57AC] rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
