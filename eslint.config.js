module.exports = {
    root: true,

    env: {
        browser: true,
        es6: true,
        node: true,
    },
    parser: ["vue"],

    extends: ["@imagem/eslint-config/nuxt"],

    rules: {
        "vue/custom-event-name-casing": ["warn", { ignores: ["globalMessage"] }],
        "vue/no-mutating-props": 1,
        "vue/valid-v-slot": ["error", { allowModifiers: true }],
    },
};