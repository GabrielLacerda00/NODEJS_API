import http from 'node:http'
import { routes } from './routes.js'
import {json} from "./middleware/json.js"

const server = http.createServer(async(request,response) => {
    
    const {method, url} = request;
    
    await json(request,response)

    //Verifico se a rota e o path da requisição
    //condizem com os que tenho no arquivo de rotas
    const route = routes.find( route => {
        return route.method == method && route.path.test(url)
    })


    //Se existir a rota que requeri passo para o handler
    if (route) {
        const routeParams = request.url.match(route.path)

        const {query, ...params} = routeParams.groups
        
        request.params = params
        request.query = query ? extractQueryParams(query) : {}

        return route.handler(request,response)
    }
    
    return response.writeHead(404).end()
})

server.listen(7777)
