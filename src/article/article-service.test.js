const articleService = require('./article-service');

// CONFIGURATION MONGO
/*
const mongooseConfig = require('../mongoose-config');

test('Etablir la connexion', async () => {

    // lancer la connection à notre base
    await mongooseConfig.connectToDatabase();

    // Assert -> tester que le code metier = 200
    expect(true).toBe(true);
});
*/

test('Tester la liste des articles fonctionne', async () => {

    const responseApi = await articleService.getAllArticles();

    // Assert -> tester que le code metier = 200
    expect(responseApi.code).toBe("200");
});

test('Tester que article avec un id non valide retourne bien code d erreur', async () => {

    // Je test quand l'id nexiste pas (donc un guard clause)
    let responseApi = await articleService.getArticleById("358");
    // Assert -> tester que le code metier = 702 
    expect(responseApi.code).toBe("702");


    // Je test quand l'id existe il rentre pas dans le if
    responseApi = await articleService.getArticleById("1");
    expect(responseApi.code).toBe("200");
});

