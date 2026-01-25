/// <reference types="nativewind/types" />

// Fix for "nativewind/jsx-runtime" module not found error in Next.js
declare module "nativewind/jsx-runtime" {
    export * from "react/jsx-runtime";
}
