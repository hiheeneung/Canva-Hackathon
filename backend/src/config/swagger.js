const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Canva Hackathon API',
      version: '1.0.0',
      description: 'API documentation for Canva Route Planner project',
      contact: {
        name: 'API Support',
        email: 'support@canva-hackathon.com'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Route: {
          type: 'object',
          required: ['name', 'city', 'creator'],
          properties: {
            _id: {
              type: 'string',
              description: 'Route ID'
            },
            name: {
              type: 'string',
              description: 'Route name'
            },
            description: {
              type: 'string',
              description: 'Route description'
            },
            points: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  lat: { type: 'number' },
                  lng: { type: 'number' },
                  name: { type: 'string' }
                }
              }
            },
            city: {
              type: 'string',
              description: 'City name'
            },
            creator: {
              type: 'string',
              description: 'Creator name'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const specs = swaggerJSDoc(options);

module.exports = specs;
