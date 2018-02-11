module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            2
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "eqeqeq": "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": [
        "error", "always"
        ],
        "arrow-spacing": [
        "error", { "before": true, "after": true }
        ],
        "linebreak-style": 0, 
        "no-console": 0
    }
};
