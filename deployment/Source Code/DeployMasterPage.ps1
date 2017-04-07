Param (
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation,
    [string]$SubSite
)

$LogFilePath = "$RootLocation\DeployMasterPageLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Deploying Master Page
#------------------------------------------------------------------

Try {
    Write-Host -ForegroundColor Green "Connecting to site $SiteUrl$SubSite"
    
    Connect-PnPOnline -Url $SiteUrl -Credentials $Credential

    $web = ''

    if($SubSite) {
        $web = Get-PnPWeb -Identity $SubSite
    } 
    else {
        $web = Get-PnPWeb
    }

    Write-Host -ForegroundColor Green "Connected"

    Add-PnPMasterPage -SourceFilePath "$RootLocation\Masterpage\seattle.master" -Title "CSA Group MasterPage" -Description "CSA Group MasterPage" -DestinationFolderHierarchy "/" -Web $Web
    Set-PnPMasterPage -CustomMasterPageSiteRelativeUrl "_catalogs/masterpage/seattle" -Web $Web

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}
