const functions = require('firebase-functions');
var admin = require("firebase-admin");
admin.initializeApp();

exports.report = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', "*");
    res.set('Access-Control-Allow-Methods', 'POST');
    
    let result = await checkVueLogin(req.body.username, req.body.password);
    if (result.login) {
        let ref = admin.database().ref("/");
        let data = await ref.once("value");
        data = data.val();
        
        let linesplit = data.csv.split("\n");

        for (let line of linesplit) {
            if (line.includes(result.data.StudentInfo.PermID._text)) {
                for (let keyline of linesplit) {
                    if (keyline.split(",")[4] == "Answer Key") {
                        if (keyline.split(",")[7] == line.split(",")[7]) {
                            res.send({
                                login: true,
                                student: line,
                                key: keyline,
                                testname: data.name
                            });

                            return;
                        }
                    }
                }
            }
        }

        res.send({
            login: false,
            error: "Your test scores aren't available."
        });

        return;
    } else {
        res.send({
            login: false,
            error: "Login credentials invalid."
        });

        return;
    }
});

async function checkVueLogin(username, password) {
    const axios = require("axios");
    const client = axios.create({
        baseURL: "https://sis-hillsboro.cascadetech.org/hillsboro/Service/PXPCommunication.asmx"
    });
    const parse = require("xml-js");

    const parseOpts = {
        compact: true,
        trim: true,
        alwaysArray: [
            "EmergencyContact",
            "UserDefinedItem",
            "UserDefinedGroupBox",
            "TermListing",
            "TermDefCode",
            "ClassListing",
            "DistrictEventRecord",
            "HealthVisitListing",
            "HealthConditionsListing",
            "HealthImmunizationListing",
            "ImmunizationDate",
            "ReportPeriod",
            "Course",
            "Mark",
            "Assignment",
            "EventList",
            "Absence",
            "Period",
            "PeriodTotal"
        ]
    };

    let response = await client.post("/ProcessWebServiceRequest", {
        userID: username,
        password: password,
        skipLoginLog: true,
        parent: false,
        webServiceHandleName: "PXPWebServices",
        methodName: "StudentInfo",
        paramStr: parse.js2xml({
            Parms: {}
        }, {
            compact: true
        })
    });

    const js = parse.xml2js(response.data.d, parseOpts);

    if (js.hasOwnProperty("RT_ERROR")) {
        return {
            login: false,
            error: js.RT_ERROR._attributes.ERROR_MESSAGE
        };
    } else {
        return {
            login: true,
            data: js
        };
    }
}