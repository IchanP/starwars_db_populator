# TODO make it slim?
FROM node:22.14.0-slim
WORKDIR usr/src
COPY package.json package.json
RUN npm install
COPY . .
RUN apt-get update
RUN apt-get install -y openssl
RUN npx prisma generate
EXPOSE 4000
CMD ["npm", "run" ,"start"]