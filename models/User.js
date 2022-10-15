const mongoose=require('mongoose');
const {Schema}=mongoose;
const bcrypt=require('bcryptjs')

const userSchema=new Schema({
    username:{
        type:String,
        lowercase:true,
        require:true
    },
    email:{
        type:String,
        lowercase:true,
        require:true,
        unique:true,
        index:{unique:true}
    },
    password:{
        type:String,
        require:true
    },
    // Para confirmar la cuenta
    tokenConfirm:{
        type:String,
        default:null
    },
    cuentaConfirmada:{
        type:Boolean,
        default:false
    },
    imagen:{
        type:String,
        default:null
    }

})
// Usar function para poder usar el this
userSchema.pre('save',async function(next){
    const user=this
    // interesante esto es para que solo hashee una bez
    if(!user.isModified('password')) return next()
try {
            // hashenado la password 
            const salt=await bcrypt.genSalt(10)
            const hash=await bcrypt.hash(user.password,salt)
            user.password=hash
            next();

        } catch (error) {
            console.log(error)
            throw new Error('Error al hashear')
}

})
// verificando contraseña
userSchema.methods.comparePassword=async function( candiatePassword){
    return await bcrypt.compare(candiatePassword,this.password)
}

module.exports=mongoose.model('User', userSchema)