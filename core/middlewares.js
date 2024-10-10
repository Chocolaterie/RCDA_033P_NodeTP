const jwt = require('jsonwebtoken');
const { httpApiResponse } = require('./http-library');
const { SECRET_JWT } = require('./config');

module.exports = {

    middlewareVerifyToken : (request, response, next) => {
        //const token = request.headers.authorization.split(" ")[1];
    
        // Verifier que le header authorization n'est pas null
        if (!request.headers.authorization){
            return httpApiResponse(response, "740", `Veuillez envoyer un token`, null);
        }
    
        const token = request.headers.authorization.substring(7);
        
        // Version 1 : Faux par defaut
        //let result = false;
        // Version 2 : Vrai par defaut
        let result = true;
        try { 
            jwt.verify(token, SECRET_JWT);
            // 1 : Quand ca marche c'est vrai
            //result = true;
        }
        catch (e){
            // Version 2 :: Si marche pas faux
            result = false;
        }
    
        // Erreur token invalide
        if (!result){
            return httpApiResponse(response, "756", `Le token n'est pas valide`, null);
        }
    
        return next();
    }

}