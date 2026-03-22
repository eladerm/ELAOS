@echo off
cd /d "%~dp0"
echo Instalando dependencias...
call npm install
echo Compilando el instalador .EXE de ElaOS...
call npm run electron:build
echo.
echo =======================================================
echo COMPILACION TERMINADA
echo El instalador .EXE se encuentra en la carpeta: dist_electron\
echo =======================================================
pause
