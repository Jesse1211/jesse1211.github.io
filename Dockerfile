FROM node:18-alpine AS builder
WORKDIR /code/

# Copy NPM Packages to local
COPY package.json pnpm-lock.yaml tsconfig.json tsconfig.node.json vite.config.ts /code/
RUN npx pnpm install

# COPY the actual code to local
COPY public/ public/
COPY src/ src/
COPY index.html index.html
RUN npx pnpm build

EXPOSE 5100

# Serving with nginx
FROM nginx:1.25.3
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /code/dist /usr/share/nginx/html
RUN chown 1011:1011 -R /usr/share/nginx/html/
RUN chmod a+r -R /usr/share/nginx/html/
RUN chown 1011:1011 -R /var/cache/nginx
RUN chown 1011:1011 -R /etc/nginx
