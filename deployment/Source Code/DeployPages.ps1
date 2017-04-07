Param (
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation,
    [Parameter(Mandatory = $true)]
    [string]$SPWebServerRelativeUrl 
)

$LogFilePath = "$RootLocation\DeployPagesLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Deploying Pages
#------------------------------------------------------------------

Try {
    Write-Host -ForegroundColor Green "Connecting to site $SiteUrl$SubSite"
    
    Connect-PnPOnline -Url $SiteUrl -Credentials $Credential

    Write-Host -ForegroundColor Green "Connected"

    & "$RootLocation\Pages\Home.ps1" -SiteUrl $SiteUrl -Credential $Credential -RootLocation $RootLocation -SPWebServerRelativeUrl $SPWebServerRelativeUrl

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath -append  
    throw  $_.Exception.Message
}