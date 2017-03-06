Param (
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$Credential,
    [Parameter(Mandatory = $true)]
    [string]$RootLocation 
)

$LogFilePath = "$RootLocation\DeployContentTypesLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Deploying Content Types
#------------------------------------------------------------------

Try {
    Connect-SPOnline -Url $SiteUrl -Credentials $Credential

    Import-Module "$RootLocation\Modules\CreateContentTypes.psm1"    
    CreateContentTypes -inputFile "$RootLocation\Content\ContentTypes\ContentTypes.xml" -RootLocation $RootLocation -recreate $false -debug $false

    Disconnect-SPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}