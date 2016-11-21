# connection
& '.\0. Connection.ps1'

# vars declaration
$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$publicFolder = $scriptDir + "\Assets\"
$docLibUrl = "/Style%20Library/golin/"

## recursively get all files in the directory
$files = Get-ChildItem -Path $publicFolder -Recurse -File

foreach($currentFile in $files)
{
    $serverPath = $docLibUrl + $currentFile.DirectoryName.Replace($publicFolder, "").Replace("\","/")                                                                                                                                                                                                                                                                
    Add-SPOFile -Path $currentFile.FullName -Folder $serverPath
}