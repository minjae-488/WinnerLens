import React from 'react';

interface ScoreDisplayProps {
    demandScore?: number;
    competitionScore?: number;
    marginScore?: number;
    operabilityScore?: number;
    totalScore?: number;
    showDetails?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
    demandScore = 0,
    competitionScore = 0,
    marginScore = 0,
    operabilityScore = 0,
    totalScore = 0,
    showDetails = true,
}) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-blue-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getScoreTextColor = (score: number) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-blue-600 dark:text-blue-400';
        if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const ScoreBar = ({ label, score, weight }: { label: string; score: number; weight: string }) => (
        <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {score.toFixed(1)} <span className="text-xs text-gray-500">({weight})</span>
                </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full ${getScoreColor(score)} transition-all duration-500`}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Total Score */}
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">종합 점수</div>
                <div className={`text-4xl font-bold ${getScoreTextColor(totalScore)}`}>
                    {totalScore.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500 mt-1">/ 100</div>
            </div>

            {/* Detailed Scores */}
            {showDetails && (
                <div className="space-y-2">
                    <ScoreBar label="수요 점수" score={demandScore} weight="30%" />
                    <ScoreBar label="경쟁 점수" score={competitionScore} weight="25%" />
                    <ScoreBar label="마진 점수" score={marginScore} weight="25%" />
                    <ScoreBar label="운영 가능성" score={operabilityScore} weight="20%" />
                </div>
            )}
        </div>
    );
};
