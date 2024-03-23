console.log("Script started");
function lexer(input) {
  const tokens = [];
  let cursor = 0;
  
  while (cursor < input.length) {
    let char = input[cursor];
    // skip white space
    if (/\s/.test(char)) {
      cursor++;
      continue;
    }
    if (/[a-zA-Z]/.test(char)) {
      let word = "";
      while (char && /[a-zA-Z0-9]/.test(char)) {
        word += char;
        char = ++cursor < input.length ? input[cursor] : null;
      }
      if (word === "ye" || word === "swift") {
        tokens.push({ type: "keyword", value: word });
      } else {
        tokens.push({ type: "identifier", value: word });
      }
      continue;
    }
    if (/[0-9]/.test(char)) {
      let number = "";
      while (char && /[0-9]/.test(char)) {
        number += char;
        char = ++cursor < input.length ? input[cursor] : null;
      }
      tokens.push({ type: "number", value: parseInt(number) });
      continue;
    }
    // tokenize operators and equals sign
    if (/[\+\-\*\/\=]/.test(char)) {
      tokens.push({ type: "operator", value: char });
      cursor++;
      continue;
    }
  }
  return tokens;
}

function parser(tokens) {
  const ast = {
    type: "Program",
    body: [],
  };
  while (tokens.length > 0) {
    let token = tokens.shift();
    if (token.type === "keyword" && token.value === "ye") {
      let declaration = {
        type: "Declaration",
        identifier: tokens.shift().value,
        value: null,
      };
      if (tokens[0].type === "operator" && tokens[0].value === "=") {
        tokens.shift();
        let expression = "";
        while (tokens.length > 0 && tokens[0].type !== "keyword") {
          expression += tokens.shift().value;
        }
        declaration.value = expression.trim();
      }
      ast.body.push(declaration);
    } else if (token.type === "keyword" && token.value === "swift") {
      let printStatement = {
        type: "Print",
        identifier: tokens.shift().value,
      };
      ast.body.push(printStatement);
    }
  }
  return ast;
}

function codeGen(node) {
  switch (node.type) {
    case "Program":
      return node.body.map(codeGen).join("\n");
    case "Declaration":
      return `let ${node.identifier} = ${node.value};`;
    case "Print":
      return `console.log(${node.identifier});`;
  }
}

function compiler(input) {
  const tokens = lexer(input);
  const ast = parser(tokens);
  const executableCode = codeGen(ast);
  return executableCode;
}

function runCode(input) {
  eval(input);
}

const code = `
        ye x = 10
        ye y = 100
        ye sum = x + y
        swift sum
    `;

const exec = compiler(code);

runCode(exec);
