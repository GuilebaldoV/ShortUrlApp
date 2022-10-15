const User = require("../models/User")
const {nanoid}=require('nanoid')
const bcrypt=require('bcryptjs')
const { findOne } = require("../models/User")
const {validationResult}=require('express-validator')
const nodemailer=require('nodemailer')
require('dotenv').config()


const registerForm=(req,res)=>{
    // res.render('register',{mensajes:req.flash ('mensajes')})
    // mandando el csrfToken de forma manual, coool
    // res.render('register',{mensajes:req.flash('mensajes'),crsfToken:req.csrfToken()})
    res.render('register',{crsfToken:req.csrfToken()})


}

const registerUser=async(req,res)=>{
    // De validator, dice si hay errores
    const errors=validationResult(req)

    if (!errors.isEmpty()){
        console.log(errors,"esto son los errores")
        console.log(errors.array())
        req.flash("mensajes",errors.array())
        return res.redirect('/auth/register');

    }
    const {username,password,email}=req.body
    try {
        
        let user=await User.findOne({email})
        if(user) throw new Error('Ya existe el usuario')
        user= new User({username,password,email,tokenConfirm:nanoid()})

        await user.save()

        console.log(process.env.userMail,process.env.passEmail)
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.userMail,
              pass: process.env.passEmail
            }
          });

          await transport.sendMail({
            from:'"Guilebaldo',
            to:user.email,
            subject:'holas',
            html:`<a href="${
                process.env.PATHHEROKU||'http://localhost:5000'
            }/auth/confirmar/${user.tokenConfirm}">Verifica tu cuenta<a>`
          })

        //   req.flash("mensajes",[{msg:"url no valida"}])

        req.flash("mensajes",[{msg:'Revisa tu correo electronico y verifica tu cuenta'}])
        res.redirect('/auth/login')
    } catch (error) {
        req.flash("mensajes",[{msg:error.message}])

        return res.redirect('/auth/register');   
    }
}


const loginForm=(req,res)=>{
    // Mandando mensajes de error si los hay
    res.render('login',{crsfToken:req.csrfToken()})
}

const confirmarCuenta=async (req,res)=>{
    const {token}=req.params
    try {
        const user=await User.findOne({tokenConfirm:token})
        if (!user) throw new Error('No existe este usuario')
        user.cuentaConfirmada=true;
        user.tokenConfirm=null;
        await user.save()

        // req.flash("mensajes",[{msg:"url no valida"}])

        // req.flash("mensajes",[{msg:"Cuenta verificada"}])
        
        req.flash("mensajes",[{msg:'Url agregada'}])

        res.redirect('/auth/login')
    } catch (error) {
        console.log(error)
        req.flash("mensajes",[{msg:error.Error}])
        return res.redirect('/auth/login');   
    }
    
    
}

const loginUser=async(req,res)=>{
    // De validator, dice si hay errores
    const errors=validationResult(req)

    if (!errors.isEmpty()){
        // Si hay errores
        req.flash("mensajes",errors.array())
        console.log('definitivamente hay errores')
        return res.redirect('/auth/login');
    }

    const {email,password}=req.body
    try {
        console.log(email)
        const user=await User.findOne({email})
        console.log(user,"perdonaaa")
        if(!(user)) throw new Error('No existe el mail')
        if(!await user.comparePassword(password)) throw new Error('Contraseña inccorrecta')
        if(!user.cuentaConfirmada) throw new Error('La cuenta no esta confirmada')
        console.log(user,"aver ke pex")
        
        // Esto es de password
        // Aqui crea la session de usario con password
        req.login(user,function(err){
            console.log('si inicie la sesion?')
            if(err) throw new Error('Error al crear la sesion')
            console.log('si inicie la sesion')
            return res.redirect('/')
        })
        // res.redirect('/')

    } catch (error) {
        // ;0 flash es impresionante
        console.log(error)
        req.flash("mensajes",[{msg:error.message}])
        return res.redirect('/auth/login');
    }
}
const cerrarSesion=(req,res)=>{
    // cierra la session
    req.logout()
    return res.redirect('/auth/login')
}


module.exports={
    cerrarSesion,
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser
}






