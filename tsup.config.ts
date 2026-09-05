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
        minify: false,
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
        minify: false,
        outDir: "dist/esm"
    },
    {
        entry: ["src/main.ts"],
        format: "cjs",
        outDir: "dist/node",
        dts: true,
        minify: false
    },
]);