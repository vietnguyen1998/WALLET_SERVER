
var sendSMS = require('../sendSMS')

let storeOTP ={}


const timeExpried = 40000 ; // 40s

const random6Digits = () =>{
    return 100000 + Math.floor(Math.random() * 900000);
}


const cleanUpStore = async () => {
	const now = new Date();

	Object.entries(storeOTP).forEach(([key, value]) => {

		if(now > value.expireTime)
			delete storeOTP[key];
	});
};

//get Password
const getPassword = async ({ phone }) => storeOTP[phone];

//delete OTP
const deleteOTP = async ({ phone }) => delete storeOTP[phone];

const createOTP = async (idPhone,phone) => {
        
		let otp = random6Digits();
		
		// sendSMS.sendSMS(phone,`Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Mã OTP là ${randomOTP}. Thời hạn của tin là 5 phút`);

		const OTPdata = {
			idPhone,
			phone, otp,
			expireTime:  new Date(new Date().valueOf() + timeExpried),
		};

		storeOTP[phone] = OTPdata;

		return OTPdata;
};

const verifyOTP = async ( phone,uniqueId, OTP ) => { 

	const stored= storeOTP[phone];

    if(stored && OTP == stored.otp && uniqueId == stored.idPhone &&  (new Date() < stored.expireTime)){

		// deleteOTP(phone);
        return true;
    }else {
        return false;
    }
    
};


module.exports = {
    createOTP,
	random6Digits,
	verifyOTP,
	cleanUpStore
};