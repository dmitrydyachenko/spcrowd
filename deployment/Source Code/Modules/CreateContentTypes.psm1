Function CreateContentTypes([string]$inputFile, [string]$RootLocation, [bool]$recreate, [bool]$debug) {

    $logFilePath = "$RootLocation\CreateContentTypesLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        #Write-Host -ForegroundColor Green "Deploying content types..."

        $inputDoc = [xml](Get-Content $inputFile)
        $contentTypes = $inputDoc.ContentTypes
        $contentTypeGroup = $contentTypes.Group

        foreach($contentType in $contentTypes.ContentType) {
            $contentTypeName = $contentType.Name

            if($recreate) {
                #Write-Host -ForegroundColor Green "Trying to remove $contentTypeName"
                Import-Module "$RootLocation\Modules\RemoveContentType.psm1"	
                RemoveContentType -contentTypeName $contentTypeName -RootLocation $RootLocation
            }

            #Write-Host -ForegroundColor Green "Trying to create $contentTypeName"

            $isExist = Get-SPOContentType -Identity $contentTypeName -ErrorAction SilentlyContinue

            if($isExist -eq $null) {
                $parentContentTypeName = $contentType.ParentContentType
                $parentContentType = Get-SPOContentType -Identity $parentContentTypeName

                Add-SPOContentType -Name $contentTypeName -Group $contentTypeGroup -ParentContentType $parentContentType

                #Write-Host -ForegroundColor Green "Content type $contentTypeName created"

                if($debug) {
                    #Write-Host -ForegroundColor DarkYellow $contentType.OuterXml
                }
            }
            else {
                #Write-Host -ForegroundColor Yellow "Content type $contentTypeName already exists"
            }
        }

        #Write-Host -ForegroundColor Green "Content types deployed"
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append  
        throw  $_.Exception.Message
    }
}