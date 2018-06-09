Param (
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [string]$SubSite,
    [string]$Credential,
    [string]$RootLocation = "."
)

$LogFilePath = "$RootLocation\DeploySiteColumnsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Deploying Site Columns
#------------------------------------------------------------------

Try {
    Write-Host -ForegroundColor Green "Connecting to site $SiteUrl$SubSite"
    
    if($Credential) {
        Connect-PnPOnline -Url $SiteUrl -Credentials $Credential
    } 
    else {
        Connect-PnPOnline -Url $SiteUrl -UseWebLogin
    }

    Write-Host -ForegroundColor Green "Connected"

    Import-Module "$RootLocation\Modules\CreateFields.psm1"   
    CreateFields -inputFile "$RootLocation\Content\Fields\Fields.xml" -RootLocation $RootLocation -SubSite $SubSite -recreate $false -debug $false

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath -append  
    throw  $_.Exception.Message
}
