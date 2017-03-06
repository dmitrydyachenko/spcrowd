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

    #Add-SPOFile -Path "$RootLocation\Content\Image Renditions\PublishingImageRenditions.xml" -Folder "_catalogs/masterpage" -Checkout

    Add-SPOPublishingImageRendition -Name "Cast Thumbnail" -Width 213 -Height 215
    Add-SPOPublishingImageRendition -Name "Cast Photos" -Width 230 -Height -1

    Disconnect-SPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}