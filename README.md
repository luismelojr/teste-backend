# [API] Backend

## Descrição

Boilerplate backend Patria Agronegocio.

* NodeJs
* NestJs
* Typescript
* Postgres

O projeto utiliza o NodeJS v20.
A infraestrutura é diponibilizada em contêiners Docker.

## Instalação do projeto


```bash
# Baixar dependencias do projeto
$ npm ci
# Subir a infra do projeto, banco de dados, rodar migrations e etc...
$ make start-dependencies
```

Criar arquivo com as váriaveis de ambiente utilizdas no projeto:
`.env.development` verifique arquivo de exemplo [.env](.env)

## Executando o app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testes

```bash
# unit tests
$ npm run test:unit

# test coverage
$ npm run test:cov

# integration tests
$ npm run test:integration

```

## Migrations

Gerar migrations

```bash
# Criar uma nova migration baseado nas entities e estado do banco de dados
$ npm run migration:generate --name=create-company-table
```

Executar migrations

```bash
# Rodar as migrations que ainda não rodaram para atualizar o banco de dados
$ npm run migration
```

## Projeto

### Diretórios:

- `contexts`: diretório que possui os contextos da aplicação, divididos nas
  camadas:
    - `interface`: responsável por toda interação com a aplicação (
      endpoints/controllers).
    - `application`: responsável pela comunicação entre a camada de interface e a
      camada de domínio, executando tarefas específicas como processamento de
      comandos, envio de consultas ao domínio e orquestração do fluxo de trabalho
      da aplicação. Não contém lógica de negócio, apenas coordena a sua execução.
    - `domain`: responsável pelas regras de negócio, contendo o modelo de domínio,
      agregados, eventos e serviços de domínio.
    - `infrastructure`: responsável por dar suporte às outras camadas, gerenciando
      a comunicação com bancos de dados, sistemas de mensageria, interfaces de
      rede, configuração de ORM e quaisquer outras tecnologias de suporte
      necessárias para o funcionamento da aplicação.
- `shared`: diretório onde se encontram arquivos de arquitetura e funcionamento
  geral, comuns a toda a aplicação.
- `config`: armazena arquivos de configurações da aplicação.
- `migrations`: contém scripts de migração do banco de dados.

## Gerando arquivos de um contexto

Para gerar os arquivos de um contexto automaticamente, podemos utilizar o script
contexts-files.js, executando o comando abaixo, substituindo a tag
<NOME-CONTEXTO> para o nome do contexto desejado em CamelCase seguindo o
exemplo: Person, OrganizationUnit.

```bashz
node ./scripts/generate/context-files.js <NOME-CONTEXTO>

Exemplo:
node ./scripts/generate/context-files.js OrganizationUnit
```

Após os arquivos serem gerados é nessário realizar alguns passos:

* Registrar o novo módulo no arquivo src/modules.ts

* Precisamos aplicar as correções de indentação (
  ESLint, Prettier) utilizando a IDE de sua preferência.

* Gerar a migration da entidade
    * npm run migration:generate --name=create-<NOME-TABELA>-table

* Registrar no arquivo src/shared/test-helpers/fixture-builder-container.ts o
  id da entity para o sistema de Fixture funcionar.


## Configurações

Para armazenar as configurações da aplicação localmente, crie um arquivo
chamado `.env.development` no diretório raiz do
projeto. Este arquivo deve seguir o formato `NOME_DO_AMBIENTE=VALOR`, onde cada
linha representa uma variável de
configuração e seu valor correspondente. Este arquivo está no .gitignore para
evitar que informações sensíveis sejam
incluídas no controle de versão.

Por favor, certifique-se de definir corretamente todas as configurações
necessárias, como chaves de API, credenciais de
banco de dados e configurações específicas do ambiente neste arquivo. Para a
execução local, a aplicação lerá essas
configurações em tempo de execução e as usará conforme necessário.

Para os ambientes de produção e staging, as configurações devem ser lidas de
variáveis de ambiente.

Observação: Mesmo para os ambientes de desenvolvimento local e testes é
importante manter estes arquivos e configurações
seguros e não compartilhá-lo publicamente ou com pessoas não autorizadas, pois
ele pode conter informações sensíveis que
comprometem a segurança da aplicação. Ou seja, trate-os com a mesma segurança
dos segredos de produção.

| Configuração     | Descrição                                                                                                                                                                                                                                                                                                                                                                                                         | Obrigatório | Padrão | Possíveis valores                          |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|--------|--------------------------------------------|
| APP_NAME         | Nome da aplicação, usado principalmente para registrar os logs da aplicação.                                                                                                                                                                                                                                                                                                                                      | Sim         |        | Qualquer string válida                     |
| APP_SERVICE_NAME | Nome do serviço, usado principalmente para registrar os logs da aplicação. É importante setar apenas nos casos onde o tráfego é dividido pelo proxy reverso para diferenciar grupos de instâncias da mesma aplicação que processam requests diferentes. É um caso incomum, usado principalmente em aplicações grandes e que recebem muito tráfego. Quando nenhum valor é setado assume o mesmo valor do APP_NAME. | Não         |        | Qualquer string válida                     |
| DATABASE_URL     | URL do host do banco de dados.                                                                                                                                                                                                                                                                                                                                                                                    | Sim         |        |                                            |
| LOG_LEVEL        | Utilizada para configurar o nível de detalhe dos registros de log.                                                                                                                                                                                                                                                                                                                                                | Não         | `log`  | `error`, `warn`, `log`, `debug`, `verbose` |
| NODE_ENV         | Ambiente de execução do NODE. Evite usar essa configuração para habilitar ou desabilitar comportamentos na aplicação. Prefira criar variáveis de configuração específicas para os comportamos que quiser habilitar ou desabilitar.                                                                                                                                                                                | Não         |        | `development`, `production`, `test`        |

```bash
# Exemplo de .env.development
APP_NAME=api
APP_SERVICE_NAME=api
JWTKEY=$secret
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/api_dev
LOG_LEVEL=http
```
