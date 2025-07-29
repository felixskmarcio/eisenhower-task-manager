# Dockerfile para Task Eagle Eye
# Imagem base do Node.js
FROM node:18-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY yarn.lock* ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Estágio de build
FROM base AS builder
WORKDIR /app

# Instalar todas as dependências (incluindo devDependencies)
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine AS production

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Labels para metadados
LABEL maintainer="Seu Nome <seu.email@exemplo.com>"
LABEL description="Task Eagle Eye - Gerenciador de tarefas baseado na Matriz de Eisenhower"
LABEL version="1.3.0"