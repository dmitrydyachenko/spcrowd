Param (
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [string]$SubSite,
    [string]$Credential,
    [string]$RootLocation = ".",
)

$LogFilePath = "$RootLocation\DeployMasterPageLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Deploying Master Page
#------------------------------------------------------------------

Try {
    Write-Host -ForegroundColor Green "Connecting to site $SiteUrl$SubSite"
    
    if($Credential) {
        Connect-PnPOnline -Url $SiteUrl -Credentials $Credential
    } 
    else {
        Connect-PnPOnline -Url $SiteUrl -UseWebLogin
    }

    $web = ''

    if($SubSite) {
        $web = Get-PnPWeb -Identity $SubSite
    } 
    else {
        $web = Get-PnPWeb
    }

    Write-Host -ForegroundColor Green "Connected"

    Add-PnPMasterPage -SourceFilePath "$RootLocation\MasterPage\spcrowd.master" -Title "SPCrowd MasterPage" -Description "SPCrowd MasterPage" -DestinationFolderHierarchy "/" -Web $Web
    Set-PnPMasterPage -CustomMasterPageSiteRelativeUrl "_catalogs/masterpage/spcrowd" -Web $Web

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}
