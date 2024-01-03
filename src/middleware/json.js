//Função de conversção para json
export async function json(request,response){
    const buffers = []

    for await (const chunk of request){ //Acesso o paramêtro chunk da stream request, que é o trecho de código
        buffers.push(chunk) //Coloco tudo que recebo no array para armazenar todo o conteudo da stream
    }

    try {
        //Junto todo o contéudo do array e transformo em string
        //Em seguida, transformo para JSON e atribuo ao corpo da requisição
         request.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
         request.body = null
    }

    response.setHeader('Content-type', 'aplication/json')
}