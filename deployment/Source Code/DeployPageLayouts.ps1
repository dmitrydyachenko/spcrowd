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
    Connect-PnPOnline -Url $SiteUrl -Credentials $Credential

    $ArticlePageContentType = Get-PnPContentType -Identity "Article Page"
    Add-PnPHtmlPublishingPageLayout -SourceFilePath "$RootLocation\Pagelayouts\CSAGroup.html" -Title "CSA Group PageLayout" -Description "CSA Group PageLayout" -DestinationFolderHierarchy "/" -AssociatedContentTypeID $ArticlePageContentType.Id

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}

