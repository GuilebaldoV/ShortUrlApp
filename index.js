const express=require('express');
const {create}=require('express-handlebars');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const User = require('./models/User');
const csrf =require('csurf')
const mongoSanitize=require('express-mongo-sanitize')
const cors=require('cors');

const mongoStore=require('connect-mongo');

// Leyendo las variables de entonrno
require('dotenv').config()
// require('./database/db')
const clientDB=require('./database/db')
const app=express()

// cors
const corsOptions={
    credentials:true,
    origin:process.env.PATHHEROKU|| "*",
    methods:['GET','POST']
}

app.use(cors())

// configurando el s ession sin mongo!
// app.use(session({
//     secret:'keyboard cat',
//     resave:false.valueOf,
//     saveUninitialized:false,
//     name:"secret-name-blablabl"
// }));
// ahora con mongo
app.use(session({
    secret:process.env.SECRETSESSION,
    resave:false.valueOf,
    saveUninitialized:false,
    name:"session-user",
    store: mongoStore.create({
        clientPromise:clientDB,
        dbName:'test'
    }),
    cookie:{secure:process.env.MODO=='producction',
    maxAge:30 * 24 * 60 * 60 * 1000},
}));







// pidiendo la session en la ruta papa
// app.get('/ruta-protegida',(req,res)=>{
//     res.json(req.session.usario||'Sin sesion de usuario')
// })

// app.get('/crear-session',(req,res)=>{
//     req.session.usario="guile"
//     res.redirect('/ruta-protegida')
// })

// app.get('/destruir-session',(req,res)=>{ 
//     req.session.destroy();
//     res.redirect('/ruta-protegida')
// })

// usar flash
// mucho cuidado por que los mensajes flash solo viven una vez!!!!
app.use(flash())
// Configurando passport
// cada que creamos el login apartir de seralizare el usario se mantendra activo
// cada vez que refresh no se cierre la session
app.use(passport.initialize())
app.use(passport.session())

// Creamos la session
passport.serializeUser((user,done)=>done(null,{id:user._id,username:user.username})) //req user
passport.deserializeUser(async (user,done)=>{
    // es necesario revisar la base de datos???
    console.log('holaaaaaa')
    // console.log(user,"1")
    const userDB= await User.findById(user.id)
    return done(null,{id:userDB._id,username:userDB.username})
})
 




const hbs=create({
    extname:".hbs",
    partialsDir:["views/components"]
})

app.engine("hbs",hbs.engine);
app.set("view engine", ".hbs");
app.set("views","./views");

// console.log(require('./routes/auth'))
app.use(express.static(__dirname + "/public"));
// midlware para formularios
app.use(express.urlencoded({extended:true}))


// crsf que solo reciba formularios de mi pagina 
// Ahora tenemos que tener un input de tipo hide en todos nuestros formularios
app.use(csrf());
// para evitar inyecciones
app.use(mongoSanitize())

app.use((req,res,next)=>{
    // Confirgurar el csrfToekn de manera global 
    // Configurando los errores de manera hlobal
    res.locals.csrfToken=req.csrfToken();
    res.locals.mensajes=req.flash('mensajes')
    next()
})


app.use("/",require('./routes/home'));
app.use("/auth",require('./routes/auth'));


const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    console.log('Servidor escuchando',PORT)
})
// http://localhost:3000/