Function MapContentTypes([string]$inputFile, [string]$SubSite, [string]$RootLocation) {

    $logFilePath = "$RootLocation\MapContentTypesLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        #Write-Host -ForegroundColor Green "Mapping content types..."

        $web = ''

        if($SubSite) {
            $web = Get-PnPWeb -Identity $SubSite
        } 
        else {
            $web = Get-PnPWeb
        }

        $inputDoc = [xml](Get-Content $inputFile)
        $lists = $inputDoc.Lists

        foreach($list in $lists.List) {
            $listName = $list.Name

            $contentTypes = $list.ContentTypes

            if($contentTypes){
                foreach($contentType in $contentTypes.ContentType) {
                    $contentTypeName = $contentType.Name
                    
                    #Write-Host -ForegroundColor Green "Trying to map content type $contentTypeName to list $listName"

                    Add-PnPContentTypeToList -List $listName -ContentType $contentTypeName -DefaultContentType -Web $web

                    # $contentTypeObject = Get-PnPContentType -Identity $contentTypeName -InSiteHierarchy
                    # $viewFields = $contentTypeObject.Fields
                    # $viewFieldsArray = @()
                    # foreach($viewField in $viewFields) {
                    #     $viewFieldsArray += $viewField.Name
                    # }
                    # Add-PnPView -List $listName -Title $listName -Fields $viewFieldsArray -SetAsDefault

                    #Write-Host -ForegroundColor Green "Content type $contentTypeName mapped to list $listName"
                }
            }
        }

        #Write-Host -ForegroundColor Green "Content types mapped"
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append  
        throw  $_.Exception.Message
    }
}