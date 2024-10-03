import { extendTailwindMerge } from "tailwind-merge";
import { defineConfig } from "cva";

const customTwMerge = extendTailwindMerge({});
export const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: (className) => customTwMerge(className),
  },
});

export type { VariantProps } from "cva";
