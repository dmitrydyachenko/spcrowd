Param (
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation,
    [string]$SubSite
)

$LogFilePath = "$RootLocation\DeploySiteColumnsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Deploying Site Columns
#------------------------------------------------------------------

Try {
    Connect-PnPOnline -Url $SiteUrl -Credentials $Credential

    Import-Module "$RootLocation\Modules\CreateFields.psm1"   
    CreateFields -inputFile "$RootLocation\Content\Fields\Fields.xml" -RootLocation $RootLocation -SubSite $SubSite -recreate $false -debug $false

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath -append  
    throw  $_.Exception.Message
}
