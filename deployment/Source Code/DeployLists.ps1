Param (
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation,
    [string]$SubSite
)

$LogFilePath = "$RootLocation\DeployListsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Deploying Lists
#------------------------------------------------------------------

Try {
    Connect-PnPOnline -Url $SiteUrl -Credentials $Credential
    
    Import-Module "$RootLocation\Modules\CreateLists.psm1"    
    CreateLists -inputFile "$RootLocation\Content\Lists\Lists.xml" -RootLocation $RootLocation -SubSite $SubSite -recreate $false -debug $false

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}