module.exports = {
  env: {
    es6: true,
    es2017: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "project": "tsconfig.json",
    "tsconfigRootDir": "."
  },
  plugins: [
    "@typescript-eslint",
    "promise",
    "optimize-regex"
  ],
  ignorePatterns: ["/*.*"],
  rules: {
		"no-shadow": ["warn", { "builtinGlobals": true }],
		"no-duplicate-imports": ["warn", { "includeExports": true }],
		"no-template-curly-in-string": "warn",
		"block-scoped-var": "warn",
		"curly": ["warn", "all"],
		"eqeqeq": "warn",
		"max-classes-per-file": ["warn", 1],
		"no-else-return": ["warn", { "allowElseIf": false }],
		"no-implicit-coercion": "warn",
		"no-labels": "warn",
		"no-lone-blocks": "warn",
		"no-multi-spaces": "warn",
		"no-new": "warn",
		"no-new-func": "warn",
		"no-new-wrappers": "warn",
		"no-return-await": "warn",
		"no-self-compare": "warn",
		"no-sequences": "warn", 
		"no-throw-literal": "warn", 
		"no-unused-expressions": "warn", 
		"no-useless-call": "warn", 
		"no-useless-concat": "warn", 
		"no-useless-return": "warn", 
		"prefer-promise-reject-errors": "warn", 
		"radix": "warn", 
		"no-undefined": "warn", 
		"array-bracket-newline": ["warn", { "multiline": true }], 
		"comma-dangle": ["warn", "always-multiline"], 
		"comma-style": "warn", 
		"eol-last": "warn", 
		"key-spacing": "warn", 
		"keyword-spacing": "warn", 
		"new-parens": "warn", 
		"no-bitwise": "warn", 
		"no-lonely-if": "warn", 
		"no-multiple-empty-lines": "warn", 
		"no-nested-ternary": "warn", 
		"no-new-object": "warn", 
		"no-tabs": ["warn", { "allowIndentationTabs": true }], 
		"no-trailing-spaces": ["warn", { "ignoreComments": true }], 
		"no-unneeded-ternary": "warn", 
		"no-whitespace-before-property": "warn", 
		"object-curly-newline": "warn", 
		"object-curly-spacing": ["warn", "always"], 
		"semi-spacing": "warn", 
		"space-before-blocks": "warn", 
		"space-before-function-paren": [
			"warn",
			{
				"anonymous": "always",
				"named": "never",
				"asyncArrow": "always"
			}
		], 
		"space-in-parens": "warn",
		"space-infix-ops": "warn",
		"space-unary-ops": "warn",
		"spaced-comment": ["warn", "always"],
		"switch-colon-spacing": "warn",
		"arrow-body-style": ["warn", "as-needed"],
		"arrow-parens": ["warn", "as-needed"],
		"arrow-spacing": "warn",
		"generator-star-spacing": ["warn", "after"],
		"no-confusing-arrow": "warn",
		"no-useless-computed-key": "warn",
		"no-useless-rename": "warn",
		"object-shorthand": ["warn", "always"],
		"prefer-arrow-callback": "warn",
		"prefer-destructuring": "warn",
		"rest-spread-spacing": ["warn", "never"],
		"sort-imports": "warn",
		"template-curly-spacing": "warn",
    
    "promise/prefer-await-to-then": "off",
    "promise/always-return": "off",
    "promise/no-return-wrap": "warn",
    "promise/param-names": "warn",
    "promise/catch-or-return": "warn",
    "promise/no-native": "off",
    "promise/no-nesting": "warn",
    "promise/no-promise-in-callback": "warn",
    "promise/no-callback-in-promise": "warn",
    //"promise/avoid-new": "warn",
    "promise/no-new-statics": "warn",
    "promise/no-return-in-finally": "warn",
    "promise/valid-params": "warn",
		//"promise/prefer-await-to-callbacks": "warn",
    "optimize-regex/optimize-regex": "warn",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
		"@typescript-eslint/no-extra-parens": ["warn"],
		"@typescript-eslint/semi": ["warn", "always"],
		"@typescript-eslint/member-delimiter-style": ["warn", { "multiline": { "delimiter": "none" } }],
		"@typescript-eslint/member-ordering": "warn",
		/*"@typescript-eslint/no-magic-numbers": [
			"warn",
			{
				"ignoreNumericLiteralTypes": true,
				"ignoreEnums": true,
				"enforceConst": true,
				"ignoreReadonlyClassProperties": true,
				"ignore": [0, 24, 60, 1000]
			}
		],*/
		"@typescript-eslint/brace-style": ["warn", "1tbs"],
		"@typescript-eslint/indent": ["warn", 2],
		"@typescript-eslint/quotes": ["warn", "single", { "avoidEscape": true }],
		"@typescript-eslint/func-call-spacing": ["warn", "never"],
		"@typescript-eslint/no-useless-constructor": "warn",
		"@typescript-eslint/prefer-for-of": "warn",
		"@typescript-eslint/no-parameter-properties": "warn",
		"@typescript-eslint/no-unnecessary-type-arguments": "warn",
		"@typescript-eslint/prefer-function-type": "warn",
		"@typescript-eslint/prefer-readonly": "warn",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/explicit-function-return-type": ["warn", { "allowExpressions": true }],
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_$" }]
  },
  settings: {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true 
      },
      "typescript": {
        "project": "./tsconfig.json"
      }
    }
  }  
}