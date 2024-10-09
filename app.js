// Import le module express
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { v4 : uuidv4 } = require('uuid');

const articleService = require('./article/article-service');

// La clé jwt
const SECRET_JWT = "6692ee839f34e5be13d4f5af1f8a2f5e292e29f95642e506641c0024715689fa1d9a77a29266c832ef0ac7d1adf781b29f40020a81d09cf5cf76106d1cdaf9900729cfddf1537af7438b85c064dbe67a5d0dd9d035202aeba957cb16be0d1afd21747ebe5757fc79c53c3ff6b35cf83805bc9bcdf4a53a016915a75bb4847b90ea566d7a92552382ec877f9d309847f6c3fb70cbd42ba6ab4384cb559614f2827a620555ae0cdc34c31f88ce6464637a9617b8e823ab7d62f55ea93fe835b6f5047d9ec22ff7c6f07bb24c503bcfd83f7eef2c626741f8054075007d5fca4fe97a204db5de9be0eba809b8a68ec7ea111b1e60defc2bb7cb1d1f8cbf21cf7c81";

// CONFIGURATION MONGO
const mongooseConfig = require('./mongoose-config');

// lancer la connection à notre base
mongooseConfig.connectToDatabase();

// Importer mon modele Article
const Article = require('./article/article-model');
const User = mongoose.model("User", {email: String, password: String}, "users");

// instancier
const app = express();

// Autoriser à traiter les données qui sont dans le body de la requête
app.use(express.json());

// HELPERS/UTILITAIRE
function buildAPIResponse(code, message, data){
    // Log
    console.log(`Code : ${code} - Message : ${message}`);
    
    return { code : code, message: message, data: data };
}

function httpApiResponse(response, code, message, data) {
    return response.json(buildAPIResponse(code, message, data));
}

// Creer un middleware
function middlewareVerifyToken(request, response, next) {
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

// Creer les routes
app.post("/auth", async (request, response) => {
    // Si email / password invalide => erreur
    const loginRequest = request.body;

    // Trouver en base l'user 
    const loggedUser = await User.findOne({email : loginRequest.email, password: loginRequest.password});

    // Si pas trouvé
    if (!loggedUser){
        return httpApiResponse(response, "869", "Couple email/password incorrect", null);
    }

    const token = jwt.sign({ email: loggedUser.email }, SECRET_JWT, { expiresIn : '2 hours'});

    return httpApiResponse(response, "202", "Authentifié(e) avec succès", token);
});


// Injecter routes article
const articleRouter = require('./article/article-routes');

app.use('/article', articleRouter);


// Démarrer le server
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});