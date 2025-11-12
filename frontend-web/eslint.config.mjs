import js from "@eslint/js";
import tseslint from "typescript-eslint";


const eslintConfig = [{
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
},
js.configs.recommended,
    ...tseslint.configs.recommended,

    {
  rules: {
    "quotes": ["error", "double"],
      "@typescript-eslint/no-unused-vars": "warn",
      "no-empty": "warn",
  }
}];

export default eslintConfig;
