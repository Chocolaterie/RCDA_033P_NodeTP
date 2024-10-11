const mongoose = require('mongoose');

module.exports = {

    /**
     * Fonction centraliser pour etablir la connection à la base
     */
    connectToDatabase : async () => {
        // Afficher un message quand connectioné avec succès
        mongoose.connection.once('open', () => {
            console.log(`Connecté(e) à la base`);
        });

        // Afficher message erreur si pas connecté
        mongoose.connection.on('error', () => {
            console.log(`Erreur de connection à la base`);
        });

        // Connecte à la bdd
        await mongoose.connect("mongodb://127.0.0.1:27017/db_article");
    }
}
