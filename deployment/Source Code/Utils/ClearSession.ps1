Remove-Variable * -ErrorAction SilentlyContinue; 
Remove-Module *; 
$error.Clear(); 
Clear-Host
Write-Host "Session is cleared" -ForegroundColor Green
