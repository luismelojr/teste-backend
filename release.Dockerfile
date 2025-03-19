# Transpilation stage
FROM node:20-alpine3.19 AS transpile

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .
RUN npm run build

# Release stage
FROM node:20-alpine3.19 AS release

WORKDIR /usr/src/app

# Copy needed files from previous stage
COPY --from=transpile /usr/src/app/dist ./dist
COPY package*.json ./
COPY .env ./

# Install app production dependencies
RUN npm ci --only=production

USER node

CMD [ "node", "dist/main.js" ]
