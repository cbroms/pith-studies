FROM node:latest

COPY frontend/ /static

WORKDIR /static 

RUN npm install 

RUN npm run build 

CMD [ "node", "__sapper__/build"]