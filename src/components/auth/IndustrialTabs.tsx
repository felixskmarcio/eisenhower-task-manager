import React from 'react';
import { motion } from 'framer-motion';

interface IndustrialTabsProps {
    activeTab: 'login' | 'signup';
    onChange: (tab: 'login' | 'signup') => void;
}

export const IndustrialTabs: React.FC<IndustrialTabsProps> = ({ activeTab, onChange }) => {
    return (
        <div className="flex bg-[#18181b] p-1 border border-[#27272a] mb-10 relative">
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#27272a]" />

            {/* LOGIN BUTTON */}
            <button
                onClick={() => onChange('login')}
                className="flex-1 relative py-4 text-xs font-mono tracking-widest uppercase transition-colors z-10"
            >
                {activeTab === 'login' && (
                    <motion.div
                        layoutId="active-tab"
                        className="absolute inset-0 bg-[#ccff00]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <span className={`relative z-10 font-bold ${activeTab === 'login' ? 'text-black' : 'text-[#71717a] hover:text-[#f4f4f5]'}`}>
                    01 // LOGIN
                </span>
            </button>

            {/* SIGNUP BUTTON */}
            <button
                onClick={() => onChange('signup')}
                className="flex-1 relative py-4 text-xs font-mono tracking-widest uppercase transition-colors z-10"
            >
                {activeTab === 'signup' && (
                    <motion.div
                        layoutId="active-tab"
                        className="absolute inset-0 bg-[#ccff00]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <span className={`relative z-10 font-bold ${activeTab === 'signup' ? 'text-black' : 'text-[#71717a] hover:text-[#f4f4f5]'}`}>
                    02 // REGISTER
                </span>
            </button>
        </div>
    );
};
