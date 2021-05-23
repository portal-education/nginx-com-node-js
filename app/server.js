const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'peoples'
}    

const mysql = require("mysql")
const conn = mysql.createConnection(config)

conn.query(`
    CREATE TABLE IF NOT EXISTS people
    (
        id int not null auto_increment primary key,
        name varchar(255) not null
    )
`)
conn.end();

function getPeople(res){
    
    const conn = mysql.createConnection(config)
    //-------------------
    conn.query(`select * from people order by id desc`, (error, results, fields) => {
        var result = 
        `
            <html>
            <style>
            table, th, td { border: 1px solid black; }
            td{ width: 200px }
            </style>
            <body>
            <h1>Full Cycle Rocks!!!</h1>

            <form action="/" method="get">
            <div>
                <label for="nome">Nome:</label>
                <input type="text" id="name" name="name" />
                 <button type="submit">Enviar sua mensagem</button>
            </div>
            </form>

            <table>
            <tr>
            <th>Id</th>
            <th>Name</th>
            </tr>        
        `;

        for (var i = results.length; i--; ) {
            result += 
            `
                <tr>
                <td>${results[i].id}</td>
                <td>${results[i].name}</td>
                </tr>
            `
        }

        result +=
        `
            </table>
            </body>
            </html>
        `
        res.send(result)
    });

    conn.end();
}

app.get('/', (req, res) => {
    var name = req.query.name

    if(name != undefined && name.length > 0){
        const conn = mysql.createConnection(config)
        conn.query(`INSERT INTO people(name) values('${name}')`, () =>{
            getPeople(res)
        })    
        conn.end();
    }else{
        getPeople(res)
    }

})

app.listen(port, () => {
    console.log('Rodando na porta ' + port)
})