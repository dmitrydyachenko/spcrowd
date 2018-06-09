Param (
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [string]$SubSite,
    [string]$Credential,
    [string]$RootLocation = "."
)

$LogFilePath = "$RootLocation\MapSiteColumnsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Mapping Site Columns
#------------------------------------------------------------------

Try {
    Write-Host -ForegroundColor Green "Connecting to site $SiteUrl$SubSite"

    if($Credential) {
        Connect-PnPOnline -Url $SiteUrl -Credentials $Credential
    } 
    else {
        Connect-PnPOnline -Url $SiteUrl -UseWebLogin
    }

    Write-Host -ForegroundColor Green "Connected"

    Import-Module "$RootLocation\Modules\MapFields.psm1"  
    MapFields -inputFile "$RootLocation\Content\ContentTypes\ContentTypes.xml" -RootLocation $RootLocation -SubSite $SubSite -debug $false

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append  
    throw  $_.Exception.Message
}
