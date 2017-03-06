Param (
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation 
)

$LogFilePath = "$RootLocation\MapContentTypesLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Mapping Content Types
#------------------------------------------------------------------

Try {
    Connect-SPOnline -Url $SiteUrl -Credentials $Credential

    Import-Module "$RootLocation\Modules\MapContentTypes.psm1"    
    MapContentTypes -inputFile "$RootLocation\Content\Lists\Lists.xml" -RootLocation $RootLocation

    Disconnect-SPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath -append  
    throw  $_.Exception.Message
}
