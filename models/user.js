const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    mobile:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    aadharNumber:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:['voter','admin'],
        default: 'voter'
    },
    isVoted:{
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function (next) {
    const blog = this;
    if(!blog.isModified('password')) return ;
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(blog.password,salt);
        blog.password = hashedPassword;
        next();
    }catch(err){
        return ;
    }
})

//fucntion of compare password for hash generation
userSchema.methods.comparePassword = async function (candidatePassword) {
    try{
        const isMatch = await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;
