const articleService = require('./article-service');

test('Tester la liste des articles fonctionne', async () => {

    const responseApi = await articleService.getAllArticles();

    // Assert -> tester que le code metier = 200
    expect(responseApi.code).toBe("200");
});

test('Tester que article avec un id non valide retourne bien code d erreur', async () => {

    const responseApi = await articleService.getArticleById("358");
    
    // Assert -> tester que le code metier = 702 
    expect(responseApi.code).toBe("702");
});

