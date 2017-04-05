Function RemoveField([string]$fieldName, [string]$RootLocation) { 

    $logFilePath = "$RootLocation\RemoveFieldLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        if ($fieldName -and (Get-PnPField -Identity $fieldName -ErrorAction SilentlyContinue) -ne $null) {                                                                   
            Remove-PnPField -Identity $fieldName -Force  
            #Write-Host "Field $fieldName removed" -ForegroundColor Green               
        }
        else {
            #Write-Host "Field $fieldName doesn't exist" -ForegroundColor Yellow  
        }
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath –append  
        throw  $_.Exception.Message
    }
}