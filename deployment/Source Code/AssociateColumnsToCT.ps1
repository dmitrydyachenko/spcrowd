Param (
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation 
)

$LogFilePath = "$RootLocation\MapSiteColumnsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Mapping site columns
#------------------------------------------------------------------

Try {
    Connect-SPOnline -Url $SiteUrl -Credentials $Credential

    Import-Module "$RootLocation\Modules\MapFields.psm1"  
    MapFields -inputFile "$RootLocation\Content\ContentTypes\ContentTypes.xml" -RootLocation $RootLocation

    Disconnect-SPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append  
    throw  $_.Exception.Message
}
