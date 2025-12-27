import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    header?: ReactNode;
    footer?: ReactNode;
    hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    header,
    footer,
    hoverable = false,
}) => {
    return (
        <div className={`card ${hoverable ? 'hover:shadow-2xl cursor-pointer' : ''} ${className}`}>
            {header && (
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    {header}
                </div>
            )}

            <div className="p-6">
                {children}
            </div>

            {footer && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
                    {footer}
                </div>
            )}
        </div>
    );
};
