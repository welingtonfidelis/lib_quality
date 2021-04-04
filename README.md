# Lib_quality
Este projeto foi construído com o objetivo de permitir que um usuário obtenhar informações acerca de repoistórios públicos hospedados no github através de sua API pública ([GitHub_API]). Entre estas informações estão a quantidade de issues abertas, tempo médio em que foram criadas e quantidades de issues agrupadas por datas. A API, que consome dados da API do GitHub foi construída em [Node.js] com uso de [TypeScript] e [MongoDB] (através da biblioteca [Mongoose]).

## Requisitos
- [Node.js] - Node.js na versão 14 ou superior;
- [MongoDB] - Instância do banco de dados MongoDB;
- [GitHub Auth Token] - Para executar um conjunto maior de requisições na API do GitHub, é necessário um token de autenticação, que pode ser obtido através da documentção oficial [aqui];
- Cliente HTTP (OPCIONAL) - Um aplicativo cliente para requisições HTTP, como [Postman];
- [Docker] e [Docker-compose] (OPCIONAL) - O projeto possui possibilidade de ser executado em um container [Docker], juntamente com uma instância do banco [MongoDB].

## Instalação
Após clonar este projeto e tendo em mãos seu token pessoal do GitHub, existem duas formas de executar a API, descritas abaixo.

### Container Docker
Como apresentado na seção de Requisitos, este projeto possui a possibilidade de ser executado em um container. Pra isso, na raíz do projeto, encontre o arquivo `docker-compose.yml` e abra-o em qualquer editor de texto. Agora, encontre no arquivo a variável de ambiente com nome de `GITHUB_AUTH_TOKEN`, note que em seguida desta variável, existe um texto de exemplo, que deve ser substituído com seu [GitHub Auth Token], salve e feche o arquivo. Aindana raíz deste projeto, através de seu terminal de comandos e execute o seguinte comando *docker-compose up -d* e aguarde até que os containers sejam construídos e executados, disponibilizando o acesso à API no endereço **http://localhost:3001/api**.

### Em seu ambiente Node.js
Para executar o projeto em seu ambiente, é necessário criar um arquivo `.env` contendo as variáveis de ambiente necessárias pro funcionamento da API. Para isso, cri o arquivo `.env` dentro do diretório `src/enviroments/` seguindo o exemplo do arquivo `.env.example`. Agora, com terminal de comandos apontando para a raíz do projeto, execute o comando *npm install* para que as dependências necessárias sejam baixadas e em seguida, execute o comando *npm run dev* para que o projeto seja executado, disponibilizando o acesso à API no endereço **http://localhost:3001/api**.

É importante ressaltar que a porta em que a API é executada pode ser alterada no arquivo `src/server.ts` ou com a criação de uma variável de ambiente chamada **PORT** (container docker -> na seção **environment** do arquivo `docker-compose.yml`; Em seu ambiente -> no arquivo `src/enviroment/.env`).

## Utilização
Caso esteja utilizando o cliente HTTP [Postman], pode acessar [este link] para baixar uma coleção que contém as rotas disponíveis nesta API.

### <u>Issues em aberto</u>
**Tipo de requisição:** GET

**URL:** http://localhost:3001/api/repository/{owner}/{repository_name}/issues

**Parâmetros:** -

**Corpo:** - 

**Retorno:**
```json
{
    "status_code": 200,
    "message": "success",
    "data": {
        "repository": "webChatFront",
        "open_issues": 3,
        "open_issues_average_age": 2.6666666666666665,
        "open_issues_std_average": 0.9428
    }
}
```

### <u>Relatório das issues em aberto</u>
**Tipo de requisição:** GET

**URL:** http://localhost:3001/api/repository/issues/stats

**Parâmetros:** -

**Corpo:** - 

**Retorno:**
```json
{
    "status_code": 200,
    "message": "success",
    "data": {
        "repositories": [
            {
                "repository": "webChatFront",
                "issues": [
                    {
                        "created_at": "2021/04/01",
                        "open": 2,
                        "closed": 1
                    },
                    {
                        "created_at": "2021/03/31",
                        "open": 1,
                        "closed": 0
                    },
                    {
                        "created_at": "2020/12/12",
                        "open": 0,
                        "closed": 1
                    },
                    {
                        "created_at": "2020/12/08",
                        "open": 0,
                        "closed": 1
                    }
                ]
            }
        ]
    }
}
```

## Testes
É possível executar uma rotina de testes no projeto, construídos com [Jest]. Para isso, execute o comando *npm test* e aguarde a execução dos testes unitários e de integração.

```
> lib_quality@1.0.0 test /home/usertech/Documents/pessoal/lib_quality
> NODE_ENV=test jest -i

 PASS  src/__tests__/integration/ApiRepositoryIssuesStats.test.ts (8.204 s)
 PASS  src/__tests__/integration/ApiRepositoryIssues.test.ts
 PASS  src/__tests__/unity/repositories/RepositoryRepository.test.ts
 PASS  src/__tests__/unity/services/StandardDeviationService.test.ts
 PASS  src/__tests__/unity/services/PagesService.test.ts

Test Suites: 5 passed, 5 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        15.472 s
Ran all test suites.
```

## Contato
welingtonfidelis@gmail.com
<br>
Sugestões e pull requests são sempre bem vindos 🤓 

License
----

MIT

**Free Software, Hell Yeah!**

[GitHub_API]: <https://docs.github.com/en/rest>
[Node.js]: <https://nodejs.org/en/>
[TypeScript]: <https://www.typescriptlang.org/>
[MongoDB]: <https://www.mongodb.com/>
[Mongoose]: <https://mongoosejs.com/>
[Docker]: <https://docs.docker.com/get-started/>
[Docker-compose]: <https://docs.docker.com/compose/install/>
[GitHub Auth Token]: <https://docs.github.com/pt/github/authenticating-to-github/creating-a-personal-access-token> 
[aqui]: <https://docs.github.com/pt/github/authenticating-to-github/creating-a-personal-access-token>
[Postman]: <https://www.postman.com/downloads/>
[Jest]: <https://jestjs.io/>
[este link]: <https://www.getpostman.com/collections/4d56c60a3482a06d4672>