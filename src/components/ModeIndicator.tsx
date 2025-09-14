import React from 'react';
import { motion } from 'framer-motion';
import { XIcon, GiftIcon } from 'lucide-react';
import { getCurrentMode } from '../utils/apiConfig';

interface ModeIndicatorProps {
  className?: string;
}

export function ModeIndicator({ className = '' }: ModeIndicatorProps) {
  const mode = getCurrentMode();
  
  if (!mode || !['sandbox', 'sandbox-local', 'training'].includes(mode)) {
    return null;
  }
  
  const clearMode = () => {
    // Remove mode parameter from URL and reload
    const url = new URL(window.location.href);
    url.searchParams.delete('mode');
    try { localStorage.removeItem('ss_api_mode'); } catch {}
    window.location.href = url.toString();
  };
  
  const getModeConfig = () => {
    switch (mode) {
      case 'sandbox':
        return {
          label: 'Sandbox Mode',
          icon: GiftIcon,
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-900',
          description: 'Development environment'
        };
      case 'sandbox-local':
        return {
          label: 'Sandbox Local Mode',
          icon: GiftIcon,
          bgColor: 'bg-green-500',
          textColor: 'text-green-900',
          description: 'Local sandbox environment'
        };
      case 'training':
        return {
          label: 'Training Mode',
          icon: GiftIcon,
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-900',
          description: 'AI model training environment'
        };
      default:
        return null;
    }
  };
  
  const config = getModeConfig();
  if (!config) return null;
  
  const { label, icon: Icon, bgColor, textColor, description } = config;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <div className={`${bgColor} ${textColor} px-3 py-1 rounded-full shadow flex items-center gap-2`}> 
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold">{label}</span>
        <button
          onClick={clearMode}
          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
          title="Clear mode and return to production"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

