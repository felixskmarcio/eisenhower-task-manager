import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TrueFocusProps {
    sentence?: string;
    manualMode?: boolean;
    blurAmount?: number;
    borderColor?: string;
    glowColor?: string;
    animationDuration?: number;
    pauseBetweenAnimations?: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
    sentence = "Marcio Felix",
    manualMode = false,
    blurAmount = 5,
    borderColor = "#ccff00",
    glowColor = "rgba(204, 255, 0, 0.6)",
    animationDuration = 0.5,
    pauseBetweenAnimations = 1,
}) => {
    const words = sentence.split(" ");
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

    useEffect(() => {
        if (manualMode) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
        }, (animationDuration + pauseBetweenAnimations) * 1000);

        return () => clearInterval(interval);
    }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

    useEffect(() => {
        if (currentIndex === null || words.length === 0) return;

        const activeWord = wordRefs.current[currentIndex];
        if (activeWord && containerRef.current) {
            const parentRect = containerRef.current.getBoundingClientRect();
            const wordRect = activeWord.getBoundingClientRect();

            setFocusRect({
                x: wordRect.left - parentRect.left,
                y: wordRect.top - parentRect.top,
                width: wordRect.width,
                height: wordRect.height,
            });
        }
    }, [currentIndex, words.length]);

    return (
        <div
            ref={containerRef}
            className="relative flex gap-2 items-center justify-center cursor-pointer group py-2 px-4"
        >
            {words.map((word, index) => {
                const isActive = index === currentIndex;
                return (
                    <motion.span
                        key={index}
                        ref={(el) => (wordRefs.current[index] = el)}
                        className="relative font-black text-2xl tracking-tighter z-10 select-none font-display uppercase"
                        initial={{ filter: "blur(0px)", opacity: 1, color: "#ffffff" }}
                        animate={{
                            filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
                            opacity: isActive ? 1 : 0.6,
                            color: isActive ? "#ffffff" : "#71717a",
                        }}
                        transition={{
                            duration: animationDuration,
                            ease: "easeInOut",
                        }}
                    >
                        {word}
                    </motion.span>
                );
            })}

            <motion.div
                className="absolute pointer-events-none"
                animate={{
                    x: focusRect.x,
                    y: focusRect.y,
                    width: focusRect.width,
                    height: focusRect.height,
                    opacity: 1,
                }}
                transition={{
                    duration: animationDuration,
                    ease: "easeInOut",
                }}
                style={{
                    zIndex: 0,
                }}
            >
                {/* Glow effect */}
                <div
                    className="absolute -inset-2 rounded-lg opacity-30 blur-md transition-all duration-500"
                    style={{
                        backgroundColor: glowColor,
                    }}
                />

                {/* Border corners */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 rounded-tl-sm" style={{ borderColor }} />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 rounded-tr-sm" style={{ borderColor }} />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 rounded-bl-sm" style={{ borderColor }} />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 rounded-br-sm" style={{ borderColor }} />
            </motion.div>
        </div>
    );
};

export default TrueFocus;
