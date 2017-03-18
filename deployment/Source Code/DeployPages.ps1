Param (
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
    Connect-SPOnline -Url $SiteUrl -Credentials $Credential

    & "$RootLocation\Pages\Home.ps1" -SiteUrl $SiteUrl -Credential $Credential -RootLocation $RootLocation -SPWebServerRelativeUrl $SPWebServerRelativeUrl

    Disconnect-SPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath -append  
    throw  $_.Exception.Message
}