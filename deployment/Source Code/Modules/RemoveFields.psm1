Function RemoveFields([string]$inputFile, [string]$RootLocation, [bool]$debug) { 

    $logFilePath = "$RootLocation\RemoveFieldsLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        Write-Host -ForegroundColor Green "Removing fields..."

        $inputDoc = [xml](Get-Content $inputFile)
        $fields = $inputDoc.Fields

        foreach($field in $fields.Field) {
            $fieldName = $field.Name
            
            Write-Host -ForegroundColor Green "Trying to remove $fieldName"
            Import-Module "$RootLocation\Modules\RemoveField.psm1"	
            RemoveField -fieldName $fieldName -RootLocation $RootLocation
        }
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath –append  
        throw  $_.Exception.Message
    }
}