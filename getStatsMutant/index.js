const mysql = require('mysql');
const configDB = require('config.json');

const connection = mysql.createConnection({
    host: configDB.host,
    user: configDB.user,
    password: configDB.password,
    database: configDB.database
});


function getCountMutantsOrHumans(typeAdn) {
    return new Promise ((resolve, reject) => {
        let queryStats = "SELECT count(id) as countMutant from adn where "+ typeAdn +" = 1";
        
        connection.query(queryStats,
            (err, result) => {
                if (!err) {
                    resolve(result[0].countMutant);
                } else {
                    reject(err);    
                }
            }
        );
    });
}

exports.handler = async (event) => {
    let response;
    
    try {
        let countMutant = await getCountMutantsOrHumans("isMutant");
        let countHuman = await getCountMutantsOrHumans("isHuman");
        let ratio = countMutant / countHuman;
        
        response = {
            statusCode: 200,
            body: {
                count_mutant_dna: countMutant,
                count_human_dna: countHuman,
                ratio: parseFloat(ratio.toFixed(2))
            },
        };
    } catch (e) {
        console.log(e);
    }
    

    return response.body;
};
