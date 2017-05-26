Param (
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [string]$SubSite,
    [string]$Credential,
    [string]$RootLocation = "."
)

$LogFilePath = "$RootLocation\DeployListsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Deploying Lists
#------------------------------------------------------------------

Try {
    Write-Host -ForegroundColor Green "Connecting to site $SiteUrl$SubSite"
    
    if($Credential) {
        Connect-PnPOnline -Url $SiteUrl -Credentials $Credential
    } 
    else {
        Connect-PnPOnline -Url $SiteUrl -UseWebLogin
    }

    $webName = ''

    if($SubSite) {
        $webName = $SubSite -replace '\s',''
        $webName = $webName -replace '/',''
        $webName = '_' + $webName
    } 

    Write-Host -ForegroundColor Green "Connected"
    
    Import-Module "$RootLocation\Modules\CreateLists.psm1"    
    CreateLists -inputFile "$RootLocation\Content\Lists\Lists$webName.xml" -RootLocation $RootLocation -SubSite $SubSite -recreate $false -debug $false

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}
