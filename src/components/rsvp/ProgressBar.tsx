import React from 'react';

interface ProgressBarProps {
    progress: number;
}

export const ProgressBar = React.memo(function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
                className="h-full bg-accent transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </div>
    );
});
