# connection
& '.\0. Connection.ps1'
$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$masterpageLocal = $scriptDir + "\Masterpage\SupplierNet-redesign.master"


Add-SPOMasterPage -SourceFilePath $masterpageLocal -Title "Redesign Masterpage" -Description "SupplierNet Redesign Masterpage" -DestinationFolderHierarchy "/"  

Set-SPOMasterPage -CustomMasterPageServerRelativeUrl "/_catalogs/masterpage/SupplierNet-redesign.master"      