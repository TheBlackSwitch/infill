import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["src/main.ts"],
        format: "iife",
        globalName: "Infill",
        noExternal: [
            "@theblackswitch/yamp",
            "prismjs",
            "dompurify"
        ],
        minify: true,
        outDir: "dist/script"
    },
    {
        entry: ["src/main.ts"],
        format: "esm",
        noExternal: [
            "@theblackswitch/yamp",
            "prismjs",
            "dompurify"
        ],
        minify: true,
        outDir: "dist/esm"
    },
    {
        entry: ["src/main.ts"],
        format: "cjs",
        bundle: false,
        outDir: "dist/node",
        dts: true
    },
]);