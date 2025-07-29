# Script para abrir automaticamente os consoles necessários
# Execute este script para abrir todas as páginas necessárias para configurar o Google Auth

Write-Host "Abrindo consoles para configuracao do Google Auth..." -ForegroundColor Green
Write-Host ""

# Definir o Project ID
$projectId = "eisenhower-task-manager-21787"

# URLs dos consoles
$firebaseAuthUrl = "https://console.firebase.google.com/project/$projectId/authentication/providers"
$firebaseSettingsUrl = "https://console.firebase.google.com/project/$projectId/authentication/settings"
$googleCloudCredentialsUrl = "https://console.cloud.google.com/apis/credentials?project=$projectId"

Write-Host "Abrindo Firebase Console - Authentication..." -ForegroundColor Yellow
Start-Process $firebaseAuthUrl

Start-Sleep -Seconds 2

Write-Host "Abrindo Firebase Console - Settings..." -ForegroundColor Yellow
Start-Process $firebaseSettingsUrl

Start-Sleep -Seconds 2

Write-Host "Abrindo Google Cloud Console - Credentials..." -ForegroundColor Yellow
Start-Process $googleCloudCredentialsUrl

Write-Host ""
Write-Host "Todos os consoles foram abertos!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "1. No Firebase Console - Authentication:" -ForegroundColor White
Write-Host "   - Clique no provedor Google" -ForegroundColor Gray
Write-Host "   - Ative o toggle Enable" -ForegroundColor Gray
Write-Host "   - Preencha o email de suporte" -ForegroundColor Gray
Write-Host "   - Salve as configuracoes" -ForegroundColor Gray
Write-Host ""
Write-Host "2. No Firebase Console - Settings:" -ForegroundColor White
Write-Host "   - Verifique se localhost esta nos dominios autorizados" -ForegroundColor Gray
Write-Host ""
Write-Host "3. No Google Cloud Console - Credentials:" -ForegroundColor White
Write-Host "   - Verifique as URLs autorizadas no OAuth 2.0 Client" -ForegroundColor Gray
Write-Host ""
Write-Host "Consulte o arquivo GUIA_FIREBASE_CONSOLE.md para instrucoes detalhadas." -ForegroundColor Magenta
Write-Host ""
Write-Host "Apos a configuracao, execute:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host "   E faça login na aplicação" -ForegroundColor Gray

Pause