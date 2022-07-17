module.exports = {
  env: {
    es2021: true,
    mocha: true,
    node: true,
  },
  extends: ["standard", "plugin:prettier/recommended", "plugin:node/recommended"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "node/no-unsupported-features/node-builtins": "off",
    "node/no-unpublished-import": "off",
    "node/no-missing-import": "off",
    "node/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],
  },
};
