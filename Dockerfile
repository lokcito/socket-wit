FROM node:16.17.0

WORKDIR /usr/src/app

COPY . .

RUN npm ci 

EXPOSE 4000

CMD ["npm", "run", "start"]


