Param (
   [string]$SiteUrl,
   [Parameter(Mandatory = $true)]
   [string]$Credential,
   [Parameter(Mandatory = $true)]
   [string]$RootLocation 
)

$logFilePath = "$RootLocation\UploadFilesToAssetsLog.txt"
$ErrorActionPreference = "Stop"

#------------------------------------------------------------------
#                        Connect to SPOnline
#------------------------------------------------------------------

Connect-SPOnline -Url $SiteUrl -Credentials $Credential

#------------------------------------------------------------------
#                      Upload files
#------------------------------------------------------------------

$inputFilePathForFiles = "$RootLocation\Input_Add_Files.xml"

Import-Module $RootLocation\AddFiles.psm1

[System.Xml.XmlDocument] $inputDoc = new-object System.Xml.XmlDocument

$inputFile = resolve-path($inputFilePathForFiles)
$inputDoc = [xml](Get-Content $inputFile)    

foreach($module in $inputDoc.Input.Module)
{
	foreach($folder in $module.Folder)
	{
		AddFiles -SourceDir ($RootLocation + $folder.SourcePath) -TargetDir $folder.TargetPath -logFilePath $logFilePath -SubSite ""
	}
}


Disconnect-SPOnline

