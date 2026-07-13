FROM docker.m.daocloud.io/library/node:18-alpine AS builder

WORKDIR /app

COPY package.json ./

RUN npm config set registry https://registry.npmmirror.com && npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM docker.m.daocloud.io/library/nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
