let traits = require("./dict/traits");

module.exports = async (rWit, indexChat) => {
    let robotRes = "Disculpe no le entendi.";
    let resJson = {};
    let localTraits = await traits();
    for(var i=0; rWit["traits"].length>i; i++) {
        let nameTrait = rWit["traits"][i];
        if ( localTraits[nameTrait] ) {
            let single = localTraits[nameTrait];
            for(let u=0; rWit["wit"]["traits"][nameTrait].length>u; u++) {
                resJson = localTraits[nameTrait]
                    [rWit["wit"]["traits"][nameTrait][u]["value"]];
            }
        }
    }

    if ( Object.keys(resJson).length !== 0 ) {
        if ( false ) {
            robotRes = resJson["any"];
        } else {
            // let steps = resJson["steps"];
            // if ( steps && steps.length > indexChat ) {
            //     robotRes = resJson[steps[indexChat]];
            // } else {
            //     robotRes = resJson["despido"];
            // }
            robotRes = resJson["any"];
            
            if ( typeof robotRes === "string" ) {
                // No hacer nada
            } else if ( typeof robotRes === "function" ) {
                robotRes = robotRes();
            }
        }
    }

    return robotRes;
};