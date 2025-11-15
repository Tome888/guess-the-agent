FROM node:20-bullseye

WORKDIR /app

COPY BE/package*.json ./
RUN npm install --build-from-source
COPY BE/ ./

EXPOSE 5000

CMD ["node", "server.js"]