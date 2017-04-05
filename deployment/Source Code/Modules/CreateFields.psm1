Function CreateFields([string]$inputFile, [string]$RootLocation, [string]$SubSite, [bool]$recreate, [bool]$debug) {

    $logFilePath = "$RootLocation\CreateFieldsLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        #Write-Host -ForegroundColor Green "Deploying fields..."

        $web = ''

        if($SubSite) {
            $web = Get-PnPWeb -Identity $SubSite
        } 
        else {
            $web = Get-PnPWeb
        }

        $inputDoc = [xml](Get-Content $inputFile)
        $fields = $inputDoc.Fields
        $groupName = $fields.Group

        foreach($field in $fields.Field) {
            $fieldName = $field.Name

            if($recreate) {
                #Write-Host -ForegroundColor Green "Trying to remove $fieldName"
                Import-Module "$RootLocation\Modules\RemoveField.psm1"	
                RemoveField -fieldName $fieldName -RootLocation $RootLocation
            }

            #Write-Host -ForegroundColor Green "Trying to create $fieldName"

            $isExist = Get-PnPField -Identity $fieldName -ErrorAction SilentlyContinue -Web $web

            if($isExist -eq $null) {

                $fieldXml = $fieldXml -replace "&" ,"&amp;" 

                if(!$field.ID) {
                    $fieldGuid=[GUID]::NewGuid()  
                    $field.SetAttribute("ID", "{$fieldGuid}")
                }

                if(!$field.Group) {
                    $columnsGroup = $fields.Group
                    $field.SetAttribute("Group", "$columnsGroup")
                }

                if(!$field.StaticName) {
                    $field.SetAttribute("StaticName", "$fieldName")
                }

                if($field.Type -eq 'Taxonomy') {
                    $termSetGroup = ''
                    $groupsToTest = $field.GroupsToTest

                    #Write-Host -ForegroundColor Green "Trying to get term groups..."

                    foreach($groupToTest in $groupsToTest.Group) {
                        $groupToTestName = $groupToTest.Name
                        $group = Get-PnPTermGroup -GroupName $groupToTestName

                        #Write-Host -ForegroundColor Green "Trying to get $groupToTestName term group"

                        if($group -ne $null) {
                            $termSetGroup = $groupToTestName
                            #Write-Host -ForegroundColor Green "Term group $groupToTestName is selected"
                            break
                        }
                    }

                    $termSetPath = $termSetGroup + "|" + $field.TermSet

                    #Write-Host -ForegroundColor Green "Path for termset is $termSetPath"

                    if($field.Mult -and $field.Mult -eq "TRUE") {
                        Add-PnPTaxonomyField -DisplayName $field.DisplayName -InternalName $field.Name -Group $groupName -TermSetPath $termSetPath -TermPathDelimiter "|" -MultiValue -Web $web 
                    } else {
                        Add-PnPTaxonomyField -DisplayName $field.DisplayName -InternalName $field.Name -Group $groupName -TermSetPath $termSetPath -TermPathDelimiter "|" -Web $web
                    }
                } else {
                    if($field.Type -eq 'Lookup') {
                        $list = Get-PnPList -Identity $field.List -Web $web
                        $listId = $list.Id
                        $field.SetAttribute("List", "{$listId}")
                    }

                    if($field.Type -eq 'Choice') {

                        if($field.Choices -and $field.Choices.ExternalValues) {

                            $externalValues = $field.Choices.ExternalValues
                            $path = $field.Choices.ExternalValues.Path

                            if($path) {

                                #Write-Host -ForegroundColor Green "Getting values from external source $path"

                                $choicesXml = [xml](Get-Content $path)

                                 foreach($choice in $choicesXml.Table.Row.Cell.Data) {
                                    if($choice -and $choice -ne "" -and $choice -ne " ") {
                                        $choiceElement = $inputDoc.CreateElement("CHOICE")
                                        $choiceElement.set_InnerXML($choice)
                                        $field.Choices.AppendChild($choiceElement)
                                    }
                                 }

                                 $choices = $field.Choices
                                 $choices.RemoveChild($field.Choices.SelectSingleNode("ExternalValues"))
                            }
                        }
                    }
                          
                    Add-PnPFieldFromXml -FieldXml $field.OuterXml -Web $web
                }

                if($debug) {
                    #Write-Host -ForegroundColor DarkYellow $field.OuterXml
                }
            }
            else {
                #Write-Host -ForegroundColor Yellow "Field $fieldName already exists"
            }
        }

        #Write-Host -ForegroundColor Green "Fields deployed"
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append  
        throw  $_.Exception.Message
    }
}