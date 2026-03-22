@echo off
cd /d "%~dp0"
echo Instalando dependencias...
call npm install
echo Iniciando ElaOS en Modo Kiosco (Desarrollo)...
call npm run electron:dev
pause
