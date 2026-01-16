import React, { createContext, useContext } from 'react';
import { View, ViewProps } from 'react-native';
import { progressStyle, progressFilledTrackStyle } from './styles';

const ProgressContext = createContext<{ value: number }>({ value: 0 });

type IProgressProps = ViewProps & {
    value?: number;
    className?: string;
};

export const Progress = React.forwardRef<React.ElementRef<typeof View>, IProgressProps>(
    ({ className, value = 0, children, ...props }, ref) => {
        return (
            <ProgressContext.Provider value={{ value }}>
                <View
                    ref={ref}
                    className={progressStyle({ class: className })}
                    {...props}
                >
                    {children}
                </View>
            </ProgressContext.Provider>
        );
    }
);

type IProgressFilledTrackProps = ViewProps & {
    className?: string;
};

export const ProgressFilledTrack = React.forwardRef<React.ElementRef<typeof View>, IProgressFilledTrackProps>(
    ({ className, ...props }, ref) => {
        const { value } = useContext(ProgressContext);
        return (
            <View
                ref={ref}
                className={progressFilledTrackStyle({ class: className })}
                style={{ width: `${value}%` }}
                {...props}
            />
        );
    }
);

Progress.displayName = 'Progress';
ProgressFilledTrack.displayName = 'ProgressFilledTrack';
