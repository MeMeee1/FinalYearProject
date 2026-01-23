"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <GluestackThemeWrapper>{children}</GluestackThemeWrapper>
        </NextThemesProvider>
    );
}

function GluestackThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme, resolvedTheme } = useNextTheme();
    const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">("light");

    React.useEffect(() => {
        const effectiveTheme = (resolvedTheme || theme) === "dark" ? "dark" : "light";
        setCurrentTheme(effectiveTheme);
    }, [theme, resolvedTheme]);

    return (
        <GluestackUIProvider mode={currentTheme}>
            {children}
        </GluestackUIProvider>
    );
}
