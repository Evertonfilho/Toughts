const User = require('../models/User.js')

const bcrpyt = require('bcryptjs')

module.exports = class AuthController {
    static login(req,res){
        res.render('auth/login');
    }

    static register(req,res){
        res.render('auth/register');
    }

    static async registerPost(req,res){
        
        const {email,senha,name,password,confirmpassword} = req.body

        // Validação de senha, as duas iguais
        if(password != confirmpassword){
            req.flash('message', 'As senhas não conferem, tente novamente! ')
            res.render('auth/register')

            return
        }

    }
}