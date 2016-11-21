# connection
& '.\0. Connection.ps1'
$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent

# STANDARD PAGE
$standardPageCT = Get-SPOContentType -Identity "SupplierNet Page"
$localPath = $scriptDir+"\Pagelayouts\Redesign-Standard Page.aspx"
$pageLayout = Add-SPOPublishingPageLayout -SourceFilePath $localPath -Title "Redesign-Standard Page" -Description "Redesign Standard page layout" -DestinationFolderHierarchy "/" -AssociatedContentTypeID $standardPageCT.Id  

# HOMEPAGE
$localPath = $scriptDir+"\Pagelayouts\Redesign-Home.aspx"
$pageLayout = Add-SPOPublishingPageLayout -SourceFilePath $localPath -Title "Redesign-Home" -Description "Redesign Homepage layout" -DestinationFolderHierarchy "/" -AssociatedContentTypeID $standardPageCT.Id 

# MY REPORTS
$reportsCT = Get-SPOContentType -Identity "SupplierNet My Reports"  
$localPath = $scriptDir+"\Pagelayouts\Redesign-My Reports.aspx"
$pageLayout = Add-SPOPublishingPageLayout -SourceFilePath $localPath -Title "Redesign-My Reports" -Description "Redesign My Reports layout" -DestinationFolderHierarchy "/" -AssociatedContentTypeID $reportsCT.Id 

# NEWS
$newsCT = Get-SPOContentType -Identity "SupplierNet News"  
$localPath = $scriptDir+"\Pagelayouts\Redesign-News.aspx" 
$pageLayout = Add-SPOPublishingPageLayout -SourceFilePath $localPath -Title "Redesign-News" -Description "Redesign News layout" -DestinationFolderHierarchy "/" -AssociatedContentTypeID $newsCT.Id 

# EVENT REGISTRATION
$eventRegistrationCT = Get-SPOContentType -Identity "SupplierNet PTW Events"  
$localPath = $scriptDir+"\Pagelayouts\Redesign-PTW Event Registration.aspx"  
$pageLayout = Add-SPOPublishingPageLayout -SourceFilePath $localPath -Title "Redesign-PTW Event Registration" -Description "Redesign PTW Event Registration layout" -DestinationFolderHierarchy "/" -AssociatedContentTypeID $eventRegistrationCT.Id 
