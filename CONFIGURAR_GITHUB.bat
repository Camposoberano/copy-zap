@echo off
setlocal enabledelayedexpansion
echo ===========================================
echo   CONFIGURADOR GITHUB UNIVERSAL
echo ===========================================
echo.

echo 1. Verificando ambiente Git...
git init >nul 2>&1

:: Limpeza de arquivos problematicos do Windows
del /f /q "\\?\!cd!\nul" >nul 2>&1

echo.
echo 2. Configurando usuario (se necessario)...
git config --get user.email >nul
if %errorlevel% neq 0 (
    git config --local user.email "usuario@exemplo.com"
)
git config --get user.name >nul
if %errorlevel% neq 0 (
    git config --local user.name "Usuario GitHub"
)

echo.
echo 3. Preparando arquivos...
git add -A

echo.
echo 4. Criando salvamento inicial (commit)...
git commit -m "Upload inicial do projeto"

echo.
set /p repo_url="Deseja enviar para o GitHub agora? Cole o link .git aqui (ou ENTER para pular): "

if not "%repo_url%"=="" (
    echo.
    echo 5. Vinculando ao servidor remoto...
    git remote remove origin >nul 2>&1
    git remote add origin %repo_url%
    
    echo.
    echo 6. Enviando para o GitHub...
    git branch -M main
    git push -u origin main
    
    if !errorlevel! neq 0 (
        echo.
        echo Tentativa de push forcado em caso de conflitos...
        git push -f origin main
    )
)

echo.
echo ===========================================
echo   PROCESSO FINALIZADO!
echo ===========================================
pause
