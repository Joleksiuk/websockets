# Build stage: Prepare the Backend
FROM node:20 as build-stage

# Set the working directory for the backend
WORKDIR /app/backend-server

# Copy package.json and package-lock.json for dependencies
COPY backend-server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend files
COPY backend-server/ ./

# Compile TypeScript to JavaScript
RUN npm run build

# Final stage: Running the Backend and Worker
FROM node:20

# Set the working directory in the final image
WORKDIR /app/backend-server

# Copy compiled JavaScript files from the build stage
COPY --from=build-stage /app/backend-server ./

COPY --from=build-stage /app/backend-server/dist ./dist
# Expose the port for the Express server
EXPOSE 8082

# Default command will start the server
CMD ["npm", "start"]

# Allow overriding the command for workers
ENV NODE_ENV=test
