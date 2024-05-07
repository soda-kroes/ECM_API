
exports. KEY_TOKEN = "dkfjsfkjskd&dkfsdfisdfkjksdfsjdfjsdfhsdjfgufgksjfgsdhgfskdjfnskl"
exports.REFRESH_KEY = "342080!@DCFS23;ksdfkq23po9[f323@$@#$@#$@$#@#$@#$sjdflajlkjsaf"

exports. isEmptyOrNull = (value) =>{
    if(value == null || value == "" || value == undefined){
        return true
    }else{
        return false
    }
}

exports.invoinceNumber = (number) => {
    var str = "" + (number+1);
    var pad = "INV0000";
    var invoice = pad.substring(0, pad.length - str.length) + str;
    return invoice; // Returns INV0001, INV0002, INV19999, etc.
  };