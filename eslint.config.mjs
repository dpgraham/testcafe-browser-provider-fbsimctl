import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import mocha from "eslint-plugin-mocha";

export default [
    {
        files: ["src/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            ...prettier.rules,
            ...js.configs.recommended.rules,
        },
    },
    {
        files: ["test/**/*.js"],
        plugins: {
            mocha,
        },
        rules: {
            ...mocha.configs.recommended.rules,
            "mocha/no-exclusive-tests": "error",
            "mocha/no-skipped-tests": "warn",
        },
    },
    {
        languageOptions: {
            globals: {
                __dirname: true,
                console: true,
                exports: true,
                module: true,
                require: true,
            },
        },
    },
];
