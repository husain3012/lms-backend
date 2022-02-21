var CryptoJS = require("crypto-js");

// Encrypt
const Encrypt = async function(Epassword){
    var ciphertext = await CryptoJS.AES.encrypt(Epassword, process.env.APP_SECRET).toString();
    return ciphertext.toString(CryptoJS.enc.Utf8);
}


// Decrypt
const Decrypt = async function (Dpassword) {
    var bytes  =await CryptoJS.AES.decrypt(Dpassword, process.env.APP_SECRET);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText
}

module.exports = { Encrypt, Decrypt };