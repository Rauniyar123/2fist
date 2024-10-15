/*............import dependancies.........*/
const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
	uniqueName:{
		type:String,
	},
	
	userName:{
		type:String,
	},
	email:{
		type:String,
	},
	fcmId:{
		type:String,
	},
	password:{
		type:String
	},
	countryName:{
		type:String
	},
	
	userProfile:{
		type:String
	},
	userReferralCode:{
		type:String
	},
	
	userWallet:{
		type:Number,
	    default:0,
	},
	userStatus:{
		type:Number,
	    default:0,
	},
	
	activeStatus:{
		type:Number,
	    default:0,
	},
	
	gender:{
		type:String,
		
	},
	

},{timestamps:true});


/*.............exports userSchema from here............*/
module.exports =userModel=mongoose.model("user",userSchema);