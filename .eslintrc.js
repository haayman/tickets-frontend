module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  extends: [
    // Extends
    "standard",
    "plugin:prettier/recommended",
    "@nuxtjs/eslint-config-typescript",
    "plugin:nuxt/recommended",
    "prettier",
  ],

  ignorePatterns: [".nuxt/", "dist/", "node_modules/"],

  rules: {
    "import/order": "error",
    "import/first": "error",
    "import/no-mutable-exports": "error",
    "import/no-unresolved": "off",
    "import/newline-after-import": ["error"],

    // Custom rules
    "no-unused-vars": 1, // 1 = warn
    "no-debugger": 1,
    "vue/multi-word-component-names": "off",
    "vue/no-unused-components": 1,
    "vue/no-unused-vars": 1,
    "vue/no-v-html": 0,
    "vue/no-v-text-v-html-on-component": "off",

    // Allow unused vars if they get followed by a var that is used
    "@typescript-eslint/no-unused-vars": [
      "error",
      { vars: "all", args: "after-used", ignoreRestSiblings: false },
    ],
  },
};
