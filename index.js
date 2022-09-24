const express=require('express');
const {create}=require('express-handlebars');
const app=express()

const hbs=create({
    extname:".hbs",
    partialsDir:["views/components"]
})

app.engine("hbs",hbs.engine);
app.set("view engine", ".hbs");
app.set("views","./views");

// console.log(require('./routes/auth'))

app.use("/",require('./routes/home'));
app.use("/auth",require('./routes/auth'));
// app.use("/auth",(req,res)=>{
//     res.render("login")
// })

app.listen(3000,()=>{
    console.log('Servidor escuchando')
})
// http://localhost:3000/