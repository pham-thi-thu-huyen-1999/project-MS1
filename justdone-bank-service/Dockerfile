FROM node:9.10
WORKDIR /app
ARG SSH_KEY
ENV NODE_ENV=Development

RUN mkdir /root/.ssh/

COPY id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa && rm -f id_rsa
RUN ssh-keyscan -T 60 bitbucket.org >> /root/.ssh/known_hosts
COPY . .
RUN apt update && apt install build-essential -y

RUN npm install
RUN npm install justdone-system-package
#RUN npm run build
RUN ./node_modules/.bin/grunt build

CMD ["node", "./dest/server.js"]



