Function RemoveContentTypes([string]$inputFile, [string]$RootLocation) { 

    $logFilePath = "$RootLocation\RemoveContentTypesLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        #Write-Host -ForegroundColor Green "Removing content types..."

        $inputDoc = [xml](Get-Content $inputFile)
        $contentTypes = $inputDoc.ContentTypes

        foreach($contentType in $contentTypes.ContentType) {
            $contentTypeName = $contentType.Name
            
            #Write-Host -ForegroundColor Green "Trying to remove $contentTypeName"
            Import-Module "$RootLocation\Modules\RemoveContentType.psm1"	
            RemoveContentType -contentTypeName $contentTypeName -RootLocation $RootLocation
        }
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath –append  
        throw  $_.Exception.Message
    }
}