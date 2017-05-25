Function RemoveList([string]$listName, [string]$RootLocation, [bool]$debug) { 

    $logFilePath = "$RootLocation\RemoveListLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        if ($listName -and (Get-PnPList -Identity $listName -ErrorAction SilentlyContinue) -ne $null) {                                                                   
            Remove-PnPList -Identity $listName -Force  
            Write-Host "List $listName removed" -ForegroundColor Green               
        }
        else {
            Write-Host "List $listName doesn't exist" -ForegroundColor Yellow  
        }
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath –append  
        throw  $_.Exception.Message
    }
}