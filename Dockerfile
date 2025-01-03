# Base image
FROM node:20

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy the .env and .env.development files
COPY .env ./

RUN npm run build

RUN npm run prisma:generate

# Expose the port on which the app will run
EXPOSE 8080

# Start the server using the production build
ENTRYPOINT [ "bash", "./scripts/docker-entrypoint-prod.sh" ]