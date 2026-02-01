import React from 'react';
import { motion } from 'framer-motion';

interface AuthTabsProps {
    activeTab: 'login' | 'signup';
    onChange: (tab: 'login' | 'signup') => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onChange }) => {
    return (
        <div className="relative flex p-1 bg-muted/30 rounded-xl mb-8 border border-border/40 backdrop-blur-sm">
            {/* Sliding Background */}
            <motion.div
                className="absolute top-1 bottom-1 bg-background shadow-sm rounded-lg z-0"
                initial={false}
                animate={{
                    left: activeTab === 'login' ? '4px' : '50%',
                    width: 'calc(50% - 4px)',
                    x: activeTab === 'signup' ? '0px' : '0px'
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />

            <button
                onClick={() => onChange('login')}
                className={`flex-1 relative z-10 py-3 text-sm font-medium transition-colors duration-200 rounded-lg ${activeTab === 'login' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
                    }`}
                data-testid="tab-login"
            >
                Entrar
            </button>

            <button
                onClick={() => onChange('signup')}
                className={`flex-1 relative z-10 py-3 text-sm font-medium transition-colors duration-200 rounded-lg ${activeTab === 'signup' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
                    }`}
                data-testid="tab-signup"
            >
                Cadastrar
            </button>
        </div>
    );
};
