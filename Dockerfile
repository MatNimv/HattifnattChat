## Build Environment
FROM node:16 AS build-env

# Build steps
ADD . /app
WORKDIR /app
# COPY package.json package*.json ./

RUN npm install
RUN npm run build

## Run Environment
FROM nginx:alpine
# Copy build artefacts
COPY --from=build-env /app/build /usr/share/nginx/html
COPY /nginx/nginx.config /etc/nginx/conf.d/default.conf