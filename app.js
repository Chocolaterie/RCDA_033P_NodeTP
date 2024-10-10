// Import le module express
const express = require('express');

// CONFIGURATION MONGO
const mongooseConfig = require('./mongoose-config');

// lancer la connection à notre base
mongooseConfig.connectToDatabase();

// instancier
const app = express();

// Autoriser à traiter les données qui sont dans le body de la requête
app.use(express.json());

// Injecter routes article
const articleRouter = require('./article/article-routes');
app.use('/article', articleRouter);

// Injecter routes auth
const authRouter = require('./auth/auth-routes');
app.use('/auth', authRouter);

// Démarrer le server
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});