const https = require("https");
const axios = require("axios");

module.exports = async () => {
    return {
        "trato_dialogo": {
            "queja": {
                "saludo": "Sentimos que haya tenido un problema con el producto.",
                "despido": "Gracias por contactarnos, estaremos mejorando nuestra atencion."
            }, 
            "dialogar": {
                "any": "Gracias por escribirnos, soy Nadia y le ayudare!",
                "despido": "Gracias por escribirnos, nos vemos pronto."
            }
        },
        "trato_buscar": {
            "producto_en_general": {
                "steps": ["saludo", 
                    "top_productos", 
                    "despido"],
                "saludo": "Se sugiero comprar gorritos de lana de esta temporada.",
                "despido": "Gracias por escribirnos, avisenos si desea algo mas.",
                "any": async function(ints, ents) {
                    // Aqui consultar a mysql
                    // Consultar a una API
                    let {data} = await axios.get("https://fipo.equisd.com/api/products.json");
                    let result = (data["objects"].slice(0, 3).map((e) => {
                        return `<div class="product-item"><a target="_blank" href='https://google.com'><img width="32" src='${e.avatar}'> ${e.name}</a></div>`;
                    })).join("");
                    return `Claro, puedo sugerirte los siguientes productos: ${result}`;
                }
            }
        },
        "trato_track": {
            "orden": {
                "any": async function(ints, ents) {
                    let ordenSpecific = ents.hasOwnProperty("e_orden_especifico:e_orden_especifico");
                    let ordenCode = undefined;
                    if ( ordenSpecific ) {
                        if ( ents["e_orden_especifico:e_orden_especifico"].length > 0 ) {
                            ordenCode = ents["e_orden_especifico:e_orden_especifico"][0]["value"];
                            return `<a style="color: white" target="_blank" 
                                href="https://wwwapps.ups.com/WebTracking/track?trackNums=${ordenCode}&requester=ST/trackdetails">Pincha aqui para seguir tu orden.</a>`;
                        }
                        
                        // llamar a la API
                    }

                    return "Por favor indicame el numero de tu orden ->";
                }
            }
        }
    }
};