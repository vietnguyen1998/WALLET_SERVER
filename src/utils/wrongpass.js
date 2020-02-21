
let listPhone = {}
const timeExpried = 60000; // 60s

const cleanUpStore = async () => {
    const now = new Date();
    Object.entries(listPhone).forEach(([key, value]) => {
        if (value.expireTime !== null)
            if (now > value.expireTime) {
                value.expireTime = null;
            }
    });
};

//delete OTP
const deletePhone = async ({ phone }) => delete listPhone[phone];

const addIntoBlackList = async (phone) => {
    const stored = listPhone[phone];
    let count = 1;
    if (stored) {
        ++count;
    }
    const data = {
        phone: phone,
        count: count,
        expireTime: new Date(new Date().valueOf() + timeExpried * count),
    };
    listPhone[phone] = data;
    return data;
};

const isInBlackList = async (phone) => {
    const stored = listPhone[phone];

    if (!stored) {
        return null
    }
    if (stored.expireTime) {
        // deleteOTP(phone);
        return stored.expireTime.valueOf();
    } else {
        return null;
    }

};


module.exports = {
    cleanUpStore, isInBlackList, deletePhone, addIntoBlackList
};