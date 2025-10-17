

import  UserModule  from '../modules/user.module.js';
import bcrypt from 'bcryptjs';
 class UserController {

    constructor(userModule){
        this.userModule = userModule;
    }

    async getById(request, reply) {
        const {id} = request.params;
    try {

        const user = await  this.userModule.findById(id);

                
            if (!user) {
                return reply.code(404).send({
                    success: false,
                    error: 'User not found'
                });
            }
            return reply.code(200).send({
                sucess: true,
                data: user
            });
            
        } catch(err){
            return reply.code(500).send({
                success: false,
                error: 'Internal Server Error',
                message: 'Failed to retrieve user'
                
            });
        }
        
    }
    async setUser(request,reply){
        const{ email, username, password } = request.body;
        try {
            
            const passwordHash = await bcrypt.hash(password, 10);
            const userId = await this.userModule.create({
                email,
                username,
                passwordHash
            });

            const user = await this.userModule.findById(userId);

            return reply.code(201).send({
                success: true,
                data: user
            });

        }catch(err){
            request.log.error(err);
            return reply.code(500).send({
                error: 'Internal Server Error',
                message: 'Failed to create user'
            });
        }
    }

    async updateUser(request,reply){
        const{id, username } = request.body;
        try{

            const changes = await this.userModule.update({
                id,
                username
            })
            if (changes === 0) {
                return reply.code(404).send({
                    success: false,
                    error: 'User not found'
                });
            }
            const updatedUser = await this.userModule.findById(id);
        
            return reply.code(200).send({
                success: true,
                data: updatedUser
            });
        }catch(err){
            request.log.error(err);
            return reply.code(500).send({
                success: false,
                error: 'Internal Server Error',
                message: 'Failed to update user'
            });
        }
    
    }
    async deleteUser(request, reply) {
        const { id } = request.body;
        
        try {
            const changes = await this.userModule.delete(id);
         
            if (changes === 0) {
                return reply.code(404).send({
                    success: false,
                    error: 'User not found'
                });
            }
            
            return reply.code(200).send({
                success: true,
                message: 'User deleted successfully'
            });
            
        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({
                success: false,
                error: 'Internal Server Error',
                message: 'Failed to delete user'
            });
        }
    }
    
    async getAllUsers(request, reply) {
        try {
            const users = await this.userModule.findAll();
            
            return reply.code(200).send({
                success: true,
                data: users,
                count: users.length
            });
            
        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({
                success: false,
                error: 'Internal Server Error',
                message: 'Failed to retrieve users'
            });
        }
    }
}
export default  UserController ;