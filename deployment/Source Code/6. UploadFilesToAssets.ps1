Param (
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [string]$SubSite,
    [string]$Credential,
    [string]$RootLocation = ".",
)

$logFilePath = "$RootLocation\UploadFilesToAssetsLog.txt"
$ErrorActionPreference = "Stop"


#------------------------------------------------------------------
#                        Uploading Assets
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

    $inputFilePathForFiles = "$RootLocation\UploadFilesToAssets.xml"

    Import-Module "$RootLocation\Modules\AddFiles.psm1"

    [System.Xml.XmlDocument] $inputDoc = new-object System.Xml.XmlDocument

    $inputFile = resolve-path($inputFilePathForFiles)
    $inputDoc = [xml](Get-Content $inputFile)    

    foreach($module in $inputDoc.Input.Module)
    {
    	foreach($folder in $module.Folder)
    	{
    		AddFiles -SourceDir ($RootLocation + $folder.SourcePath) -TargetDir $folder.TargetPath -logFilePath $logFilePath -SubSite $SubSite
    	}
    }

    Disconnect-PnPOnline
}
Catch {
    $DateTime = Get-Date
    "Time: $DateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $LogFilePath –append  
    throw  $_.Exception.Message
}