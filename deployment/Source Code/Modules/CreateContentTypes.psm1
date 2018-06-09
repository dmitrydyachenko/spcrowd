Function CreateContentTypes([string]$inputFile, [string]$RootLocation, [string]$SubSite, [bool]$recreate, [bool]$debug) {

    $logFilePath = "$RootLocation\CreateContentTypesLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        Write-Host -ForegroundColor Green "Deploying content types..."

        $web = ''

        if($SubSite) {
            $web = Get-PnPWeb -Identity $SubSite
        } 
        else {
            $web = Get-PnPWeb
        }

        $inputDoc = [xml](Get-Content $inputFile)
        $contentTypes = $inputDoc.ContentTypes
        $contentTypeGroup = $contentTypes.Group

        foreach($contentType in $contentTypes.ContentType) {
            $contentTypeName = $contentType.Name

            if($recreate) {
                Write-Host -ForegroundColor Green "Trying to remove $contentTypeName"
                Import-Module "$RootLocation\Modules\RemoveContentType.psm1"	
                RemoveContentType -contentTypeName $contentTypeName -RootLocation $RootLocation
            }

            Write-Host -ForegroundColor Green "Trying to create $contentTypeName"

            $isExist = Get-PnPContentType -Identity $contentTypeName -ErrorAction SilentlyContinue -Web $web

            if($isExist -eq $null) {
                $parentContentTypeName = $contentType.ParentContentType
                $parentContentType = Get-PnPContentType -Identity $parentContentTypeName -Web $web

                Add-PnPContentType -Name $contentTypeName -Group $contentTypeGroup -ParentContentType $parentContentType -Web $web

                Write-Host -ForegroundColor Green "Content type $contentTypeName created"

                if($debug) {
                    Write-Host -ForegroundColor DarkYellow $contentType.OuterXml
                }
            }
            else {
                Write-Host -ForegroundColor Yellow "Content type $contentTypeName already exists"
            }
        }

        Write-Host -ForegroundColor Green "Content types deployed"
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append  
        throw  $_.Exception.Message
    }
}