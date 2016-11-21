# connection
& '.\0. Connection.ps1'


Add-SPOContentTypeToList -List "Header Links" -ContentType "Header Links" -DefaultContentType
Add-SPOView -List "Header Links" -Title "All" -Fields "LinkTitle","URL", "Item Order","Icon","Link Type" -SetAsDefault

Add-SPOContentTypeToList -List "Global Navigation" -ContentType "Global Navigation" -DefaultContentType
Add-SPOView -List "Global Navigation" -Title "All" -Fields "LinkTitle","URL","Item Order", "Parent" -SetAsDefault

Add-SPOContentTypeToList -List "Footer Links" -ContentType "Footer Links" -DefaultContentType
Add-SPOView -List "Footer Links" -Title "All" -Fields "LinkTitle","URL", "Item Order","ItemIcon" -SetAsDefault

Add-SPOContentTypeToList -List "Pillars" -ContentType "Pillars" -DefaultContentType
Add-SPOView -List "Pillars" -Title "All" -Fields "LinkTitle","Strapline","Thumbnail" -SetAsDefault

Add-SPOContentTypeToList -List "User Preferences" -ContentType "User Preferences" -DefaultContentType
Add-SPOView -List "User Preferences" -Title "All" -Fields "LinkTitle","User Pillars","User Id","Visited", "Created By" -SetAsDefault

Add-SPOContentTypeToList -List "I Need To" -ContentType "I Need To" -DefaultContentType
Add-SPOView -List "I Need To" -Title "All" -Fields "LinkTitle","URL","Pillars", "Item Order", "Visibility" -SetAsDefault

Add-SPOContentTypeToList -List "Report Shortcuts" -ContentType "Report Shortcuts" -DefaultContentType
Add-SPOView -List "Report Shortcuts" -Title "All" -Fields "LinkTitle","Strapline", "URL", "Thumbnail", "Pillars" -SetAsDefault

Add-SPOContentTypeToList -List "Regional Cluster Leaders" -ContentType "Regional Cluster Leaders" -DefaultContentType
Add-SPOView -List "Regional Cluster Leaders" -Title "All" -Fields "LinkTitle","Location", "Email", "Profile Image" -SetAsDefault

# training site
Add-SPOContentTypeToList -List "Pages" -ContentType "SupplierNet My Reports" -Web "Training"

# quality and services
Add-SPOContentTypeToList -List "Quality and Services Categories" -ContentType "Quality and Services Categories" -Web "Partner to Win/Quality and Services"
Add-SPOView -List "Quality and Services Categories" -Title "All" -Fields "LinkTitle","Strapline", "Thumbnail" -SetAsDefault  -Web "Partner to Win/Quality and Services"

Add-SPOContentTypeToList -List "Suppliers Specific Categories" -ContentType "Suppliers Specific Categories" -Web "Partner to Win/Quality and Services"
Add-SPOView -List "Suppliers Specific Categories" -Title "All" -Fields "LinkTitle","Strapline", "Thumbnail" -SetAsDefault  -Web "Partner to Win/Quality and Services"

Add-SPOContentTypeToList -List "Quality and Services Documents" -ContentType "Quality and Services Documents" -Web "Partner to Win/Quality and Services"
Add-SPOView -List "Quality and Services Documents" -Title "All" -Fields "DocIcon","LinkFilename","Title","Quality and Services Category", "Supplier Specific Category", "Document Type" -SetAsDefault  -Web "Partner to Win/Quality and Services"

# partner to win
Add-SPOContentTypeToList -List "PTW Home Page Links" -ContentType "PTW Home Page Links" -Web "Partner to Win"
Add-SPOView -List "PTW Home Page Links" -Title "All" -Fields "LinkTitle","Strapline","Item Order", "URL" -SetAsDefault  -Web "Partner to Win"

# partner to win
Add-SPOContentTypeToList -List "Event Registrations" -ContentType "Event Registrations" -Web "Partner to Win/Partner to Win Event"
Add-SPOView -List "Event Registrations" -Title "All" -Fields "LinkTitle","User Id","External User", "Event", "Address Line 1", "Address Line 2", "Company", "Director Name", "Email", "Full Name", "Phone Number", "Position Title","Post/Zip code", "Unilever Buyer Contact", "VP Name", "Profile Image" -SetAsDefault  -Web "Partner to Win/Partner to Win Event"

#SupplierNet PTW Events
Add-SPOContentTypeToList -List "Pages" -ContentType "Event Registrations" -Web "Partner to Win/Partner to Win Event"


