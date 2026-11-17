import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // French prose is full of raw apostrophes (l'amour, j'écris…)
      "react/no-unescaped-entities": "off",
      // Loading saved progress from localStorage must hydrate state on mount
      "react-hooks/set-state-in-effect": "off",
      // Background art uses Math.random / Date intentionally in memoized setup
      "react-hooks/purity": "off",
      "@next/next/no-page-custom-font": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
