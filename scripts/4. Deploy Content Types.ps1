# connection
& '.\0. Connection.ps1'

$listItemCT = Get-SPOContentType -Identity Item
$documentCT = Get-SPOContentType -Identity Document
$articleCT = Get-SPOContentType -Identity "Article Page"

# ROOT SITE
Add-SPOContentType -Name "Header Links" -Description "" -Group "SupplierNet Redesign" -ParentContentType $listItemCT
Add-SPOContentType -Name "Global Navigation" -Description "" -Group "SupplierNet Redesign" -ParentContentType $listItemCT 
Add-SPOContentType -Name "Footer Links" -Description "" -Group "SupplierNet Redesign" -ParentContentType $listItemCT 
Add-SPOContentType -Name "Pillars" -Description "" -Group "SupplierNet Redesign" -ParentContentType $listItemCT 
Add-SPOContentType -Name "User Preferences" -Description "" -Group "SupplierNet Redesign" -ParentContentType $listItemCT 
Add-SPOContentType -Name "I Need To" -Description "" -Group "SupplierNet Redesign" -ParentContentType $listItemCT 
Add-SPOContentType -Name "Report Shortcuts" -Description "" -Group "SupplierNet Redesign" -ParentContentType $listItemCT 
Add-SPOContentType -Name "Regional Cluster Leaders" -Description "" -Group "SupplierNet Redesign" -ParentContentType $listItemCT

# PARTNER TO WIN
Add-SPOContentType -Name "Supplier Quality Manual" -Description "" -Group "SupplierNet Redesign" -ParentContentType $documentCT
Add-SPOContentType -Name "Third Party Manufacture Quality Manual" -Description "" -Group "SupplierNet Redesign" -ParentContentType $documentCT
Add-SPOContentType -Name "Specifications System" -Description "" -Group "SupplierNet Redesign" -ParentContentType $documentCT
Add-SPOContentType -Name "CAM Guides" -Description "" -Group "SupplierNet Redesign" -ParentContentType $documentCT
Add-SPOContentType -Name "Codes and Policies" -Description "" -Group "SupplierNet Redesign" -ParentContentType $documentCT
Add-SPOContentType -Name "PTW Home Page Links" -Description "" -Group "SupplierNet Redesign" -ParentContentType $listItemCT

# PARTNER TO WIN EVENT
Add-SPOContentType -Name "Event Registrations" -Description "" -Group "SupplierNet Redesign" -ParentContentType $listItemCT

Add-SPOContentType -Name "SupplierNet Page" -Description "" -Group "SupplierNet Redesign" -ParentContentType $articleCT
Add-SPOContentType -Name "SupplierNet News" -Description "" -Group "SupplierNet Redesign" -ParentContentType $articleCT
Add-SPOContentType -Name "SupplierNet My Reports" -Description "" -Group "SupplierNet Redesign" -ParentContentType $articleCT
Add-SPOContentType -Name "SupplierNet PTW Events" -Description "" -Group "SupplierNet Redesign" -ParentContentType $articleCT


# QUALITY AND SERVICES
Add-SPOContentType -Name "Quality and Services Categories" -Description "" -Group "SupplierNet Redesign" -ParentContentType $listItemCT
Add-SPOContentType -Name "Suppliers Specific Categories" -Description "" -Group "SupplierNet Redesign" -ParentContentType $listItemCT
Add-SPOContentType -Name "Quality and Services Documents" -Description "" -Group "SupplierNet Redesign" -ParentContentType $documentCT
