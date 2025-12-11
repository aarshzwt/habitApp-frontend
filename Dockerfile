# FROM node:22

# WORKDIR /src

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 3000

# # Run Next.js in dev mode (hot reload)
# CMD ["npm", "run", "docdev"]


# --- Build Stage ---
FROM node:18 AS builder
WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Run Stage ---
FROM node:18-alpine
WORKDIR /src

COPY --from=builder /src ./

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://grayce-unvitriolized-rachael.ngrok-free.dev/api/
ENV DOCKER='true'

EXPOSE 3000
CMD ["npm", "start"]
