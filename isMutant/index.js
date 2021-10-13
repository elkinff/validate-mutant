const mysql = require('mysql');
const configDB = require('config.json');

const connection = mysql.createConnection({
    host: configDB.host,
    user: configDB.user,
    password: configDB.password,
    database: configDB.database
});


function insertAdn(adns, validateMutant) {
    let adnsHash = hashCode(adns.join());
    let isMutant = validateMutant ? 1 : 0;
    let isHuman = !validateMutant ? 1 : 0;
    
   return new Promise ((resolve, reject) => {
       let queryInsert = "INSERT INTO adn (adn, isMutant, isHuman) VALUES (?,?,?)";
       
       connection.query(queryInsert, [adnsHash, isMutant, isHuman],
            (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(err);    
                }
            }
        );
    });
}

function isMutant(adns){
    let isMutant = false;
    let adnsMatrix = adns.map(function(adn) {
        return adn.split('');
    });
    
    let numRows = adnsMatrix.length;
    let numColumns = adnsMatrix[0].length;
    let mutantsCount = 0;
    let mutantNumberSequence = 4;
    
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            let currentPosition = adnsMatrix[i][j];

            //Check horizontal axis
            if (numColumns - j >= mutantNumberSequence) {
                if (currentPosition == adnsMatrix[i][j+1] && 
                    currentPosition == adnsMatrix[i][j+2] && 
                    currentPosition == adnsMatrix[i][j+3]) 
                {
                    mutantsCount++;
                }
            }
            
            
            //Check vertical axis
            if (numRows - i >= mutantNumberSequence) {
                if (currentPosition == adnsMatrix[i+1][j] && 
                    currentPosition == adnsMatrix[i+2][j] && 
                    currentPosition == adnsMatrix[i+3][j]) 
                {
                    mutantsCount++;
                }
            }
            
            //Check rigth down oblique axis
            if (numColumns - j >= mutantNumberSequence && numRows - i >= mutantNumberSequence) {
                if (currentPosition == adnsMatrix[i+1][j+1] &&
                    currentPosition == adnsMatrix[i+2][j+2] && 
                    currentPosition == adnsMatrix[i+3][j+3]) 
                {
                    mutantsCount++;
                }
            }
            
            //Check left down oblique axis
            if (j > 2 && numRows - i >= mutantNumberSequence) {
                if (currentPosition == adnsMatrix[i+1][j-1] && 
                    currentPosition == adnsMatrix[i+2][j-2] && 
                    currentPosition == adnsMatrix[i+3][j-3]) 
                {
                    mutantsCount++;
                }
            }
        }
    }
    
    if (mutantsCount > 1) {
        isMutant = true;
    }
    
    return isMutant;
}

function hashCode (str) {
    let hash = 0;
    let char;
    
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    
    return hash;
}

function validateAdnEstructure(adns) {
    let adnsMatrix = adns.join();
    const regex = new RegExp(/^[A-T-C-G-,]*$/);
    
    return regex.test(adnsMatrix);
}

exports.handler = async (event, context) => {
    let responseCode = 400;
    let responseIsMutant = false;
    let isMutantMessage;
    
    if (event.body) {
        let body = JSON.parse(event.body);
        
        if (body.dna) {
            let adns = body.dna;
            if (validateAdnEstructure(adns)) {
                responseIsMutant = isMutant(adns);
                
                if (responseIsMutant) {
                    responseCode = 200;
                    isMutantMessage = 'El adn pertenece a un MUTANTE!';
                } else {
                    responseCode = 403;
                    isMutantMessage = 'El adn pertenece a un humano';
                }
                
                try {
                    await insertAdn(adns, responseIsMutant);
                } catch (e) {
                    console.log(e);
                }
            } else {
                isMutantMessage = 'La estructura del DNA no es válida, debe contener solo los caracteres A,T,C,G en mayúsculas';
            }
        } else {
            isMutantMessage = 'Mr Magneto el adn es obligatorio';
        }
    } else {
        isMutantMessage = 'Mr Magneto no se encontró el adn para validar al mutante';
    }
    
    return {
        statusCode: responseCode,
        body: JSON.stringify(
            {
                response: responseIsMutant,
                message: isMutantMessage
            }
        )
    };
};