const https = require("https");
const axios = require("axios");

const { makeDb } = require('mysql-async-simple');
var mysql = require('mysql');

const db = makeDb();
 

module.exports = async () => {
    return {
        "trato_dialogo": {
            "queja": {
                "any": "Sentimos que haya tenido un problema con el producto.",
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
            },
            "precio": {
                "any": async function(ints, ents) {
                    var connection = mysql.createConnection({
                        host : '192.168.0.104',
                        user : 'root',
                        port: 3377,
                        password : '123456',
                        database : 'pulparindo_db'
                       });
                    await db.connect(connection);
                    let productSpecific = ents.hasOwnProperty("e_producto_especifico:e_producto_especifico");
                    let rows;
                    let cabecera = "Lo siento no entendi tu consulta, pero te sugiero estos productos";
                    if ( productSpecific ){
                        let query = "desconocido";
                        if ( ents["e_producto_especifico:e_producto_especifico"].length > 0 ) {
                            cabecera = "Gracias por tu interes en nuestros productos, aqui tienes los precios:";
                            console.log("SQL::", query);
                            query = ents["e_producto_especifico:e_producto_especifico"][0]["value"];
                        }                        
                        rows = await db.query(connection, `SELECT * FROM products where name like '%${query}%' or tags like '%${query}%' limit 3`);
                    } else {
                        rows = await db.query(connection, 'SELECT * FROM products order by id limit 2');
                    }

                    let results = rows.map((e) => `<div class="product-price">
                        <a href="#" target="_blank">${e.name} <span class="coin">${e.price} PEN</span></a></div>`);
                    
                    await db.close(connection);

                    if ( results.length <= 0 ) {
                        return `Lo sentimos, no pudimos encontrar el producto que buscabas.`;
                    } else {
                        return `${cabecera} ${results.join("")}`;
                    }
                    
                    

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