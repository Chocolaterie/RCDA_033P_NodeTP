const express = require('express');
const router = express.Router();
const authService = require('./auth-service');

router.post("/", async (request, response) => {
    // Si email / password invalide => erreur
    const loginRequest = request.body;

    const responseAPI = await authService.auth(loginRequest);

    return response.json(responseAPI);
});


// Exporter le router
module.exports = router;