import fs from "node:fs/promises"

const databasePath = new URL("../db.json", import.meta.url)

export class Database{
    #database = {}

    constructor(){
        fs.readFile(databasePath,"utf-8")
        .then(data => {
                this.#database = JSON.parse(data)
            }
        )
        .catch(() => {
            this.#persist()
        })
    }

    #persist(){
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }
    
    insert(table,data){
        if (Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        }else{
            //Caso contrário, crio uma nova tabela com o dado
            this.#database[table] = [data]
        }
        this.#persist()
        return data
    }
    
    select(table,search){
        //Verifico se a no meu objeto database existe a chave table
        //Caso exista eu retorno, caso contrário retorna array vazio
        let data = this.#database[table] ?? []

        if (search){
            data = data.filter(row => {
                return Object.entries(search).some(([key,value]) => {
                    if (!value){
                        return true
                    } 

                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
        return data
    }
    
    delete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id == id)
        if(rowIndex > -1){
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    update(table,id,data){
        const rowIndex = this.#database[table].findIndex(row => row.id == id)
        if(rowIndex > -1){
            const row = this.#database[table][rowIndex]
            this.#database[table][rowIndex] = { id, ...row, ...data }
            this.#persist()
        }
    }
}