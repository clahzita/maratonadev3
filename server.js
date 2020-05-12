//cponfigurando o servidor
const express = require("express")
const server = express()

//configuração com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432 
})

//configuração para apresentar arquivos estáticos
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({extended: true}))

//configuração template engine
const nunjuncks = require("nunjucks")
nunjuncks.configure("./", {
    express: server,
    noCache: true, //cache guarda dados para buscar mais rapido
})

//configurar apresentação da página
server.get("/", function (req, res) {
   

    db.query(`SELECT * FROM "donors"`, function(err, result){
        if(err) return res.send("GET - Erro de banco de dados: "+err.message)

        const donors = result.rows

        return res.render("index.html", { donors })
    })   
})

server.post("/",function(req, res){

    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == ""){
        res.send("Todos os campos são obrigatórios")
        return
    }

    const query = `
        insert into "donors" ("name","email","blood")
        values ($1, $2, $3);`

    const values = [name,email,blood]

    db.query(query, values, function(err){
        if(err) return res.send("Erro no banco de dados: " + err.message)
        

        return res.redirect("/")

    })

    
})

//ligar servidor e permitir acesso na porta 3000
server.listen(3000, function () {
    console.log("servidor iniciado")
})
