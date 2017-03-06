Function MapFields([string]$inputFile, [string]$RootLocation) {

    $logFilePath = "$RootLocation\MapFieldsLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        #Write-Host -ForegroundColor Green "Mapping fields..."

        $inputDoc = [xml](Get-Content $inputFile)
        $contentTypes = $inputDoc.ContentTypes

        foreach($contentType in $contentTypes.ContentType) {
            $contentTypeName = $contentType.Name

            $fields = $contentType.Fields

            if($fields){
                foreach($field in $fields.Field) {
                    $fieldName = $field.Name
                    
                    #Write-Host -ForegroundColor Green "Trying to map field $fieldName to content type $contentTypeName"

                    if($field.Required -and $field.Required -eq "True") {
                        Add-SPOFieldToContentType -Field $fieldName -ContentType $contentTypeName -Required

                        #Write-Host -ForegroundColor Green "Field (Required) $fieldName mapped to content type $contentTypeName"
                    }
                    else {
                        Add-SPOFieldToContentType -Field $fieldName -ContentType $contentTypeName

                        #Write-Host -ForegroundColor Green "Field (Optional) $fieldName mapped to content type $contentTypeName"
                    }
                }
            }
        }

        #Write-Host -ForegroundColor Green "Fields mapped"
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append  
        throw  $_.Exception.Message
    }
}