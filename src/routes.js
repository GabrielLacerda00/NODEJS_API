import { Database } from "./database.js";
import { randomUUID } from "crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database()

export const routes = [
    {
        method: "POST",
        path:  buildRoutePath("/tasks"),
        handler: (request,response) => {
            //Primeiro: Pegar as informações que tenho
            //na minha request
            const {title,
                description,
                } = request.body
            

            if (!title) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'title is required' }),
                )
            }
            
            if (!description) {
                return res.writeHead(400).end(
                    JSON.stringify({message: 'description is required' })
                )
            }     
            //Crio um objeto com as informações que o compõem
           
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date().toLocaleDateString(),
                updated_at: new Date().toLocaleDateString(),
            }
            //Passo para meu Banco de Dados
            database.insert('tasks',task)
            return response.writeHead(201).end()
        }
    },
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (request,response) => {
            //Quero fazer uma busca
            const {search} = request.query
            //Vejo se minha busca existe
            const tasks = database.select('tasks', search ? {
                title: search,
                description: search,
                completed_at: search,
                created_at: search,
                updated_at: search,
            }: null)
            
            return response.end(JSON.stringify(tasks))
        }
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (request,response) => {
            const {id} = request.params
            const [task] = database.select('tasks', { id })
            if(!task){
                return res.writeHead(404).end()
            }
            database.delete('tasks',id)
            return response.writeHead(204).end()
        }
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (request, response) => {
            const { id } = request.params
            const { title, description } = request.body
      
            if (!title && !description) {
              return response.writeHead(400).end(
                JSON.stringify({ message: 'title or description are required' })
              )
            }
      
            const [task] = database.select('tasks', { id })
      
            if (!task) {
              return response.writeHead(404).end()
            }
      
            database.update('tasks', id, {
              title: title ?? task.title,
              description: description ?? task.description,
              updated_at: new Date().toLocaleDateString()
            })
      
            return response.writeHead(204).end()
          }
    },
    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/complete"),
        handler: (request,response) => {
            //Primeiro pego o ID da task
            const {id} = request.params
            //Pego a task, no meu database
            const task = database.select('tasks', {id})
            
            if (!task) {
                return res.writeHead(404).end()
            }
            
            const isCompleted = !!task.completed_at
            const completed_at = isCompleted ? null : new Date().toLocaleDateString()
            
            database.update('tasks',id,{completed_at})
            return response.writeHead(204).end()
        }
    }
]