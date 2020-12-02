
FROM node:14.8.0-alpine3.12

WORKDIR /app
ADD index.js /app/index.js
ADD package.json /app/package.json
RUN npm install


EXPOSE 4321

CMD node /app/index.js
