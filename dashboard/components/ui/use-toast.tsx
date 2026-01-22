import { useToast as useGluestackToast, Toast, ToastTitle, ToastDescription } from "@gluestack-ui/toast";
import React from "react";
import { View, Text } from "react-native";

// Simple adapter to make Shadcn-style toast calls work with Gluestack Toast
export function useToast() {
    const gluestackToast = useGluestackToast();

    const toast = ({
        title,
        description,
        variant = "default",
    }: {
        title: string;
        description?: string;
        variant?: "default" | "destructive" | "success";
    }) => {
        gluestackToast.show({
            placement: "top",
            render: ({ id }: { id: string }) => {
                // Basic mapping
                const isDestructive = variant === "destructive";

                // Since we are using unstyled primitives generally, or partially styled, we add some basic Tailwind classes
                // Note: We are using Views/Text because Gluestack Toast components might require specific context or config to render styled if not passed through the design system components
                // But let's try using the Gluestack components with classNames if NativeWind is active

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
    };

    return { toast };
}
