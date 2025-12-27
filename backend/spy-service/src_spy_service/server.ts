import fastify from 'fastify'
import cors from '@fastify/cors';

import {addHistory,getHistory} from './db/database'

const server = fastify()


await server.register(cors, {
  origin: '*'
});



server.get('/users/:id/history',async(req,res)=>{
  try{
    const {id}  = req.params as {id:string}
    const userId = Number(id);
  
    if (Number.isNaN(userId)) {
        return res.code(400).send({ error: 'Invalid user id' });
    }
    const data:any = await getHistory(userId)
    if (!data)
        return res.code(404).send({ message: 'No history found' });
    return res.code(200).send({ data });

  }
  catch(err)
  {
    return res.code(500).send({ error: `Server error : ${err}`  });
  }
})

server.post('/history',async(req,res)=>{
  try{
    const {user_id,role,result} = req.body as {
      user_id: number;
      role: string;
      result: string;
    };;
    if (!user_id || !role || !result) {
      return res.code(400).send({ error: 'Missing parameters' });
    }
    await addHistory(user_id,role,result)
    return res.code(200).send({ message: 'History added successfully' });
  }catch(err)
  {
    return res.code(500).send({error: `Server error : ${err}`});
  }
})






async function startServer() {
  await server.listen({ port: 3003, host: '0.0.0.0' });
  console.log("Server running on 0.0.0.0:3003");
}

startServer();