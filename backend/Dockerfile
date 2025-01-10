FROM node:latest

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
COPY ../common-types ..

EXPOSE 5000

CMD ["npm", "start"]