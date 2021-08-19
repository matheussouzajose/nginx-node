const express = require("express")
const app = express()
const port = 3000
const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
}
const mysql = require('mysql2/promise');

async function connection() {
  return mysql.createConnection(config)
}

async function close() {
  const conn = await connection()
  conn.end()
}

async function query(sql) {
  const conn = await connection()
  const [ rows ] = await conn.query(sql)
  return rows
}

async function main() {
  const result = await query(`SHOW TABLES LIKE 'people'`);

  if (!result.length) {
    await query(`CREATE TABLE people(id int not null auto_increment, name varchar(255), primary key(id))`);
  }

  await query(`INSERT INTO people(name) values ('Matheus')`);
  return await query(`SELECT * FROM people order by id desc`)
}

app.get('/', async (req, res) => {
  const result = await main()
  let html = '<h1>Full Cycle Rocks!</h1>'
  let list = ''
  result.forEach(item => {
      list += `<li>${item.name}</li>`
  })

  html += `<ul>${list}</ul>`
  res.send(html)
})

app.listen(port, () => {
  console.log(`Rodando na porta ${port}`)
})
