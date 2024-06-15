const mongooes = require('mongoose');
const bcrypt = require('bcrypt')

 const userSchema = mongooes.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        unique : true
    },
    fullname : {
        type : String,
        required : true,
        trim : true
    },
    avatar : {
        type : String,
        required : true,
    },
    coverImage : {
        type : String,
    },
    watchHistory : {
        type : Schema.Types.ObjectId,
        ref : "Video"
    },
    password : {
        type : String,
        required : [true, "Password is required!"],
    },
    refreshToken : {
        type : String,
    },
 },{
    timrstamps : true,
 }
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 9);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (){
    jwt.sign({
        _id : this.is,
        name : this.name,
        username : this.username,
        fullname : this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })
};

userSchema.methods.generateRefreshToken = function (){
    jwt.sign({
        _id : this.is,

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    })
};

 module.exports = mongooes.model("User",userSchema);