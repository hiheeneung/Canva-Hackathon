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
          required: ['name', 'city'],
          properties: {
            _id: {
              type: 'string',
              description: 'Route unique identifier'
            },
            userId: {
              type: 'string',
              description: 'User ID who created the route',
              default: 'guest'
            },
            name: {
              type: 'string',
              description: 'Route name'
            },
            city: {
              type: 'string',
              description: 'City name'
            },
            category: {
              type: 'string',
              description: 'Route category'
            },
            pins: {
              type: 'array',
              description: 'Array of pins along the route',
              items: {
                type: 'object',
                properties: {
                  name: { 
                    type: 'string',
                    description: 'Pin name'
                  },
                  lat: { 
                    type: 'number',
                    description: 'Latitude coordinate'
                  },
                  lng: { 
                    type: 'number',
                    description: 'Longitude coordinate'
                  },
                  note: {
                    type: 'string',
                    description: 'Pin note or description'
                  }
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
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
