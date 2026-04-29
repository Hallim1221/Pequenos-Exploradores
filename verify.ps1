# Script de Verificação - Pequenos Exploradores

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " 🧪 VERIFICAÇÃO DO SETUP" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# TESTE 1: Docker Instalado?
Write-Host "📋 TESTE 1: Docker Desktop" -ForegroundColor Yellow
Write-Host "─" * 40 -ForegroundColor Gray

$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerInstalled) {
    Write-Host "✅ Docker instalado" -ForegroundColor Green
    $dockerVersion = docker --version
    Write-Host "   $dockerVersion`n" -ForegroundColor Green
} else {
    Write-Host "❌ Docker NOT instalado" -ForegroundColor Red
    Write-Host "   Instale em: https://www.docker.com/products/docker-desktop`n" -ForegroundColor Red
    exit 1
}

# TESTE 2: Docker Rodando?
Write-Host "📋 TESTE 2: Docker Daemon" -ForegroundColor Yellow
Write-Host "─" * 40 -ForegroundColor Gray

$dockerPs = docker ps 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker está rodando`n" -ForegroundColor Green
} else {
    Write-Host "❌ Docker NOT está rodando" -ForegroundColor Red
    Write-Host "   Abra o Docker Desktop`n" -ForegroundColor Red
    exit 1
}

# TESTE 3: Container MySQL?
Write-Host "📋 TESTE 3: MySQL Container" -ForegroundColor Yellow
Write-Host "─" * 40 -ForegroundColor Gray

$mysqlContainer = docker ps --filter "name=pequenos-exploradores-db" --quiet
if ($mysqlContainer) {
    Write-Host "✅ MySQL container rodando" -ForegroundColor Green
    Write-Host "   Container ID: $mysqlContainer`n" -ForegroundColor Green
} else {
    Write-Host "⚠️ MySQL container NÃO está ativo" -ForegroundColor Yellow
    Write-Host "   Execute: docker-compose up -d`n" -ForegroundColor Yellow
    exit 1
}

# TESTE 4: Porta 3306?
Write-Host "📋 TESTE 4: Porta MySQL" -ForegroundColor Yellow
Write-Host "─" * 40 -ForegroundColor Gray

$portCheck = Test-NetConnection -ComputerName localhost -Port 3306 -WarningAction SilentlyContinue
if ($portCheck.TcpTestSucceeded) {
    Write-Host "✅ Porta 3306 respondendo`n" -ForegroundColor Green
} else {
    Write-Host "⚠️ Porta 3306 NÃO respondendo" -ForegroundColor Yellow
    Write-Host "   MySQL ainda está iniciando...`n" -ForegroundColor Yellow
    exit 1
}

# TESTE 5: Node.js Setup
Write-Host "📋 TESTE 5: Setup Script" -ForegroundColor Yellow
Write-Host "─" * 40 -ForegroundColor Gray

if (Test-Path "setup-db.js") {
    Write-Host "✅ setup-db.js encontrado" -ForegroundColor Green
    Write-Host "   Execute: node setup-db.js`n" -ForegroundColor Green
} else {
    Write-Host "❌ setup-db.js NÃO encontrado`n" -ForegroundColor Red
    exit 1
}

# Resumo
Write-Host "========================================" -ForegroundColor Green
Write-Host " ✅ TUDO PRONTO!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Próximo passo:" -ForegroundColor Cyan
Write-Host "  node test-setup.js" -ForegroundColor Yellow
Write-Host "`nOu inicie o servidor:" -ForegroundColor Cyan
Write-Host "  npm start`n" -ForegroundColor Yellow
