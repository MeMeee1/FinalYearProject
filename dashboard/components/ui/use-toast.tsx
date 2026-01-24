'use client';
import * as ToastModule from "@gluestack-ui/toast";
import React from "react";
import { View } from "react-native";

// Safe exports from the package
const {
    useToast: useGluestackToast,
    Toast = ({ children, ...props }: any) => <View {...props}>{children}</View>,
    ToastTitle = ({ children, ...props }: any) => <View {...props}>{children}</View>,
    ToastDescription = ({ children, ...props }: any) => <View {...props}>{children}</View>
} = ToastModule as any;

// Simple adapter to make Shadcn-style toast calls work with Gluestack Toast
export function useToast() {
    const gluestackToast = typeof useGluestackToast === 'function' ? useGluestackToast() : null;

    const toast = ({
        title,
        description,
        variant = "default",
    }: {
        title: string;
        description?: string;
        variant?: "default" | "destructive" | "success";
    }) => {
        if (gluestackToast) {
            gluestackToast.show({
                placement: "top",
                render: ({ id }: { id: string }) => {
                    // Basic mapping
                    const isDestructive = variant === "destructive";

                    return (
                        <Toast nativeID={id} action={isDestructive ? "error" : "info"} variant="solid" className="bg-white dark:bg-black p-4 rounded-md shadow-md border border-gray-200 dark:border-gray-800 min-w-[300px]">
                            <View className="flex-col gap-1">
                                <ToastTitle className={`${isDestructive ? "text-red-500" : "text-black dark:text-white"} font-semibold`}>
                                    {title}
                                </ToastTitle>
                                {description && (
                                    <ToastDescription className="text-gray-500 dark:text-gray-400 text-sm">
                                        {description}
                                    </ToastDescription>
                                )}
                            </View>
                        </Toast>
                    );
                },
            });
        } else {
            console.warn("Toast hook not available:", title, description);
        }
    };

    return { toast };
}
