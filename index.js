const espree = require("espree");
const sha1 = require('js-sha1');
const { Pool, Client } = require('pg')
// pools will use environment variables
// for connection information
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tokenize',
  password: 'admin',
  port: 5432,
})


const someVar =  `let testTask = (greaterBoy, macho) => {
  return espree.tokenize("howCamelCanBeACamelFish?");
};`;


const identifierSpare = (AST) => AST.filter(identifier => identifier.type === "Identifier" || identifier.type === "String").map(identifier => {
  if (identifier.type === "Identifier" || identifier.type === "String") {
    return identifier.value.replace(/[.,\/#!$%\^&\*;:{}=\-_`?\"\'\`~()]/g, "").replace(/([A-Z])/g, ' $1').toLowerCase().split(" ");
  }
}).join().split(",");

const tokenization = async (code) => {
  /* const result = []; */
  const toString = `${code}`;
  const codeAst = espree.tokenize(toString);
  const identifiers = new Set(identifierSpare(codeAst));
  const uniqueIdentifiers = [...identifiers];
  console.log(uniqueIdentifiers);
  const hashTokens = sha1(uniqueIdentifiers);
  console.log(hashTokens);

  const res = await pool.query('SELECT NOW()')
console.log(res.rows[0].message) // Hello world!

await pool.end()
}

tokenization(someVar);