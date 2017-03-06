Function RemoveLists([string]$inputFile, [string]$RootLocation) { 

    $logFilePath = "$RootLocation\RemoveListsLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        #Write-Host -ForegroundColor Green "Removing lists..."

        $inputDoc = [xml](Get-Content $inputFile)
        $lists = $inputDoc.Lists

        foreach($list in $lists.List) {
            $listName = $list.Name
            
            #Write-Host -ForegroundColor Green "Trying to remove $listName"
            Import-Module "$RootLocation\Modules\RemoveList.psm1"	
            RemoveList -listName $listName -RootLocation $RootLocation
        }
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath –append  
        throw  $_.Exception.Message
    }
}