const formidable=require('formidable')
const path=require('path')
const fs=require('fs')
const User=require('../models/User')
const jimp=require('jimp')
module.exports.formPefil=async (req,res)=>{
    try {
     const user=await User.findById(req.user.id)
        return res.render("perfil",{user:req.user,imagen:user.imagen})
    } catch (error) {
        req.flash("mensajes",[{msg:'error al leer el usuario'}])
        res.render('perfil')
    }
}

// Usamos formidavble para subvir imagenes

module.exports.editarFotoPerfil=async(req,res)=>{
    // return res.json({ok:true})
    // instanciamos formidible
    const form=new formidable.IncomingForm()
    // 50MB
    form.maxFileSize=50*1024*1024
    // proesamos la imagen
    form.parse(req,async(err,fields,files)=>{
        try {
            if(err){
                throw new Error('fallo la subida de imagen')
            }
            console.log(files)
            const file=files.myFile
            if(file.originalFilename===''){
                throw new Error('agrega una imagen')
                
            }

            if(!(file.mimetype==='image/jpeg' || file.mimetype === 'image/png')){
                throw new Error('Porfavor agrega una imagen .jpg o png')
            }

            if(file.size>50*1024*1024){
                throw new Error('Menos de 50mb')
            }

            const extension=file.mimetype.split('/')[1]
            const dirFil=path.join(__dirname,`../public/img/perfiles/${req.user.id}.${extension}`)
            console.log(dirFil+extension)
            // renombra
            fs.renameSync(file.filepath,dirFil)

            const image=await jimp.read(dirFil)
            image.resize(200,200).quality(80).writeAsync(dirFil)


            const user=await User.findById(req.user.id)
            user.imagen=`${req.user.id}.${extension}`
            await user.save();



            req.flash("mensajes",[{msg:'la imagen ya se subio'}])
        } catch (error) {
            req.flash("mensajes",[{msg:error.message}])
        } finally{
            return res.redirect('/perfil'); 
        }

    })



};

