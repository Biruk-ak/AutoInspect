FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm install --workspace=@autoinspect/api --workspace=@autoinspect/shared

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -w @autoinspect/shared && npm run build -w @autoinspect/api

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/main.js"]
