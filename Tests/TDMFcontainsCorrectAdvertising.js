function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true && JSON.stringify(obj) === JSON.stringify({});
}

//Feed Default Object if not in "Postman Runner
if (isEmpty(data)) {
    data = {
        url: "mobileapp/device=tablet/homepage/pregames/nbc/main.json?timezone=gmt-7&localstation=wnbc",
        platform: "tablet",
        adv_section_id: "today_header_2",
        adv_unit_id: "/2620/olympics2016_app/notchromed/home_video/hub",
        adv_width: "728",
        adv_height: "90"
    };
}

function AdvertisingModel(unitId, width, heigth) {
    this.unitId = unitId;
    this.width = width;
    this.height = heigth;
    this.message;
}

function TdmfResponseModel(tdmf, isValid, errorMessage) {
    this.tdmf = tdmf;
    this.isValid = isValid;
    this.errorMessage = errorMessage;
    this.getAdvertisingForFooter = function (platform, advSectionId) {

        var advSections = this.tdmf.Sections.filter(function (obj) {
            return obj.ID == advSectionId;
        });

        if (advSections.length == 0) {
            return null;
        }

        try {
            var adv = advSections[0].Items[0].Extensions.Advertising.filter(function (obj) {
                return obj.Platform.toLowerCase() == platform.toLowerCase();
            });

            var unitId;
            var width;
            var height;

            if (adv.length > 0) {
                var platformAdv = adv[0];
                unitId = platformAdv.Parameters.unit_id;
                width = platformAdv.Parameters.size.width;
                height = platformAdv.Parameters.size.height;
            }

            return new AdvertisingModel(unitId, width, height);

        } catch (error) {
            return new AdvertisingModel(null, null, null);
        }

    };
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

    var adv = model.getAdvertisingForFooter(data.platform, data.adv_section_id);

    if (adv !== null) {
        tests["Adv [section: " + data.adv_section_id + "] Node Exist"] = true;

        if (adv.unitId == data.adv_unit_id) {
            tests["Adv [section: " + data.adv_section_id + "] UnitId Correct"] = true;
        }
        else {
            tests["Adv [section: " + data.adv_section_id + "] UnitId Correct [" + data.url + "] [expected: " + data.adv_unit_id + "] vs [actual:" + adv.unitId + "]"] = false;
        }

        if (adv.width == data.adv_width) {
            tests["Adv [section: " + data.adv_section_id + "] Width Correct"] = true;
        }
        else {
            tests["Adv [section: " + data.adv_section_id + "] Width Correct [" + data.url + "] [expected: " + data.adv_width + "] vs [actual:" + adv.width + "]"] = false;
        }

        if (adv.height == data.adv_height) {
            tests["Adv [section: " + data.adv_section_id + "] Height Correct"] = true;
        }
        else {
            tests["Adv [section: " + data.adv_section_id + "] Height Correct [" + data.url + "] [expected: " + data.adv_height + "] vs [actual:" + adv.height + "]"] = false;
        }
    }
    else {
        tests["Adv [section: " + data.adv_section_id + "] Node Exist [" + data.url + "]"] = false;
    }



}
else {
    tests["Feed [" + data.url + "] is not a valid TDMF: " + model.errorMessage] = false;
}

