FROM node:22-alpine

# Environment Type
ENV NODE_ENV=production

# pdftoppm (poppler-utils) renders archived issue covers from their PDFs,
# font-liberation stands in for fonts a PDF uses without embedding (Helvetica, Arial, Times)
RUN apk add --no-cache poppler-utils font-liberation

# Sets working directory of this container
WORKDIR /app

# Install dependencies (dev)
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Copy website files to the container
COPY . .

# Command to run (when deploying to prod, no need to restart for changes)
CMD ["node", "index.js"]
