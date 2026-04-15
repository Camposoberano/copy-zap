@echo off
echo ===========================================
echo   SALVANDO ALTERACOES NO GITHUB
echo ===========================================
echo.
echo 1. Preparando arquivos...
git add .
echo.
echo 2. Registrando mudancas...
set /p msg="Digite uma mensagem para este salvamento (ou aperte ENTER para 'Sincronizacao'): "
if "%msg%"=="" set msg=Sincronizacao automatica
git commit -m "%msg%"
echo.
echo 3. Enviando para o GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo Houve um problema ao enviar. 
    echo Tentando resolver baixando mudancas do servidor primeiro...
    git pull origin main --rebase
    git push origin main
)
echo.
echo ===========================================
echo   SALVO COM SUCESSO!
echo ===========================================
pause
