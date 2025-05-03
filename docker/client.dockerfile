FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY client/ ./

# Build the app for production
RUN npm run build

# Use nginx to serve the static files
FROM nginx:alpine

# Copy the build output to nginx
COPY --from=0 /app/build /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]