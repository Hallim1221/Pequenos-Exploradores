@echo off
REM Script para iniciar MySQL com Docker

echo.
echo ========================================
echo  Pequenos Exploradores - Docker Setup
echo ========================================
echo.

REM Verifica se Docker está instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo [X] Docker NÃO está instalado!
    echo.
    echo Instale Docker Desktop em: https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo [OK] Docker encontrado!
echo.

REM Inicia o Docker Compose
echo [*] Iniciando MySQL...
docker-compose up -d

if errorlevel 1 (
    echo [X] Erro ao iniciar Docker Compose
    pause
    exit /b 1
)

echo.
echo [OK] MySQL iniciando...
echo [*] Aguardando 30 segundos para o MySQL estar pronto...
echo.

REM Aguarda 30 segundos
timeout /t 30 /nobreak

echo.
echo [*] Testando conexão...
node setup-db.js

if errorlevel 1 (
    echo.
    echo [!] Erro na conexão. Verifique:
    echo    1. Docker Desktop está aberto?
    echo    2. Docker Compose subiu corretamente?
    echo.
    echo Logs:
    docker-compose logs mysql
    pause
    exit /b 1
)

echo.
echo ========================================
echo  [OK] SETUP COMPLETO!
echo ========================================
echo.
echo Servidor pronto para rodar:
echo   npm start
echo.
echo Acesse: http://localhost:3000
echo.
pause
