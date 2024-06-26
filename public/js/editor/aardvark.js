function getAdkConfiguration() {
  return {
    comments: {
      lineComment: '#',
      blockComment: ['#*', '*#']
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [{
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    },
    {
      open: '(',
      close: ')'
    },
    {
      open: "'",
      close: "'",
      notIn: ['string', 'comment']
    },
    {
      open: '"',
      close: '"',
      notIn: ['string']
    },
    {
      open: '`',
      close: '`',
      notIn: ['string']
    }
    ],
    surroundingPairs: [{
      open: '{',
      close: '}'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '(',
      close: ')'
    },
    {
      open: '"',
      close: '"'
    },
    {
      open: "'",
      close: "'"
    },
    {
      open: '`',
      close: '`'
    }
    ],
  }
}

function getAdkLanguage() {
  return {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',
    tokenPostfix: '.adk',

    keywords: [
      'class',
      'extends',
      // 'type',
      'extending',
      'function',
      'for',
      'while',
      'match',
      'case',
      'if',
      'else',
      'return',
      'static',
      'include',
      'await',
      'pause-until',
      'yield',
      'let',
      'as',
      'from',
      'defer',
      "layout",
      "break",
      "continue",
      "private",
      "set",
      "get",
      "macro"
    ],

    typeKeywords: [
      'Boolean', 'Number', 'Object', 'String', 'Array', 'null', 'true', 'false', 'any', 'Integer', 'BitArray'
    ],

    operators: [
      '>', '<', '<=', '>=', '==', '!=', '=>', '+', '-', '**',
      '*', '/', '%', '++', '--', '&',
      '|', 'x|', '!', '&&', '||', '=', '+=', '-=', '^',
      '*=', '^=', '/=', '%=', '&=', '|=',
      'x|=', '@', '@='
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
        [/[a-zA-Z_$][\w$]*\s*\(/, {
          token: 'callFunction',
          next: '@callFunction'
        }],
        [/\$[a-zA-Z_$][\w$]*\s*\(?/, {
          token: 'callFunction.special',
          next: '@callFunction'
        }],
        {
          include: 'common'
        },
        {
          include: 'bracketDelims'
        },

        // include directive
        [/^\s*include/, {
          token: 'keyword.directive.include',
          next: '@include'
        }],
      ],

      common: [
        // identifiers and keywords
        [/[a-z_$][\w$]*/, {
          cases: {
            '@typeKeywords': 'keyword.type',
            '@keywords': 'keyword',
            '@default': 'identifier'
          }
        }],
        [/[a-z_$][\w$]*/, {
          cases: {
            '@typeKeywords': 'keyword.type',
            '@keywords': 'keyword',
          }
        }],
        [/[A-Z][\w\$]*/, 'type.identifier'], // to show class names nicely
        // [/[A-Z][\w\$]*/, 'identifier'],

        // whitespace
        {
          include: '@whitespace'
        },

        // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
        [/\/(?=([^\\\/]|\\.)+\/([gimsuy]*)(\s*)(\.|;|\/|,|\)|\]|\}|$))/, {
          token: 'regexp',
          bracket: '@open',
          next: '@regexp'
        }],

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
        [/16_(@hexdigits)/, 'number.hex'],
        [/8_(@octaldigits)/, 'number.octal'],
        [/2_(@binarydigits)/, 'number.binary'],
        [/(@digits)/, 'number'],

        // delimiter: after number because of .\d floats
        [/[;,.:]/, 'delimiter'],

        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
        [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/`/, 'string', '@string_backtick'],
        // [/\$"/, 'string', '@template_string_double'],
        // [/\$'/, 'string', '@template_string_single'],
        // [/\$`/, 'string', '@template_string_backtick'],
      ],

      bracketDelims: [
        [/[()\[\]]/, '@brackets']
      ],

      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/#$/, 'comment', '@comment'],
        [/#.*$/, 'comment'],
      ],

      comment: [
        [/[^\\\\]+/, 'comment'],
        [/\\\\/, 'comment', '@pop'],
        [/[#]/, 'comment']
      ],

      doc: [
        [/[^#*]+/, 'comment.doc'],
        [/\*#/, 'comment.doc', '@pop'],
        [/[#*]/, 'comment.doc']
      ],

      // We match regular expression quite precisely
      regexp: [
        [/(\{)(\d+(?:,\d*)?)(\})/, ['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control']],
        [/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, ['regexp.escape.control', {
          token: 'regexp.escape.control',
          next: '@regexrange'
        }]],
        [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
        [/[()]/, 'regexp.escape.control'],
        [/@regexpctl/, 'regexp.escape.control'],
        [/[^\\\/]/, 'regexp'],
        [/@regexpesc/, 'regexp.escape'],
        [/\\\./, 'regexp.invalid'],
        [/(\/)([gimsuy]*)/, [{
          token: 'regexp',
          bracket: '@close',
          next: '@pop'
        }, 'keyword.other']],
      ],

      regexrange: [
        [/-/, 'regexp.escape.control'],
        [/\^/, 'regexp.invalid'],
        [/@regexpesc/, 'regexp.escape'],
        [/[^\]]/, 'regexp'],
        [/\]/, {
          token: 'regexp.escape.control',
          next: '@pop',
          bracket: '@close'
        }], x
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
        [/[^\\`]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/`/, 'string', '@pop']
      ],
      // template_string_double: [
      //   [/\{/, {
      //     token: 'delimiter.bracket',
      //     next: '@bracketCounting'
      //   }],
      //   [/[^\\"$]+/, 'string']
      //   [/@escapes/, 'string.escape'],
      //   [/\\./, 'string.escape.invalid'],
      //   [/"/, 'string', '@pop']
      // ],
      // template_string_single: [
      //   [/\{/, {
      //     token: 'delimiter.bracket',
      //     next: '@bracketCounting'
      //   }],
      //   [/[^\\'$]+/, 'string']
      //   [/@escapes/, 'string.escape'],
      //   [/\\./, 'string.escape.invalid'],
      //   [/'/, 'string', '@pop']
      // ],
      // template_string_backtick: [
      //   [/\{/, {
      //     token: 'delimiter.bracket',
      //     next: '@bracketCounting'
      //   }],
      //   [/[^\\`$]+/, 'string']
      //   [/@escapes/, 'string.escape'],
      //   [/\\./, 'string.escape.invalid'],
      //   [/`/, 'string', '@pop']
      // ],

      bracketCounting: [
        [/\{/, 'delimiter.bracket', '@bracketCounting'],
        [/\}/, 'delimiter.bracket', '@pop'],
        {
          include: 'bracketDelims'
        },
        {
          include: 'common'
        },
      ],

      nestedBrackets: [
        {
          include: "common"
        },
        [
          /(\()/,
          [{
            token: '@brackets',
            next: "@nestedBrackets"
          },]
        ],
        [
          /(\))/,
          [{
            token: "@brackets",
            next: "@pop"
          }]
        ]
      ],

      callFunction: [
        {
          include: "common"
        },
        [
          /(\))/,
          [{
            token: "callFunction",
            next: "@pop"
          }]
        ],
        [
          /(\()/,
          [{
            token: '@brackets',
            next: "@nestedBrackets"
          },]
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
            {
              token: 'identifier',
              next: "@pop"
            }
          ]
        ],

        [
          /(\s*)(.+)/,
          [
            '',
            {
              token: 'identifier',
              next: "@pop"
            }
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
  monaco.languages.register({
    id: 'Aardvark'
  });
  monaco.languages.setLanguageConfiguration("Aardvark", getAdkConfiguration());

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('Aardvark', getAdkLanguage());

  // Define a new theme that contains only rules that match this language
  monaco.editor.defineTheme('monokaiAardvark', { //here
    base: 'vs-dark',
    inherit: true,
    rules: [{
      token: 'declaration',
      foreground: '66D9EF',
      fontStyle: 'bold'
    },
    {
      token: 'comment',
      foreground: '797979',
      fontStyle: 'italic'
    },
    {
      token: 'callFunction',
      foreground: 'efe18a',
      fontStyle: 'bold'
    },
    {
      token: 'number.float',
      foreground: 'AE81FF'
    },
    {
      token: 'number',
      foreground: 'b5cea8'
    },
    {
      token: 'string',
      foreground: 'efaa92'
    },
    {
      token: 'keyword',
      foreground: '006aff'
    },
    {
      token: 'operator',
      foreground: 'F92672'
    },
    ],
    //This is the official VS themes: 
    colors: {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#d5d5d5",
      "editorIndentGuide.background": "#404040",
      "editorRuler.foreground": "#333333",
      "activityBarBadge.background": "#007acc",
      "sideBarTitle.foreground": "#bbbbbb"
    },
    "tokenColors": "./Diner.tmTheme"
    /*
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
    rules: [{
      token: 'declaration',
      foreground: '66D9EF',
      fontStyle: 'bold'
    },
    {
      token: 'comment',
      foreground: '797979',
      fontStyle: 'italic'
    },
    {
      token: 'callFunction',
      foreground: 'efe18a',
      fontStyle: 'bold'
    },
    {
      token: 'number.float',
      foreground: 'AE81FF'
    },
    {
      token: 'string',
      foreground: 'efaa92'
    },
    {
      token: 'keyword',
      foreground: '006aff'
    },
    {
      token: 'keyword.directive',
      foreground: 'fa6aff'
    },
    {
      token: 'keyword.directive.include',
      foreground: 'fa6aff'
    },
    {
      token: 'operator',
      foreground: 'F92672'
    },
    ],
    //"tokenColors": "./Diner.tmTheme",
    colors: {
      'editor.foreground': '#f8f8f2',
      'editor.background': '#262626',
      'editorLineNumber.foreground': '#d6d6d6',
      'editorActiveLineNumber.foreground': '#d6d6d6',
      "editorIndentGuide.background": "#404040",
    }
  });
  monaco.editor.defineTheme("hg0428", {
    "base": "vs-dark",
    "inherit": true,
    "rules": [{
      "token": "comment",
      "foreground": "797979",
      "fontStyle": "italic"
    },
    {
      "token": "operator",
      "foreground": "ef47ff",
      "fontStyle": "bold"
    },
    {
      "token": "number",
      "foreground": "aafeaa"
    },
    {
      "token": "keyword",
      "foreground": "2590ff"
    },
    {
      "token": "keyword.directive",
      "foreground": "9960ff"
    },
    {
      "token": "callFunction",
      "foreground": "efee22",
      "fontStyle": "bold"
    },
    {
      "token": "string",
      "foreground": "ff7777"
    },
    {
      "token": "string.escape",
      "foreground": "cdbbaa",
      "fontStyle": "bold"
    },
    {
      "token": "string.escape.invalid",
      "foreground": "ff2222"
    },
    {
      "token": "string.invalid",
      "foreground": "ff2222",
      "fontStyle": "italic"
    }
    ],
    "colors": {
      "editor.background": "#262626"
    }
  });
  //↓ Make a command to move the cursor back 1.
  monaco.editor.registerCommand('move', function(obj, amt = 1) {
    pos = editor.getPosition();
    pos.column -= amt;
    editor.setPosition(pos);
  });
  //↓ Make a command to delete an extra character at the begining.
  monaco.editor.registerCommand('delete', function(obj, char = '#') {
    //Since the autocomplete will mess up directives, you need to delete the extra #.
    //if you type #incl then accept the autocomplete it will result in ##include file.
    //So, you need to remove the extra #. But, I don't know how, so someone else do it
  });
  //↓ Register a completion item provider for the new language
  monaco.languages.registerCompletionItemProvider('Aardvark', {
    provideCompletionItems: (model, position, context, token) => {
      // Attributes:
      // additionalTextEdits
      // command
      // commitCharacters
      // detail
      // documentation
      // filterText
      // insertText
      // insertTextRules
      // kind
      // label
      // preselect
      // range
      // sortText
      // tags
      var suggestions = [{
        label: 'function',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: ['function ${1:name}(${2:parameters}) {', '\t$0', '}'].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: 'function {name}({params}) {}'
      },
      {
        label: 'class',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: ['class ${1:name} as this {', '\t$0', '}'].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: 'class {name} as this {}'
      },
      {
        label: 'ifelse',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: ['if ${1:condition} {', '\t$0', '} else {', '\t', '}'].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'If-Else Statement',
        detail: 'if {condition} {} else {}'
      },
      {
        label: "if",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: ['if ${1:condition} {', '\t$0', '}'].join("\n"),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: "If Statement",
        detail: 'if {condition} {}'
      },
      {
        label: 'include',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: ['include ${0:library}'].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: 'include {library}'
      },
      ];
      let fileNames = [];
      let added = [];
      files.map(({
        name
      }) => {
        if (fileNames) fileNames.push(name)
      });
      //↓ All builtin functions, classes and keywords
      let builtin = {
        Function: {
          array: ['open', 'type_of', 'sequence', 'exit'],
          addition: '()',
          extra: {
            command: {
              title: 'none',
              id: 'move'
            }
          }
        },
        // ^Builtin Functions
        TypeParameter: {
          array: ['String', 'Number', 'Array', 'Set', 'Bits', 'Boolean', 'Object', 'File', 'Function'],
          addition: ''
        },
        // ^The above is actually a Class, typeParameter, and Contructor
        Keyword: {
          array: ['class',
            'extends',
            // # 'type',
            'extending',
            'function',
            'for',
            'while',
            'match',
            'case',
            'if',
            'else',
            'return',
            'static',
            'include',
            'await',
            'pause-until',
            'yield',
            'let',
            'as',
            'from',
            'defer',
            "layout",
            "break",
            "continue",
            "private",
            "set",
            "get",
            "macro"],
          addition: ' '
        },
        // ^Keywords
        Value: {
          array: ['true', 'false', 'null'],
          addition: ''
        },
        // ^True, false, null, etc
        File: {
          array: fileNames,
          addition: ''
        },
        // ^Files in the editor
        Method: {
          array: [
            'stdout.write',
            'stdout.log',
            'stdin.read',
            'stdin.readline',
            'stdin.prompt',
            'stderr.write',
            'stderr.log',
            'stdout.flush',
            'stderr.flush',
          ],
          addition: '()',
          extra: {
            command: {
              title: 'none',
              id: 'move'
            },
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          }
        }
      }
      //^ The above builtin variable and the↓ below code need to be changed.
      for (let i in builtin) {
        o = builtin[i];
        o.extra = o.extra || {};
        for (v of o.array) {
          if (Array.isArray(v)) {
            label = v[0];
            v = v[1];
          } else label = v;
          added.push(v);
          suggestions.push({
            label: label,
            kind: monaco.languages.CompletionItemKind[i],
            insertText: v + o.addition,
            ...o.extra
          });
        }
      }
      //The ↓ below code was just to see the icon for all the different CompletionItemKinds
      // for (let i of ['Class', 'Color', 'Constant', 'Constructor', 'Customcolor', 'Enum', 'EnumMember', 'Event', 'Field', 'File', 'Folder', 'Function', 'Interface', 'Issue', 'Keyword', 'Method', 'Module', 'Operator', 'Property', 'Reference', 'Snippet', 'Struct', 'Text', 'TypeParameter', 'Unit', 'User', 'Value', 'Variable']) {
      //   suggestions.push({
      //     label: 'simple' + i,
      //     kind: monaco.languages.CompletionItemKind[i],
      //     insertText: 'simple' + i
      //   })
      // }
      //↓ Get editor value to use in regex
      value = editor.getValue();
      //↓ Replaces all strings with nothing.
      // cant we just use my regex and then no need for fixing the string one
      //^ No, because then it would detect assignments from within strings
      value = value.replaceAll(/'.*?[^\\]'/g, ""); //only allows one line, the string can't be multiline
      value = value.replaceAll(/".*?[^\\]"/g, "");
      //↓ Replace multi line comments
      value = value.replaceAll(/\/\/(.*[\n\r]*)*\\\\/gm, "");
      //↓ Single line
      value = value.replaceAll(/\/\/.*/g, "");
      //^ WORKS because strings are already gone, and // can be anywhere on the line, And it won't replace anything before the //
      //↓ Variable Assignments
      vars = [...value.matchAll(/let[ \t]+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/gm)];
      for (id of vars) {
        id = id[1];
        if (!added.includes(id)) {
          suggestions.push({
            label: id,
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: id
          });
          added.push(id);
        }
      }
      //↓ Function creations
      functs = [...value.matchAll(/function[ \t]+([a-zA-Z_][a-zA-Z0-9_]*)\(/gm)]
      for (id of functs) {
        id = id[1];
        if (!added.includes(id)) {
          suggestions.push({
            label: id,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: id + '()',
            //↓ The command is used to put the cursor within the parentheses It is defined above the current function
            command: {
              title: 'none',
              id: 'move'
            }
          });
          added.push(id);
        }
      }
      //↓ Class contructors
      classes = [...value.matchAll(/type[ \t]+([a-zA-Z_][a-zA-Z0-9_]*).*?{/gm)]
      for (id of classes) {
        id = id[1];
        if (!added.includes(id)) {
          suggestions.push({
            label: id,
            kind: monaco.languages.CompletionItemKind.Constructor,
            insertText: id + '()',
            //x↓ The command is used to put the cursor within the parentheses
            command: {
              title: 'none',
              id: 'move'
            }
          });
          added.push(id);
        }
      }
      return {
        suggestions: suggestions
      };
    }
  });
}

function getAdkExampleCode1() {
  return [
    "stdout.write(\"Hello World!\")"
  ].join("\n");
}
var THESE_THEMES = {
  1: {
    "editor.background": "#1e1e1e",
    "editor.foreground": "#d4d4d4",
    "editorIndentGuide.background": "#404040",
    "editorRuler.foreground": "#333333",
    "activityBarBadge.background": "#007acc",
    "sideBarTitle.foreground": "#bbbbbb"
  },
  2: {
    'editor.foreground': '#f8f8f2',
    'editor.background': '#262626',
    'editorLineNumber.foreground': '#d6d6d6',
    'editorActiveLineNumber.foreground': '#d6d6d6',
    "editorIndentGuide.background": "#404040",
  },
};