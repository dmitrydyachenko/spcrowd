Function CreateGroups([string]$inputFile, [string]$RootLocation, [bool]$recreate, [bool]$debug) {

    $logFilePath = "$RootLocation\CreateGroupsLog.txt"
    $ErrorActionPreference = "Stop"

    Try {
        Write-Host -ForegroundColor Green "Deploying groups..."

        $inputDoc = [xml](Get-Content $inputFile)
        $groups = $inputDoc.Groups

        foreach($group in $groups.Group) {
            $groupName = $group.Name

            Write-Host -ForegroundColor Green "Trying to create $groupName"

            $isExist = Get-PnPGroup -Identity $groupName -ErrorAction SilentlyContinue 

            if($isExist -eq $null) {    
                New-PnPGroup -Title $groupName

                Write-Host -ForegroundColor Green "Group $groupName created"

                $permissionLevelName = $group.PermissionLevel

                Set-PnPGroupPermissions -Identity $groupName -AddRole $permissionLevelName

                Write-Host -ForegroundColor Green "Permission level $permissionLevelName added"

                if($debug) {
                    Write-Host -ForegroundColor DarkYellow $group.OuterXml
                }
            }
            else {
                Write-Host -ForegroundColor Yellow "Group $groupName already exists"
            }
        }

        Write-Host -ForegroundColor Green "Groups deployed"
    }
    Catch {
        $dateTime = Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append  
        throw  $_.Exception.Message
    }
}