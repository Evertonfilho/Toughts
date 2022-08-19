const User = require('../models/User.js')
const session = require('express-session')
const bcrpyt = require('bcryptjs');
const flash = require('express-flash')


module.exports = class AuthController {
    static login(req,res){
        res.render('auth/login');
    }

    static async loginPost(req,res){

        const {email,password} = req.body

        // find usuário
        const user = await User.findOne({where: {email:email}})

        if(!user){
            req.flash('message', 'Usuário não encontrado!')

            res.render('auth/login')

            return
        }

        // checar se o usuário existe
        const passwordWatch = bcrpyt.compareSync(password, user.password)
        if(!passwordWatch ){
            req.flash('message', 'Senha inválida!')

            res.render('auth/login')

            return
        }

        req.session.userid = user.id

        req.flash('message', 'Autenticação realizado com sucesso!')

        req.session.save(() => {
            res.redirect('/')
        })

    }

    static register(req,res){
        res.render('auth/register');
    }

    static async registerPost(req,res){
        
        const {email,name,password,confirmpassword} = req.body

        // Validação de senha, as duas iguais
        if(password != confirmpassword){
            req.flash('message', 'As senhas não conferem, tente novamente! ')
            res.render('auth/register')

            return
        }

        const checkIfUserExists = await User.findOne({where: {email:email}})

        if(checkIfUserExists){
            req.flash('message', 'O email ja esta em uso, tente outro! ')
            res.render('auth/register')

            return
        }   
        // salt sao caracteres alternativos colocados antes da senha
        const salt = bcrpyt.genSaltSync(10)
        const hashedPassword = bcrpyt.hashSync(password,salt)

        const user = {
            name,
            email,
            password: hashedPassword,
        }

        try{
            const createUser = await User.create(user)

            req.session.userid = createUser.id

            req.flash('message', 'Cadastro realizado com sucesso!')

            req.session.save(() => {
                res.redirect('/')
            })


        }catch(err){
            console.log(err)
        }

    }

    static logout(req,res){
        req.session.destroy()
        res.redirect('/login')
    }

}