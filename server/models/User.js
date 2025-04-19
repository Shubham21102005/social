const mongoose= require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    bio: {
        type:String
    },
    followers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      following: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ]
      
});

userSchema.pre('save', async function (next) {
    // Only hash if password is new or modified
    if (!this.isModified('password')) {
      return next();
    }
  
    try {
      // Hash the password with 10 salt rounds
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
  
      // Replace the plain password with the hashed one
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });

  
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
  

module.exports= mongoose.model('User', userSchema);
