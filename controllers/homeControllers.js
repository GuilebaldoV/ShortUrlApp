const Url=require('../models/Url')
const {nanoid}=require('nanoid');
const { findOneAndDelete } = require('../models/Url');

const leerUrls= async (req,res)=>{
    try {
        // lean para convertirlo a js objects
        // Recordar : Solo trae los que conicicen con los datos que tiene la session de passport!!
        // Todos los que tiene como middleware a verificar user tienen acceso a este
        const urls=await Url.find({user:req.user.id}).lean()
        // console.log(urls)
        res.render("home",{urls,crsfToken:req.csrfToken()})
    } catch (error) {
        req.flash("mensajes",[{msg:error.message}])
        return res.redirect('/');      }
 };

 const agregarUrl=async (req,res)=>{
    const {origin}=req.body
    try{
        const url= new Url({origin,ShortUrl:nanoid(8),user:req.user.id})
        await url.save()
        req.flash("mensajes",[{msg:'Url agregada'}])
        res.redirect('/')
    }catch(error){
        req.flash("mensajes",[{msg:error.message}])
        return res.redirect('/');    
      }
 }

 const eliminarUrls=async(req,res)=>{
    const {id}= req.params;
    try{
        // await Url.findByIdAndDelete(id)
    // Verificar que el que edita es el usario
        const url=await Url.findById(id)
        if(!url.user.equals(req.user.id)){
            throw new Error('No es tu url Payaso')
        }

        await url.remove()
        req.flash("mensajes",[{msg:"Url eliminada"}])
        res.redirect('/')
    }catch(error){
        req.flash("mensajes",[{msg:error.message}])
        return res.redirect('/');    

    }
 }

const editarUrl=async(req,res)=>{
    const {id}= req.params;
    try{
        const url= await Url.findById(id).lean()
        if(!url.user.equals(req.user.id)){
            throw new Error('No es tu url Payaso')
        }
        res.render('home',{url,crsfToken:req.csrfToken()});
        // res.redirect('/')
    }catch(error){
        req.flash("mensajes",[{msg:error.message}])
        return res.redirect('/');    
    }   
}

const editarUrlForm=async(req,res)=>{
    const {id}= req.params;
    try{
        const {origin}=req.body

        const url=await Url.findById(id)
        if(!url.user.equals(req.user.id)){
            throw new Error('No es tu url Payaso')
        }

        await url.updateOne({origin})

        req.flash("mensajes",[{msg:'Url editada'}])


        // await Url.findByIdAndUpdate(id,{origin})
        // if (!url) return res.send("No se encontro")

        res.redirect('/');
        // res.redirect('/')
    }catch(error){
        req.flash("mensajes",[{msg:error.message}])
        return res.redirect('/');    
    }   
}
const redirecionamiento=async(req,res)=>{
    const {ShortUrl}= req.params;
    console.log('entro aki',ShortUrl)
    try{
        const url=await Url.findOne({ShortUrl})

        res.redirect(url.origin);
    }catch(error){
        req.flash("mensajes",[{msg:error.message}])
        return res.redirect('/auth/login');    
    }   
}
 module.exports={
    leerUrls,
    agregarUrl,
    eliminarUrls,
    editarUrl,
    editarUrlForm,
    redirecionamiento
 }
