#!/usr/bin/env pwsh
# Script para verificar e preparar o projeto para deploy na Vercel

Write-Host "Verificando projeto para deploy na Vercel..." -ForegroundColor Green

# Verificar se o Node.js esta instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js nao encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o npm esta instalado
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm nao encontrado. Instale o npm primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "Node.js e npm encontrados" -ForegroundColor Green

# Verificar se package.json existe
if (!(Test-Path "package.json")) {
    Write-Host "package.json nao encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "package.json encontrado" -ForegroundColor Green

# Verificar se vercel.json existe
if (!(Test-Path "vercel.json")) {
    Write-Host "vercel.json nao encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "vercel.json encontrado" -ForegroundColor Green

# Verificar se .env.example existe
if (!(Test-Path ".env.example")) {
    Write-Host ".env.example nao encontrado" -ForegroundColor Yellow
} else {
    Write-Host ".env.example encontrado" -ForegroundColor Green
}

# Instalar dependencias
Write-Host "Instalando dependencias..." -ForegroundColor Blue
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao instalar dependencias" -ForegroundColor Red
    exit 1
}

Write-Host "Dependencias instaladas com sucesso" -ForegroundColor Green

# Testar build
Write-Host "Testando build de producao..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no build de producao" -ForegroundColor Red
    exit 1
}

Write-Host "Build de producao bem-sucedido" -ForegroundColor Green

# Verificar se a pasta dist foi criada
if (!(Test-Path "dist")) {
    Write-Host "Pasta dist nao foi criada" -ForegroundColor Red
    exit 1
}

Write-Host "Pasta dist criada com sucesso" -ForegroundColor Green

# Verificar se index.html existe na pasta dist
if (!(Test-Path "dist/index.html")) {
    Write-Host "index.html nao encontrado na pasta dist" -ForegroundColor Red
    exit 1
}

Write-Host "index.html encontrado na pasta dist" -ForegroundColor Green

# Verificar se Vercel CLI esta instalado
if (Get-Command vercel -ErrorAction SilentlyContinue) {
    Write-Host "Vercel CLI encontrado" -ForegroundColor Green
    
    Write-Host "Voce pode fazer deploy agora com:" -ForegroundColor Cyan
    Write-Host "   vercel" -ForegroundColor White
    Write-Host "   ou" -ForegroundColor White
    Write-Host "   vercel --prod" -ForegroundColor White
} else {
    Write-Host "Vercel CLI nao encontrado" -ForegroundColor Yellow
    Write-Host "Para instalar: npm i -g vercel" -ForegroundColor Blue
}

Write-Host ""
Write-Host "Checklist para deploy na Vercel:" -ForegroundColor Cyan
Write-Host "   Projeto configurado" -ForegroundColor Green
Write-Host "   Build testado" -ForegroundColor Green
Write-Host "   vercel.json configurado" -ForegroundColor Green
Write-Host "   Configure as variaveis de ambiente na Vercel" -ForegroundColor Yellow
Write-Host "   Conecte seu repositorio a Vercel" -ForegroundColor Yellow
Write-Host ""
Write-Host "Leia o arquivo DEPLOY_VERCEL.md para instrucoes detalhadas" -ForegroundColor Blue

Write-Host "Projeto pronto para deploy na Vercel!" -ForegroundColor Green