'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    hover?: boolean;
}

export function AnimatedCard({
    children,
    className = '',
    delay = 0,
    hover = true
}: AnimatedCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay,
                ease: 'easeOut'
            }}
            whileHover={hover ? {
                y: -4,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.2 }
            } : undefined}
            className={className}
        >
            {children}
        </motion.div>
    );
}
