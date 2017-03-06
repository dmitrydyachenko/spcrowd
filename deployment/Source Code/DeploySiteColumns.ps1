Param (
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation 
)

$LogFilePath = "$RootLocation\DeploySiteColumnsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Deploying Site Columns
#------------------------------------------------------------------

Try {
    Connect-SPOnline -Url $SiteUrl -Credentials $Credential

    Import-Module "$RootLocation\Modules\CreateFields.psm1"   
    CreateFields -inputFile "$RootLocation\Content\Fields\Fields.xml" -RootLocation $RootLocation -recreate $false -debug $false

    Disconnect-SPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath -append  
    throw  $_.Exception.Message
}
