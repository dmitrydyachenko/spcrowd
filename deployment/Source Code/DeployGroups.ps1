Param (
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation 
)

$LogFilePath = "$RootLocation\DeployGroupsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Deploying Groups
#------------------------------------------------------------------

Try {
    Connect-PnPOnline -Url $SiteUrl -Credentials $Credential

    Import-Module "$RootLocation\Modules\CreateGroups.psm1"   
    CreateGroups -inputFile "$RootLocation\Content\Groups\Groups.xml" -RootLocation $RootLocation -recreate $false -debug $false

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath -append  
    throw  $_.Exception.Message
}
