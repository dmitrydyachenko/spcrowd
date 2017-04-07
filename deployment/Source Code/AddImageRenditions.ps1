Param (
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation,
    [string]$SubSite
)

$LogFilePath = "$RootLocation\AddImageRenditionsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Adding Image Renditions
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

    Write-Host -ForegroundColor Green "Trying to add image rendition"

    Add-PnPPublishingImageRendition -Name "Thumbnail" -Width 213 -Height 215 -Web $Web

    Write-Host -ForegroundColor Green "Image rendition added"

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}