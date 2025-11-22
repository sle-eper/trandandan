// import  UserModule  from '../modules/user.module.js';
// import  UserController  from '../controllers/user.controller.js';

// async function userRoutes(fastify,options){
    
//     console.log('🔍 In userRoutes:');
//     console.log('  - fastify.db exists:', !!fastify.db);
//     console.log('  - fastify.db type:', typeof fastify.db);
//     console.log('  - fastify.db has prepare:', typeof fastify.db?.prepare);

//     const userModule = new UserModule(fastify.db);
//     const userController = new UserController(userModule);
    
  
//     fastify.get('/:id', {
//         schema: {
//             params: {
//                 type: 'object',
//                 required: ['id'],
//                 properties: {
//                     id: { type: 'integer', minimum: 1 }
//                 }
//             }
//         }
//     }, userController.getById.bind(userController));

//     // Create new user with body validation
//     fastify.post('/newUser', {
//         schema: {
//             body: {
//                 type: 'object',
//                 required: ['email', 'username', 'password'],
//                 properties: {
//                     email: { 
//                         type: 'string', 
//                         format: 'email',
//                         maxLength: 100
//                     },
//                     username: { 
//                         type: 'string', 
//                         minLength: 3, 
//                         maxLength: 50,
//                         pattern: '^[a-zA-Z0-9_]+$'
//                     },
//                     password: { 
//                         type: 'string', 
//                         minLength: 8,
//                         maxLength: 128
//                     }
//                 }
//             }
//         }
//     }, userController.setUser.bind(userController));

  
//     fastify.put('/updateUser', {
//         schema: {
//             body: {
//                 type: 'object',
//                 required: ['id'],
//                 properties: {
//                     id: { type: 'integer', minimum: 1 },
//                     username: { 
//                         type: 'string', 
//                         minLength: 3, 
//                         maxLength: 50,
//                         pattern: '^[a-zA-Z0-9_]+$'
//                     }
//                 }
//             }
//         }
//     }, userController.updateUser.bind(userController));

   
//     fastify.delete('/deleteUser', {
//         schema: {
//             body: {
//                 type: 'object',
//                 required: ['id'],
//                 properties: {
//                     id: { type: 'integer', minimum: 1 }
//                 }
//             }
//         }
//     }, userController.deleteUser.bind(userController));

//     // Get all users (no body validation needed)
//     fastify.get('/all', userController.getAllUsers.bind(userController));
// }
// export default  userRoutes ;