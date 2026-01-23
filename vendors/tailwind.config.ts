const gluestackPlugin = require('@gluestack-ui/nativewind-utils/tailwind-plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{tsx,jsx,ts,js}", "./components/**/*.{tsx,jsx,ts,js}"],
  presets: [require('nativewind/preset')],
  important: "html",

  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(primary|secondary|tertiary|error|success|warning|info|typography|outline|background)-(0|50|100|200|300|400|500|600|700|800|900|950|white|gray|black|error|warning|muted|success|info|light|dark)/,
    },
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          ...Object.fromEntries(
            [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => [
              n,
              `rgb(var(--color-primary-${n})/<alpha-value>)`,
            ])
          ),
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          ...Object.fromEntries(
            [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => [
              n,
              `rgb(var(--color-secondary-${n})/<alpha-value>)`,
            ])
          ),
        },
        tertiary: {
          ...Object.fromEntries(
            [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => [
              n,
              `rgb(var(--color-tertiary-${n})/<alpha-value>)`,
            ])
          ),
        },
        error: {
          ...Object.fromEntries(
            [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => [
              n,
              `rgb(var(--color-error-${n})/<alpha-value>)`,
            ])
          ),
        },
        success: {
          ...Object.fromEntries(
            [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => [
              n,
              `rgb(var(--color-success-${n})/<alpha-value>)`,
            ])
          ),
        },
        warning: {
          ...Object.fromEntries(
            [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => [
              n,
              `rgb(var(--color-warning-${n})/<alpha-value>)`,
            ])
          ),
        },
        info: {
          ...Object.fromEntries(
            [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => [
              n,
              `rgb(var(--color-info-${n})/<alpha-value>)`,
            ])
          ),
        },
        typography: {
          ...Object.fromEntries(
            [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => [
              n,
              `rgb(var(--color-typography-${n})/<alpha-value>)`,
            ])
          ),
          white: '#FFFFFF',
          gray: '#D4D4D4',
          black: '#181718',
        },
        outline: {
          ...Object.fromEntries(
            [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => [
              n,
              `rgb(var(--color-outline-${n})/<alpha-value>)`,
            ])
          ),
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          ...Object.fromEntries(
            [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => [
              n,
              `rgb(var(--color-background-${n})/<alpha-value>)`,
            ])
          ),
          error: 'rgb(var(--color-background-error)/<alpha-value>)',
          warning: 'rgb(var(--color-background-warning)/<alpha-value>)',
          muted: 'rgb(var(--color-background-muted)/<alpha-value>)',
          success: 'rgb(var(--color-background-success)/<alpha-value>)',
          info: 'rgb(var(--color-background-info)/<alpha-value>)',
          light: '#FBFBFB',
          dark: '#181719',
        },
        indicator: {
          primary: 'rgb(var(--color-indicator-primary)/<alpha-value>)',
          info: 'rgb(var(--color-indicator-info)/<alpha-value>)',
          error: 'rgb(var(--color-indicator-error)/<alpha-value>)',
        },
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        heading: undefined,
        body: undefined,
        mono: undefined,
        roboto: ['Roboto', 'sans-serif'],
      },
      fontWeight: {
        extrablack: '950',
      },
      fontSize: {
        '2xs': '10px',
      },
      boxShadow: {
        'hard-1': '-2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-2': '0px 3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-3': '2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-4': '0px -3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-5': '0px 2px 10px 0px rgba(38, 38, 38, 0.10)',
        'soft-1': '0px 0px 10px rgba(38, 38, 38, 0.1)',
        'soft-2': '0px 0px 20px rgba(38, 38, 38, 0.2)',
        'soft-3': '0px 0px 30px rgba(38, 38, 38, 0.1)',
        'soft-4': '0px 0px 40px rgba(38, 38, 38, 0.1)',
      },
    },
  },

  plugins: [gluestackPlugin]
};
