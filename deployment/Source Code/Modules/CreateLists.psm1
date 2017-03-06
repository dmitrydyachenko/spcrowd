Function CreateLists([string]$inputFile, [string]$RootLocation, [bool]$recreate, [bool]$debug) {

    $logFilePath = "$RootLocation\CreateListsLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        #Write-Host -ForegroundColor Green "Deploying lists..."

        $inputDoc = [xml](Get-Content $inputFile)
        $lists = $inputDoc.Lists

        foreach($list in $lists.List) {
            $listName = $list.Name

            if($recreate) {
                #Write-Host -ForegroundColor Green "Trying to remove $listName"
                Import-Module "$RootLocation\Modules\RemoveList.psm1"	
                RemoveList -listName $listName -RootLocation $RootLocation
            }

            #Write-Host -ForegroundColor Green "Trying to create $listName"

            $isExist = Get-SPOList -Identity $listName -ErrorAction SilentlyContinue

            if($isExist -eq $null) {
                      
                New-SPOList -Title $listName -Template $list.Template -EnableContentTypes

                #Write-Host -ForegroundColor Green "List $listName created"

                if($recreate) {
                    $contentTypes = $list.ContentTypes

                    if($contentTypes){
                        foreach($contentType in $contentTypes.ContentType) {
                            $contentTypeName = $contentType.Name

                            #Write-Host -ForegroundColor Green "Trying to add content type $contentTypeName for list $listName"

                            $contentTypeObject = Get-SPOContentType -Identity $contentTypeName -InSiteHierarchy

                            if($contentTypeObject){
                                #Write-Host -ForegroundColor Green "Trying to map content type $contentTypeName to list $listName"

                                Add-SPOContentTypeToList -List $listName -ContentType $contentTypeName -DefaultContentType

                                #Write-Host -ForegroundColor Green "Content type $contentTypeName mapped to list $listName"
                            }
                            else {
                                #Write-Host -ForegroundColor Yellow "Content type $contentTypeName doesn't exist"   
                            }
                        }
                    }
                }

                if($debug) {
                    #Write-Host -ForegroundColor DarkYellow $list.OuterXml
                }
            }
            else {
                #Write-Host -ForegroundColor Yellow "List $listName already exists"
            }
        }

        #Write-Host -ForegroundColor Green "Lists deployed"
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append  
        throw  $_.Exception.Message
    }
}