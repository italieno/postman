function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true && JSON.stringify(obj) === JSON.stringify({});
}

//Feed Default Object if not in "Postman Runner
if (isEmpty(data))
{
    data = {
        url: "mobileapp/device=tablet/homepage/pregames/nbc/main.json?timezone=gmt-7&localstation=wnbc",
        platform: "tablet",
        adv_section_id: "today_header_2",
        adv_unit_id: "/2620/olympics2016_app/notchromed/home_video/hub",
        adv_width: "728",
        adv_height: "90"
    };
}

function TdmfResponseModel(tdmf, isValid, errorMessage) {
    this.tdmf = tdmf;
    this.isValid = isValid;
    this.errorMessage = errorMessage;
};


var parseTdmf = function (jsonStr) {
    try {
        var tdmf = JSON.parse(jsonStr);
        return new TdmfResponseModel(tdmf, true, null);
    }
    catch (err) {
        return new TdmfResponseModel(tdmf, false, err.message);
    }
}

tests["Feed is Loaded"] = responseCode.code === 200;

var model = parseTdmf(responseBody)

if (model.isValid) {
    tests["Feed is a valid TDMF"] = true;
}
else {
    tests["Feed [" + data.url + "] is not a valid TDMF: " + model.errorMessage] = false;
}

