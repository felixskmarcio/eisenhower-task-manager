$files = Get-ChildItem -Path "src/components/ui" -Filter "*.tsx"
foreach ($file in $files) {
    $content = Get-Content $file.FullName
    $newContent = $content -replace 'from "@/lib/utils"', 'from "@/utils/classNames"'
    Set-Content -Path $file.FullName -Value $newContent
}
Write-Host "Importações atualizadas com sucesso!" 