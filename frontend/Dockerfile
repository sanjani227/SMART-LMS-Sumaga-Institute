FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Pass build arg and set it as an env variable so Next.js can embed it in static traces
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the default port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
