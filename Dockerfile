# Etapa 1: Utiliza uma imagem base do Node.js
FROM node:20-alpine3.19 AS build

ARG APP_NAME
ARG APP_SERVICE_NAME
ARG JWTKEY
ARG DATABASE_URL
ARG LOG_LEVEL
ARG TOKEN_EXPIRATION

ARG AWS_REGION
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_BUCKET_NAME
ARG AWS_S3_BUCKET_URL

ARG COGNITO_USER_POOL_ID
ARG COGNITO_APP_CLIENT_ID
ARG COGNITO_APP_CLIENT_SECRET
ARG COGNITO_APP_URL_AUTHORITY


ENV APP_NAME=$APP_NAME
ENV APP_SERVICE_NAME=$APP_SERVICE_NAME
ENV JWTKEY=$JWTKEY
ENV DATABASE_URL=$DATABASE_URL
ENV LOG_LEVEL=$LOG_LEVEL
ENV TOKEN_EXPIRATION=$TOKEN_EXPIRATION

ENV AWS_REGION=$AWS_REGION
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_BUCKET_NAME=$AWS_BUCKET_NAME
ENV AWS_S3_BUCKET_URL=$AWS_S3_BUCKET_URL

ENV COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID
ENV COGNITO_APP_CLIENT_ID=$COGNITO_APP_CLIENT_ID
ENV COGNITO_APP_CLIENT_SECRET=$COGNITO_APP_CLIENT_SECRET
ENV COGNITO_APP_URL_AUTHORITY=$COGNITO_APP_URL_AUTHORITY

#Add global dependency
RUN apk add --no-cache bash
RUN apk --no-cache add curl

#Set Time Zone
ENV TZ=America/Sao_Paulo

#Create workdir
RUN mkdir -p /home/node/app

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /home/node/app

# Copiar apenas os arquivos essenciais para o build (melhora cache de camadas)
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o restante do código
COPY . .

# Compilar o projeto TypeScript para JavaScript
RUN npm run build

#Permission for exec
RUN chmod +x dist/main.js

# Definir uma variável de ambiente
ENV NODE_ENV production

# Expor a porta do servidor NestJS (ajuste conforme necessário)
EXPOSE 3000

#Exec
CMD [ "sh", "-c", "node ./node_modules/typeorm/cli.js migration:run --dataSource dist/shared/typeorm/datasource.js && node dist/main.js" ]
