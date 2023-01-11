const {Wit, log} = require("node-wit");

const witClient = new Wit({
    accessToken: "OFIMNCS6ACD5CCMRDZNMPROG6JDT3PDF",
    logger: new log.Logger(log.DEBUG)
});

module.exports = async(msg) => {
    let response = await witClient.message(msg);
    // console.log("xxxxxxx", response);
    let witTraits = [];
    let witTraitsVal = [];
    let witIntents = [];
    let witEntities = [];
    for(let t in response["traits"]) {
        witTraits.push(t);
        witTraitsVal.push(`${t}->[${response["traits"][t].map(i => i["value"])}]`);
    }
    for(let t in response["entities"]) {
        witEntities.push(t);
    }
    witIntents = response["intents"].map(e => e["name"]);

    return {
        "traits": witTraits,
        "traitsVal": witTraitsVal,
        "intents": witIntents,
        "entities": witEntities,
        "wit": response
    }

};