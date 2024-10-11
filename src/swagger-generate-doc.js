// Init swagger
const swaggerAutogenModule = require('swagger-autogen')({'openapi' : '3.0.0'});

const doc = {
    info : {
        title: 'Article API',
        description : 'API',
    },
    host: '127.0.0.1:3000',
    basePath: '/',
    schemes: ['http'],
    components: {
        securitySchemes:{
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }
};

// Le chemin de le generation des definitions swagger
const outputFile = "./swagger_output.json";

// les chemins ou sont developpées mes routes
const endpointFiles = ['./app.js'];

swaggerAutogenModule(outputFile, endpointFiles, doc);