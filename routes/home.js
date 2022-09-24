 const express=require('express')
 const router=express.Router()

 router.get("/",(req,res)=>{
    const urls=[ 
        {origin:"www.google.com", shortURL:"JAJAJAJA"},
        {origin:"www.google2.com", shortURL:"JAJAJAJA"},
        {origin:"www.google3.com", shortURL:"JAJAJAJA"},
        {origin:"www.google4.com", shortURL:"JAJAJAJA"}
    ]
    res.render("home",{urls})
 });


module.exports=router;