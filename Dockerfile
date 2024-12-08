# Stage 1: Build
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm pkg set scripts.build="vite build --force"
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
EXPOSE 80
CMD ["/bin/sh", "-c", "envsubst '${BACKEND_IP}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
