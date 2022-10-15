const express=require('express');
const router=express.Router();
const {loginForm,registerForm, registerUser, confirmarCuenta, loginUser, cerrarSesion}=require("../controllers/authControllers")
const {body}=require('express-validator')


router.get("/register",registerForm)
// Usando express validator para validar los datos
router.post("/register",[
    body("username","Ingrese un nombre valido").trim().notEmpty().escape(),
    body("email","Ingrese un email valido").trim().isEmail().normalizeEmail(),
    body("password","Ingrese contraseña minima de 6 caracteres").trim().isLength({min:6})
    .escape()
    // Validacion inventrada
    .custom((value,{req})=>{
        if(value!==req.body.repassword){
            throw new Error('No coinciden las contraseñas')
        }else{
            return value;
        }
        
    })
],registerUser)
router.get("/confirmar/:token",confirmarCuenta)
router.get("/login",loginForm)
router.post("/login",[
    body("email","Ingrese un email valido").trim().isEmail().normalizeEmail(),
    body("password","Ingrese contraseña minima de 6 caracteres").trim().isLength({min:6})

],loginUser)

router.get("/logout",cerrarSesion)

module.exports=router;