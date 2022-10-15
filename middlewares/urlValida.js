const {URL}=require('url')

const  urlValidar=(req,res,next)=>{
    try {
        const { origin } = req.body;
        const urlFrontend = new URL(origin);
        if (urlFrontend.origin !== "null") {
            if (
                urlFrontend.protocol === "http:" ||
                urlFrontend.protocol === "https:"
            ) {
                return next();
            }
            throw new Error("Tiene que tener htttps");
        }
        throw new Error("no válida 😲");
    } catch (error) {
// Esto es solo para traducir XD
    if (error.message=="Invalid URL"){
        req.flash("mensajes",[{msg:"url no valida"}])
    }else{

        req.flash("mensajes",[{msg:error.message}])
    }

        return res.redirect('/');    }

}

module.exports=urlValidar;