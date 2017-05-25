Function MapContentTypes([string]$inputFile, [string]contentTypesFile, [string]$RootLocation, [string]$SubSite, [bool]$debug) {

    $logFilePath = "$RootLocation\MapContentTypesLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        Write-Host -ForegroundColor Green "Mapping content types..."

        $web = ''

        if($SubSite) {
            $web = Get-PnPWeb -Identity $SubSite
        } 
        else {
            $web = Get-PnPWeb
        }

        $inputDoc = [xml](Get-Content $inputFile)
        $lists = $inputDoc.Lists

        $contentTypesDoc = [xml](Get-Content $contentTypesFile)

        foreach($list in $lists.List) {
            $listName = $list.Name

            $contentTypes = $list.ContentTypes

            if($contentTypes){
                foreach($contentType in $contentTypes.ContentType) {
                    $contentTypeName = $contentType.Name
                    
                    Write-Host -ForegroundColor Green "Trying to map content type $contentTypeName to list $listName"

                    Add-PnPContentTypeToList -List $listName -ContentType $contentTypeName -DefaultContentType -Web $web

                    Write-Host -ForegroundColor Green "Content type $contentTypeName mapped to list $listName"

                    Write-Host -ForegroundColor Green "Trying to create view for list $listName"

                    $viewFields = $contentTypesDoc.ContentTypes.SelectSingleNode("ContentType[@Name='$contentTypeName']")
                    $viewFieldsArray = @()

                    foreach($viewField in $viewFields.Fields.Field) {
                        $viewFieldsArray += $viewField.Name
                    }

                    Add-PnPView -List $listName -Title $listName -Fields $viewFieldsArray -SetAsDefault

                    Write-Host -ForegroundColor Green "View for list $listName created"
                }
            }
        }

        Write-Host -ForegroundColor Green "Content types mapped"
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append  
        throw  $_.Exception.Message
    }
}