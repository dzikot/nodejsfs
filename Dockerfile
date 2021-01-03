
FROM node:14.8.0-alpine3.12

WORKDIR /app
ADD index.js /app/index.js
ADD app.js /app/app.js
ADD package.json /app/package.json
ADD models/Users.js /app/models/Users.js
RUN npm install


EXPOSE 4321

CMD node /app/index.js
