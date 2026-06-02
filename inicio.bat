@echo off
title Iniciador de Proyecto Neon
color 0A

:: 1. Verificar si Node.js está instalado
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js no esta instalado en esta computadora.
    echo [!] Abriendo la pagina de descarga de Node.js...
    start https://nodejs.org/
    echo.
    echo Por favor, instala Node.js (se recomienda la version LTS) y vuelve a ejecutar este archivo.
    pause
    exit
)

:: 2. Si Node existe, instalar dependencias faltantes
echo [^] Node.js detectado correctamente.
echo [^] Instalando/Actualizando librerias necesarias...
call npm install

:: 3. Iniciar el servidor automáticamente
echo.
echo [🚀] Arrancando el servidor de Node.js...
echo [💡] Una vez encendido, abre en tu navegador: http://localhost:3000
echo ------------------------------------------------------------------
node server.mjs

pause