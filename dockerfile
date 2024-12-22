# Use the Node.js 20 base image for the build stage
FROM node:20 as build-stage

# Step 2: Prepare the Backend
WORKDIR /app/backend-server

# Copy backend files
COPY backend-server/package*.json ./
COPY backend-server/ ./

# Install backend dependencies
RUN npm install

# Final stage: Running the Backend
FROM node:20

# Set working directory in the final image
WORKDIR /app/backend-server

# Copy backend files and frontend build from the build stage
COPY --from=build-stage /app/backend-server ./

# Expose the port the Express server listens on
EXPOSE 8082

# Start the server
CMD ["npm", "start"]

ENV NODE_ENV=test
