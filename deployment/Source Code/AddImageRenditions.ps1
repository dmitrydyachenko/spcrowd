Param (
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation 
)

$LogFilePath = "$RootLocation\AddImageRenditionsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Adding Image Renditions
#------------------------------------------------------------------

Try {
    Connect-SPOnline -Url $SiteUrl -Credentials $Credential

    Add-SPOPublishingImageRendition -Name "Thumbnail" -Width 213 -Height 215
    Add-SPOPublishingImageRendition -Name "Photos" -Width 230 -Height -1

    Disconnect-SPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}