 const express=require('express');
const { leerUrls, agregarUrl, eliminarUrls, editarUrl, editarUrlForm, redirecionamiento } = require('../controllers/homeControllers');
const { formPefil, editarFotoPerfil } = require('../controllers/perfilController');
const urlValidar = require('../middlewares/urlValida');
const verificarUser = require('../middlewares/verificarUser');
 const router=express.Router()

 router.get("/",verificarUser,leerUrls)
 router.post("/",verificarUser,urlValidar,agregarUrl)
 router.get("/eliminar/:id",verificarUser,eliminarUrls)
 router.get("/editar/:id",verificarUser,editarUrl)
 router.post("/editar/:id",verificarUser,urlValidar,editarUrlForm)
 router.get("/perfil",formPefil);
 router.post("/perfil", verificarUser, editarFotoPerfil);
 router.get("/:ShortUrl",redirecionamiento)


module.exports=router;