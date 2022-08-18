const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')


const app = express()

const conn = require('./db/conn.js')

//Models
const Tought = require('./models/Tought.js')
const User = require('./models/User.js')

//import
const toughtsRoutes = require('./routes/toughtsRoutes.js')
const authRoutes = require('./routes/authRoutes.js')
const AuthController = require('./controllers/AuthController.js')
const ToughtController = require('./controllers/ToughtController.js')


//Basicamente, uma template engine serve para facilitar a criação de páginas HTML e tornar o envio e exibição de informações para estas páginas um processo mais simples e organizado.
// Template engine 
app.engine('handlebars',exphbs.engine({ defaultLayout: "main"}))
app.set('view engine', 'handlebars')

//Receber dados do body 
//Analisa as requests de entrada com cargas úteis codificadas por url e é baseado no analisador de corpo
app.use(
    express.urlencoded({
        extended:true
    })
)

app.use(express.json())

//session middleware armazena os dados da sessão no servidor
app.use(
    session({
        name:'session',
        secret:'nosso_secret',
        resave:false,
        saveUninitialized:false,
        store:new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(),'sessions'),
        }),
        cookie:{
            secure:false,
            maxAge:360000,
            expires:new Date(Date.now() + 36000),
            httpOnly:true
        }
    }),
)


//flash message permite que os desenvolvedores enviem uma mensagem sempre que um usuário estiver redirecionando para uma página da web especificada.
app.use(flash())

//public path
app.use(express.static('public'))

//set session to res
app.use((req,res,next) => {

    if(req.session.userid){
        res.locals.session = req.session
    }

    next()

})

//Router 
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)
app.use('/', authRoutes)

app.get('/', ToughtController.showToughts)
app.get('/login', AuthController.login)
app.get('/register', AuthController.register)

conn 
//.sync({force:true})
  .sync()
  .then(() => {
    app.listen(3000)
  })
  .catch((err) => console.log(err))