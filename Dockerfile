FROM node:22

WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Run Next.js in dev mode (hot reload)
CMD ["npm", "run", "docdev"]
