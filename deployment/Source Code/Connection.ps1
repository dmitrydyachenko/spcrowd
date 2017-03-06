param([string]$SiteUrl="https://unileverdev.sharepoint.com/sites/Dev_DoveHairCasting", [string]$RootLocation)

$LogFilePath = "$RootLocation\ConnectionLog.txt"
$ErrorActionPreference = "Stop"

Try {
    #Write-Host "Connecting to the site..." -ForegroundColor Green
    Connect-SPOnline -Url $SiteUrl -UseWebLogin
    #Write-Host "Connected to the site" -ForegroundColor Green
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath -append  
    throw  $_.Exception.Message
}