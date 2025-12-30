import ProfileController from '../controllers/profile.controller.js';;

async function profileRoutes(fastify, options) {
  const profileController = new ProfileController(fastify.db);

  // Profile routes

  fastify.get('/profile/User', profileController.getUserBYemailorUsername.bind(profileController));

  fastify.post('/profile/create',
  {
      schema: {
    body: {
      type: 'object',
      required: ['username', 'email', 'displayName'],
      properties: {
        username: {
          type: 'string',
          minLength: 3,
          maxLength: 50,
          pattern: '^[a-zA-Z0-9_ ]+$'
        },
        email: {
          type: 'string',
          format: 'email',
          maxLength: 100
        },
        displayName: {
          type: 'string',
          minLength: 2,
          maxLength: 50
        },
        password: {
          type: 'string',
          minLength: 8,
          maxLength: 128
        }
      }
    }
  }
}
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

  fastify.put('/profile/update', {
    schema: {
      body: {
        type: 'object',
        properties: {
          displayName: { type: 'string', minLength: 2, maxLength: 50 },
          bio: { type: 'string', maxLength: 500 },
          avatarUrl: { type: 'string' },
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

    fastify.get('/user/:id', profileController.getUser.bind(profileController));
    fastify.get('/User', profileController.getById.bind(profileController));
    fastify.post('/User/changePassword', profileController.changePassword.bind(profileController));
    fastify.get('/getAllUsers', profileController.getAllUsers.bind(profileController));
  

    // fastify.get('/user/:id', {
    //     schema: {
    //         params: {
    //             type: 'object',
    //             required: ['id'],
    //             properties: {
    //                 id: { type: 'integer', minimum: 1 }
    //             }
    //         }
    //     }
    // }, profileController.getById.bind(profileController));
  

  fastify.get('/User/two-factor-status', profileController.getTwoFactorStatus.bind(profileController));

  fastify.put('/User/enable-two-factor', profileController.enableTwoFactor.bind(profileController));
  fastify.put('/User/two-factor-secret', profileController.setsecretkeytwofactor.bind(profileController));
  fastify.get('/User/two-factor-secret', profileController.getsecretkeytwofactor.bind(profileController));
}
export default profileRoutes;