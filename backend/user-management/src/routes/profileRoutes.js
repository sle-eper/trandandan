import ProfileController from '../controllers/profile.controller.js';;

async function profileRoutes(fastify, options) {
  const profileController = new ProfileController(fastify.db);
  
  // Profile routes

  fastify.get('/profile/User',profileController.getUserBYemailorUsername.bind(profileController));
  
  fastify.post('/profile/create'
  // {
  //   schema: {
  //     body: {
  //       type: 'object',
  //       required: ['username', 'email', 'displayName', 'password'],
  //       properties: {
  //         username: { 
  //           type: 'string', 
  //           minLength: 3, 
  //           maxLength: 50,
  //           pattern: '^[a-zA-Z0-9_]+$'
  //         },
  //         email: { 
  //           type: 'string', 
  //           format: 'email',
  //           maxLength: 100
  //         },
  //         displayName: { 
  //           type: 'string', 
  //           minLength: 2, 
  //           maxLength: 50
  //         },
  //         password: { 
  //           type: 'string', 
  //           minLength: 8,
  //           maxLength: 128
  //         }
  //       }
  //     }
  //   }
  // }
  , profileController.setUser.bind(profileController));

  // Protected routes (require authentication)
  fastify.get('/profile', profileController.getMyProfile.bind(profileController));

  fastify.get('/profile/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer', minimum: 1 }
        }
      }
    },
  }, profileController.getUserProfile.bind(profileController));

  fastify.put('/profile', {
    schema: {
      body: {
        type: 'object',
        properties: {
          displayName: { type: 'string', minLength: 2, maxLength: 50 },
          bio: { type: 'string', maxLength: 500 },
          avatarUrl: { type: 'string', maxLength: 500 },
          email: { 
            type: 'string', 
            format: 'email',
            maxLength: 100
          }
        },
        additionalProperties: false
      }
    },
  }, profileController.updateProfile.bind(profileController));

  fastify.post('/profile/avatar', {
  }, profileController.uploadAvatar.bind(profileController));

  fastify.get('/profile/search', {
    schema: {
      querystring: {
        type: 'object',
        required: ['q'],
        properties: {
          q: { 
            type: 'string', 
            minLength: 2, 
            maxLength: 50
          }
        }
      }
    },
  }, profileController.searchUsers.bind(profileController));
}

export default profileRoutes;