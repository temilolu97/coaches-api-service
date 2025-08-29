FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project (including prisma and src)
COPY . .

# Generate Prisma client (will look in /app/prisma/schema.prisma)
RUN npx prisma generate

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["node", "src/index.js"]
