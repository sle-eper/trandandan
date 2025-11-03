
import  UserModule  from '../modules/user.module.js';
import  UserController  from '../controllers/user.controller.js';

async function userRoutes(fastify,options){
    
    console.log('🔍 In userRoutes:');
    console.log('  - fastify.db exists:', !!fastify.db);
    console.log('  - fastify.db type:', typeof fastify.db);
    console.log('  - fastify.db has prepare:', typeof fastify.db?.prepare);

    const userModule = new UserModule(fastify.db);
    const userController = new UserController(userModule);
    
    fastify.get('/:id', userController.getById.bind(userController));
    fastify.post('/newUser',userController.setUser.bind(userController));
    fastify.put('/updateUser',userController.updateUser.bind(userController));
    fastify.delete('/deleteUser',userController.deleteUser.bind(userController));
    fastify.get('/all',userController.getAllUsers.bind(userController));
}
export default  userRoutes ;