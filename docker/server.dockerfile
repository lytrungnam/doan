FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY server/ ./

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

# Expose the port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]