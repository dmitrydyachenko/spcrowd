Param (
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation 
)

$LogFilePath = "$RootLocation\DeployPageLayoutsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Deploying Page Layouts
#------------------------------------------------------------------

Try {
    Connect-SPOnline -Url $SiteUrl -Credentials $Credential

    $ArticlePageContentType = Get-SPOContentType -Identity "Article Page"
    Add-SPOHtmlPublishingPageLayout -SourceFilePath "$RootLocation\Pagelayouts\Starterpack.html" -Title "Starterpack PageLayout" -Description "Starterpack PageLayout" -DestinationFolderHierarchy "/" -AssociatedContentTypeID $ArticlePageContentType.Id

    Disconnect-SPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}

