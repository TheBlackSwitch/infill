import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/main.ts"],
    format: ["esm", "cjs", "iife"],
    dts: true,
    clean: true,
    globalName: "Infill",
    noExternal: [
        "@theblackswitch/yamp",
        "prismjs",
        "dompurify"
    ]
});