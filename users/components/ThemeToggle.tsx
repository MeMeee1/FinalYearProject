"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button, ButtonIcon } from "@/components/ui/button"
import { SunIcon, MoonIcon } from "lucide-react-native"
import { Box } from "@/components/ui/box"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Box className="w-10 h-10" />
        )
    }

    return (
        <Button
            variant="link"
            className="p-3 rounded-full bg-secondary hover:bg-muted transition-colors"
            onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <ButtonIcon
                as={theme === "dark" ? SunIcon : MoonIcon}
                className="text-foreground"
            />
        </Button>
    )
}
