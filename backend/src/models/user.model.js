
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:[true,'username is required creating user'],
        unique:[true,'username is already extist']
    }, email:{
        type:String,
        required:[true,'email is required creating user'],
        unique:[true,'email is already extist']
    },
     password:{
        type:String,
        required:[true,'password is required creating user'],
    },
    verify:{
        type:Boolean,  
        default :false
    }

},{
    timestamps:true
})

userSchema.pre('save', async function () {

    if (!this.isModified('password')) return

    this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.comparePassword = function (userPass) {
    return bcrypt.compare(userPass, this.password)
}

const userModel = mongoose.model('users',userSchema)

export default userModel