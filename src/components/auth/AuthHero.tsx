import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { CheckSquare, Activity, ShieldCheck, Clock } from 'lucide-react';

export const AuthHero: React.FC = () => {
    const controls = useAnimation();

    // Animation for the scanning line
    useEffect(() => {
        controls.start({
            top: ['0%', '100%'],
            transition: { duration: 8, ease: "linear", repeat: Infinity }
        });
    }, [controls]);

    return (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#09090b] border-r border-[#27272a]">
            {/* Dynamic Grid Background */}
            <div className="absolute inset-0 industrial-grid opacity-50" />

            {/* Scanning Line Effect */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={controls}
                    className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ccff00] to-transparent opacity-30 shadow-[0_0_15px_rgba(204,255,0,0.5)]"
                />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-20 text-[#f4f4f5]">
                <div>
                    <div className="inline-flex items-center gap-2 border border-[#27272a] px-3 py-1 bg-[#18181b] mb-12">
                        <div className="w-2 h-2 bg-[#ccff00]"></div>
                        <span className="font-mono text-xs tracking-wider uppercase text-[#a1a1aa]">System v1.3.0</span>
                    </div>

                    <h1 className="text-6xl font-bold leading-[0.9] tracking-tighter mb-8">
                        ORDER<br />
                        FROM<br />
                        <span className="text-[#ccff00]">CHAOS</span>
                    </h1>

                    <p className="text-xl font-light text-[#a1a1aa] max-w-md font-mono border-l-2 border-[#27272a] pl-6 leading-relaxed">
            /* The definitive tool for high-performance priority management. Executing Eisenhower Matrix protocols. */
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-px bg-[#27272a] border border-[#27272a]">
                    {[
                        { title: "PRIORITY", icon: CheckSquare, val: "01" },
                        { title: "VELOCITY", icon: Activity, val: "02" },
                        { title: "SECURITY", icon: ShieldCheck, val: "03" },
                        { title: "UPTIME", icon: Clock, val: "99%" }
                    ].map((item) => (
                        <div key={item.title} className="bg-[#09090b] p-6 hover:bg-[#18181b] transition-colors group cursor-default">
                            <div className="flex justify-between items-start mb-4">
                                <item.icon className="w-5 h-5 text-[#a1a1aa] group-hover:text-[#ccff00] transition-colors" />
                                <span className="font-mono text-xs text-[#52525b]">{item.val}</span>
                            </div>
                            <h3 className="font-bold tracking-tight text-sm text-[#f4f4f5]">{item.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
