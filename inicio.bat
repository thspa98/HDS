@echo off
title Iniciador Neon
echo ===================================
echo   VERIFICANDO ENTORNO DE NODEJS
echo ===================================
echo.

:: 1. Intentar ver la versión de Node
call node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js NO esta instalado en esta computadora.
    echo Abriendo la pagina de descarga oficial...
    timeout /t 3
    start https://nodejs.org/
    goto finalizar
)

echo [OK] Node.js detectado correctamente.
echo.
echo [INFO] Instalando librerias de package.json...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Hubo un problema al ejecutar npm install.
    goto finalizar
)

echo.
echo [OK] Librerias listas.
echo [🚀] Arrancando el servidor...
echo Abre en tu navegador: http://localhost:3000
echo ---------------------------------------------------
call node server.mjs

:finalizar
echo.
echo ---------------------------------------------------
echo El script ha terminado.
pause
