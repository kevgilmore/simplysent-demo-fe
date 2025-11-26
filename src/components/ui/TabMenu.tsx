import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faStar,
    faMicrochip,
    faGolfBallTee,
} from "@fortawesome/free-solid-svg-icons";

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
    className = "",
}) => {
    return (
        <div className={`w-full ${className}`}>
            <div className="flex gap-8 border-b-2 border-gray-200 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const isAi = tab.id === "ai-picks";
                    const isTech = tab.id === "tech";
                    const isGolf = tab.id === "golf";

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`relative pb-4 px-2 font-medium text-base transition-colors duration-200 whitespace-nowrap
              ${
                  isActive
                      ? isAi
                          ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                          : "text-[#5E57AC]"
                      : isAi
                        ? "text-purple-600"
                        : "text-gray-500 hover:text-gray-700"
              }
            `}
                        >
                            <span className="inline-flex items-center gap-2">
                                {/* Icon */}
                                {isAi && (
                                    <FontAwesomeIcon
                                        icon={faStar}
                                        className={`${isActive ? "text-purple-500" : "text-purple-500"}`}
                                    />
                                )}
                                {isTech && (
                                    <FontAwesomeIcon
                                        icon={faMicrochip}
                                        className={`${isActive ? "text-[#5E57AC]" : "text-gray-500"}`}
                                    />
                                )}
                                {isGolf && (
                                    <FontAwesomeIcon
                                        icon={faGolfBallTee}
                                        className={`${isActive ? "text-[#5E57AC]" : "text-gray-500"}`}
                                    />
                                )}
                                {/* Label */}
                                {tab.label}
                            </span>
                            {isActive && (
                                <div
                                    className={`absolute bottom-0 left-0 right-0 h-1 rounded-full ${isAi ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" : "bg-[#5E57AC]"}`}
                                ></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
