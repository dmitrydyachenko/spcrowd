Param (
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation 
)

$LogFilePath = "$RootLocation\DeployMasterPageLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Deploying Master Page
#------------------------------------------------------------------

Try {
    Connect-PnPOnline -Url $SiteUrl -Credentials $Credential

    Add-PnPMasterPage -SourceFilePath "$RootLocation\Masterpage\seattle.master" -Title "CSA Group MasterPage" -Description "CSA Group MasterPage" -DestinationFolderHierarchy "/"
    Set-PnPMasterPage -CustomMasterPageSiteRelativeUrl "_catalogs/masterpage/seattle"

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}
