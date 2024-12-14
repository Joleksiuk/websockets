# Use the Node.js 20 base image for the build stage
FROM node:20 as build-stage

RUN update-ca-certificates

# Step 1: Build the Frontend
WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package*.json ./
COPY frontend/ ./

# Install frontend dependencies and build the static files
RUN npm install
RUN npm run build

# Step 2: Prepare the Backend
WORKDIR /app/backend-server

# Copy backend files
COPY backend-server/package*.json ./
COPY backend-server/ ./

# Install backend dependencies
RUN npm install

# Copy the frontend build to the expected location in the backend
RUN mkdir -p /app/backend-server/frontend/build
RUN cp -R /app/frontend/build/* /app/backend-server/frontend/build/

# Final stage: Running the Backend
FROM node:20

# Set working directory in the final image
WORKDIR /app/backend-server

# Copy backend files and frontend build from the build stage
COPY --from=build-stage /app/backend-server ./

# Expose the port the Express server listens on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
