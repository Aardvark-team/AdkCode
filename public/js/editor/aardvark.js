function getAdkConfiguration() {
  return {
    comments: {
      lineComment: '//',
      blockComment: ['//', '\\\\']
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '[', close: ']' },
      { open: '{', close: '}' },
      { open: '(', close: ')' },
      { open: "'", close: "'", notIn: ['string', 'comment'] },
      { open: '"', close: '"', notIn: ['string'] }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
  }
}

function getAdkLanguage() {
  return {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',
    tokenPostfix: '.adk',

    keywords: [
      'break', 'class', 'continue',
      'do', 'else',
      'extending', 'false', 'for', 'as', 'funct',
      'if',
      'return', 'match', 'this', 'true',
      'null', 'while',
      'async', 'await',
      "and", "xor", "or", "static", "private", "getter", "in", "not", "case", "delete", "try", "catch"
    ],

    typeKeywords: [
      'any', 'boolean', 'number', 'object', 'string', 'null'
    ],

    operators: [
      '>', '<', '<=', '>=', '==', '!=', '=>', '+', '-', '**',
      '*', '/', '%', '++', '--', '<<', '</', '>>', '>>>', '&',
      '|', 'x|', '!', '&&', '||', '=', '+=', '-=',
      '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=',
      'x|=', '@'
    ],

    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    octaldigits: /[0-7]+(_+[0-7]+)*/,
    binarydigits: /[0-1]+(_+[0-1]+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

    regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
    regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

    // The main tokenizer for our languages
    tokenizer: {
      root: [
        [/[{}]/, 'delimiter.bracket'],

        // For function calls
        [
          /(if) +/,
          {
            token: 'keyword'
          }
        ],
        [/\~?[a-zA-Z_$][\w\d$]* *\(/, { token: 'callFunction', next: '@callFunction' }],
        { include: 'common' },
        { include: 'bracketDelims' },

        // include directive
        [/^\s*#\s*include/, { token: 'keyword.directive.include', next: '@include' }],

        // other directives
        [/^\s*#\s*\w+/, 'keyword.directive'],
      ],

      common: [
        // identifiers and keywords
        [/[a-z_$][\w$]*/, {
          cases: {
            '@typeKeywords': 'keyword',
            '@keywords': 'keyword',
            '@default': 'identifier'
          }
        }],
        [/[a-z_$][\w$]*/, {
          cases: {
            '@typeKeywords': 'keyword',
            '@keywords': 'keyword',
          }
        }],
        [/[A-Z][\w\$]*/, 'type.identifier'],  // to show class names nicely
        // [/[A-Z][\w\$]*/, 'identifier'],

        // whitespace
        { include: '@whitespace' },

        // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
        [/\/(?=([^\\\/]|\\.)+\/([gimsuy]*)(\s*)(\.|;|\/|,|\)|\]|\}|$))/, { token: 'regexp', bracket: '@open', next: '@regexp' }],

        // delimiters and operators
        // [/[()\[\]]/, '@brackets'],
        // [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],

        // numbers
        [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
        [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
        [/0[xX](@hexdigits)/, 'number.hex'],
        [/0[oO]?(@octaldigits)/, 'number.octal'],
        [/0[bB](@binarydigits)/, 'number.binary'],
        [/(@digits)/, 'number'],

        // delimiter: after number because of .\d floats
        [/[;,.:]/, 'delimiter'],

        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
        [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/`/, 'string', '@string_backtick'],
      ],

      bracketDelims: [
        [/[()\[\]]/, '@brackets']
      ],

      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/\/\/$/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],

      comment: [
        [/[^\\\\]+/, 'comment'],
        [/\\\\/, 'comment', '@pop'],
        [/[\/\/]/, 'comment']
      ],

      doc: [
        [/[^\/*]+/, 'comment.doc'],
        [/\*\//, 'comment.doc', '@pop'],
        [/[\/*]/, 'comment.doc']
      ],

      // We match regular expression quite precisely
      regexp: [
        [/(\{)(\d+(?:,\d*)?)(\})/, ['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control']],
        [/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, ['regexp.escape.control', { token: 'regexp.escape.control', next: '@regexrange' }]],
        [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
        [/[()]/, 'regexp.escape.control'],
        [/@regexpctl/, 'regexp.escape.control'],
        [/[^\\\/]/, 'regexp'],
        [/@regexpesc/, 'regexp.escape'],
        [/\\\./, 'regexp.invalid'],
        [/(\/)([gimsuy]*)/, [{ token: 'regexp', bracket: '@close', next: '@pop' }, 'keyword.other']],
      ],

      regexrange: [
        [/-/, 'regexp.escape.control'],
        [/\^/, 'regexp.invalid'],
        [/@regexpesc/, 'regexp.escape'],
        [/[^\]]/, 'regexp'],
        [/\]/, { token: 'regexp.escape.control', next: '@pop', bracket: '@close' }],
      ],

      string_double: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop']
      ],

      string_single: [
        [/[^\\']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop']
      ],

      string_backtick: [
        [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
        [/[^\\`$]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/`/, 'string', '@pop']
      ],

      bracketCounting: [
        [/\{/, 'delimiter.bracket', '@bracketCounting'],
        [/\}/, 'delimiter.bracket', '@pop'],
        { include: 'bracketDelims' },
        { include: 'common' },
      ],

      nestedBrackets: [
        [/\~?[a-zA-Z_$][\w\d$]* *\(/, { token: 'callFunction', next: '@callFunction' }],
        { include: "common" },
        [
          /(\()/,
          [
            { token: '@brackets', next: "@nestedBrackets" },
          ]
        ],
        [
          /(\))/,
          [
            { token: "@brackets", next: "@pop" }
          ]
        ]
      ],

      callFunction: [
        [/\~?[a-zA-Z_$][\w\d$]* *\(/, { token: 'callFunction', next: '@callFunction' }],
        { include: "common" },
        [
          /(\))/,
          [
            { token: "callFunction", next: "@pop" }
          ]
        ],
        [
          /(\()/,
          [
            { token: '@brackets', next: "@nestedBrackets" },
          ]
        ],
      ],

      include: [
        [
          /(\s*)(.+)(\s+)(as)(\s+)(.+)/,
          [
            '',
            'string',
            '',
            'keyword',
            '',
            { token: 'identifier', next: "@pop" }
          ]
        ],

        [
          /(\s*)(.+)/,
          [
            '',
            { token: 'identifier', next: "@pop" }
          ]
        ]
      ]
    }
  }
}


// {
//   tokenizer: {
//       root: [
//           [/\bfunct\b/, 'declaration'],
//           [/\bclass\b/, 'declaration'],
//           [/\/\/[a-zA-Z ]*[\n]*[\\][\\]/, 'comment'],
//           [/\/\/ [a-zA-Z ]*/, 'comment'],
//           [/[a-zA-Z]*\(/, 'callFunction'],
//           [/\)/, 'callFunction'],
//           [/[0-9]/, 'float'],
//           [/["][^"]*["]/, 'string'],
//           [/['][^']*[']/, 'string'],
//           [/#include/, 'logic'],
//           [/#jump/, 'logic'],
//           [/#define/, 'logic'],
//           [/\bif\b/, 'logic'],
//           [/\belse\b/, 'logic'],
//           [/\bwhile\b/, 'logic'],
//           [/\bfor\b/, 'logic'],
//           [/\bin\b/, 'logic'],
//           [/[+-=*\/%\^]/, 'logic'],
//           [/\btrue\b/, 'logic'],
//           [/\bfalse\b/, 'logic'],
//           [/\btry\b/, 'logic'],
//           [/\bcatch\b/, 'logic'],
//           [/#max-memory/, 'logic'],
//           [/\bas\b/, 'logic']
//       ]
//   }
// }

function loadAardvark() {
  // Register a new language
  monaco.languages.register({ id: 'Aardvark' });
  monaco.languages.setLanguageConfiguration("Aardvark", getAdkConfiguration());

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('Aardvark', getAdkLanguage());

  // Define a new theme that contains only rules that match this language
  monaco.editor.defineTheme('monokaiAardvark', {//here
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'declaration', foreground: '66D9EF', fontStyle: 'bold' },
      { token: 'comment', foreground: '797979', fontStyle: 'italic' },
      { token: 'callFunction', foreground: 'efe18a', fontStyle: 'bold' },
      { token: 'number.float', foreground: 'AE81FF' },
      { token: 'string', foreground: 'efaa92' },
      { token: 'keyword', foreground: '006aff' },
      { token: 'operator', foreground: 'F92672' }
    ],
    //This is the official VS themes: 
    "colors": {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#d4d4d4",
      "editorIndentGuide.background": "#404040",
      "editorRuler.foreground": "#333333",
      "activityBarBadge.background": "#007acc",
      "sideBarTitle.foreground": "#bbbbbb"
    },
  "tokenColors": "./Diner.tmTheme"/*
    colors: {
      'editor.foreground': '#f8f8f2',
      'editor.background': '#262626',
      "editor.background": "#1e1e1e",
      "editor.foreground": "#d4d4d4",
      'editorLineNumber.foreground': '#d6d6d6',
      'editorActiveLineNumber.foreground': '#d6d6d6',
      "editorIndentGuide.background": "#404040",
    }*/
  });
  monaco.editor.defineTheme('theme2', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'declaration', foreground: '66D9EF', fontStyle: 'bold' },
      { token: 'comment', foreground: '797979', fontStyle: 'italic' },
      { token: 'callFunction', foreground: 'efe18a', fontStyle: 'bold'},
      { token: 'number.float', foreground: 'AE81FF' },
      { token: 'string', foreground: 'efaa92' },
      { token: 'keyword', foreground: '006aff' },
      { token: 'keyword.directive', foreground: 'fa6aff' },
      { token: 'keyword.directive.include.adk', foreground: 'fa6aff' },
      { token: 'operator', foreground: 'F92672' }
    ],
    //"tokenColors": "./Diner.tmTheme",
    colors: { //not working
      'editor.foreground': '#f8f8f2', 
      'editor.background': '#262626',
      "editor.foreground": "#d4d4d4",
      'editorLineNumber.foreground': '#d6d6d6',
      'editorActiveLineNumber.foreground': '#d6d6d6',
      "editorIndentGuide.background": "#404040",
    }
  });
  // Register a completion item provider for the new language
  monaco.languages.registerCompletionItemProvider('Aardvark', {
    provideCompletionItems: () => {
      var suggestions = [
        {
          label: 'funct',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: ['funct ${1:name}(${2:parameters}) {', '\t$0', '}'].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'class',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: ['class ${1:name}(${2:parent}) {', '\t$0', '}'].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'ifelse',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: ['if ${1:condition} {', '\t$0', '} else {', '\t', '}'].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If-Else Statement'
        },
        {
          label: "if",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: ['if ${1:condition} {', '\t$0', '}'].join("\n"),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "If Statement"
        },
        {
          label: 'include',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: ['#include ${0:module} as ${0:module}'].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'jump',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: ['#jump ${0:line}'].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'define',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: ['#define ${0:name} as ${1:keyword}'].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },

      ];
      return { suggestions: suggestions };
    }
  });
}

function getAdkExampleCode1() {
  return [
    "output(\"Hello World!\")"
  ].join("\n");
}

function getAdkExampleCode2() {
  return [
    "#include os as os",
    "class Hello() {",
    '   funct helloWorld() {',
    "       output('helloWorld')",
    "       i = 0",
    "       if i == 0 {",
    "           output('i is 0!')",
    "       }",
    "   }",
    "}"
  ].join('\n');
}
function getAdkExampleCode3() {
  return [
    "class Test() {",
    '   ~init {',
    "       this.x = 0",
    "       this.y = 0",
    "       this.z = 0",
    "   }",
    "   funct moveX(amt) {",
    "       this.x += amt",
    "   }",
    "}"
  ].join('\n');
}