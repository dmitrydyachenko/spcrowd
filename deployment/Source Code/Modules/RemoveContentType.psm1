Function RemoveContentType([string]$contentTypeName, [string]$RootLocation) { 

    $logFilePath = "$RootLocation\RemoveContentTypeLog.txt"
    $ErrorActionPreference = "Continue"

    Try {
        if ($contentTypeName -and (Get-PnPContentType -Identity $contentTypeName -ErrorAction SilentlyContinue) -ne $null) {                                                                   
            Remove-PnPContentType -Identity $contentTypeName -Force  
            #Write-Host "Content type $contentTypeName removed" -ForegroundColor Green               
        }
        else {
            #Write-Host "Content type $contentTypeName doesn't exist" -ForegroundColor Yellow  
        }
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath –append  
        throw  $_.Exception.Message
    }
}