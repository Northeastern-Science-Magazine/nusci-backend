FROM node:18-alpine
ENV NODE_ENV=production

#Sets working directory of this container
WORKDIR /app

#Install dependencies (dev)
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

#Copy website files to the container
COPY . .

#Command to run
CMD ["node", "index.js"]
