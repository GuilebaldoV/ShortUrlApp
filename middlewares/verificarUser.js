module.exports=(req,res,next)=>{
    // Verifica si la session es activa
    if(req.isAuthenticated()){
        return next()
    }
    console.log('no autenticado xd')
    res.redirect('/auth/login')
}