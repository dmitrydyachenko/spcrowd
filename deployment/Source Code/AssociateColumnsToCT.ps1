Param (
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation,
    [string]$SubSite
)

$LogFilePath = "$RootLocation\MapSiteColumnsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Mapping site columns
#------------------------------------------------------------------

Try {
    Connect-PnPOnline -Url $SiteUrl -Credentials $Credential

    Import-Module "$RootLocation\Modules\MapFields.psm1"  
    MapFields -inputFile "$RootLocation\Content\ContentTypes\ContentTypes.xml" -RootLocation $RootLocation -SubSite $SubSite

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append  
    throw  $_.Exception.Message
}
