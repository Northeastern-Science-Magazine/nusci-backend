FROM node:18-alpine

# Environment Type
ENV NODE_ENV=production

# Sets working directory of this container
WORKDIR /app

# Install dependencies (dev)
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Copy website files to the container
COPY . .

# Command to run (when deploying to prod, no need to restart for changes)
CMD ["node", "index.js"]
