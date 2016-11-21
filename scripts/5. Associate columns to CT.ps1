# connection
& '.\0. Connection.ps1'

Add-SPOFieldToContentType -Field "UserPillars" -ContentType "User Preferences"
Add-SPOFieldToContentType -Field "UserId" -ContentType "User Preferences"
Add-SPOFieldToContentType -Field "Visited" -ContentType "User Preferences"

# Add columns to content type
Add-SPOFieldToContentType -Field "ItemIcon" -ContentType "Header Links"
Add-SPOFieldToContentType -Field "ItemURL" -ContentType "Header Links"
Add-SPOFieldToContentType -Field "ItemOrder" -ContentType "Header Links"
Add-SPOFieldToContentType -Field "ItemType" -ContentType "Header Links"

# Add columns to content type
Add-SPOFieldToContentType -Field "ItemURL" -ContentType "Global Navigation"
Add-SPOFieldToContentType -Field "ItemParent" -ContentType "Global Navigation"
Add-SPOFieldToContentType -Field "ItemOrder" -ContentType "Global Navigation"


# Add columns to content type
Add-SPOFieldToContentType -Field "ItemURL" -ContentType "Footer Links"
Add-SPOFieldToContentType -Field "ItemIcon" -ContentType "Footer Links"
Add-SPOFieldToContentType -Field "ItemOrder" -ContentType "Footer Links"

# Add columns to content type
Add-SPOFieldToContentType -Field "Strapline" -ContentType "Pillars"
Add-SPOFieldToContentType -Field "ItemThumbnail" -ContentType "Pillars"

# Add columns to content type
Add-SPOFieldToContentType -Field "UserPillars" -ContentType "User Preferences"

# Add columns to content type
Add-SPOFieldToContentType -Field "ItemURL" -ContentType "I Need To"
Add-SPOFieldToContentType -Field "ItemOrder" -ContentType "I Need To"
Add-SPOFieldToContentType -Field "ItemVisibility" -ContentType "I Need To"
Add-SPOFieldToContentType -Field "Pillars" -ContentType "I Need To"

# Add columns to content type
Add-SPOFieldToContentType -Field "Strapline" -ContentType "Report Shortcuts"
Add-SPOFieldToContentType -Field "ItemThumbnail" -ContentType "Report Shortcuts"
Add-SPOFieldToContentType -Field "ItemURL" -ContentType "Report Shortcuts"
Add-SPOFieldToContentType -Field "Pillars" -ContentType "Report Shortcuts"

# Add columns to content type
Add-SPOFieldToContentType -Field "ItemLocation" -ContentType "Regional Cluster Leaders"
Add-SPOFieldToContentType -Field "Email" -ContentType "Regional Cluster Leaders"
Add-SPOFieldToContentType -Field "ProfileImage" -ContentType "Regional Cluster Leaders"

# Add columns to content type
Add-SPOFieldToContentType -Field "Strapline" -ContentType "Supplier Quality Manual"
Add-SPOFieldToContentType -Field "ItemThumbnail" -ContentType "Supplier Quality Manual"

# Add columns to content type
Add-SPOFieldToContentType -Field "Strapline" -ContentType "Third Party Manufacture Quality Manual"
Add-SPOFieldToContentType -Field "ItemThumbnail" -ContentType "Third Party Manufacture Quality Manual"

#Add columns to content type
Add-SPOFieldToContentType -Field "MyReportsCategories" -ContentType "SupplierNet My Reports"
Add-SPOFieldToContentType -Field "MyReportsSubcategories" -ContentType "SupplierNet My Reports"
Add-SPOFieldToContentType -Field "Strapline" -ContentType "SupplierNet My Reports"

#Add columns to content type
Add-SPOFieldToContentType -Field "Strapline" -ContentType "Quality and Services Categories"
Add-SPOFieldToContentType -Field "ItemThumbnail" -ContentType "Quality and Services Categories"
Add-SPOFieldToContentType -Field "CategoryType" -ContentType "Quality and Services Categories"

#Add columns to content type                              
Add-SPOFieldToContentType -Field "Strapline" -ContentType "Suppliers Specific Categories"
Add-SPOFieldToContentType -Field "ItemThumbnail" -ContentType "Suppliers Specific Categories"

#Add columns to content type
#Add-SPOFieldToContentType -Field "QasCategory" -ContentType "Quality and Services Documents"
#Add-SPOFieldToContentType -Field "QasSubCategory" -ContentType "Quality and Services Documents"
Add-SPOFieldToContentType -Field "QasSubSubCategory" -ContentType "Quality and Services Documents"

#Add columns to content type
Add-SPOFieldToContentType -Field "Strapline" -ContentType "PTW Home Page Links"
Add-SPOFieldToContentType -Field "ItemThumbnail" -ContentType "PTW Home Page Links"
Add-SPOFieldToContentType -Field "ItemURL" -ContentType "PTW Home Page Links"
Add-SPOFieldToContentType -Field "ItemOrder" -ContentType "PTW Home Page Links"

#Add columns to content type
Add-SPOFieldToContentType -Field "Event" -ContentType "Event Registrations"
Add-SPOFieldToContentType -Field "ItemFullName" -ContentType "Event Registrations"
Add-SPOFieldToContentType -Field "AddressLine1" -ContentType "Event Registrations"
Add-SPOFieldToContentType -Field "AddressLine2" -ContentType "Event Registrations"
Add-SPOFieldToContentType -Field "ItemCompany" -ContentType "Event Registrations"
Add-SPOFieldToContentType -Field "DirectorName" -ContentType "Event Registrations"
Add-SPOFieldToContentType -Field "Email" -ContentType "Event Registrations"
Add-SPOFieldToContentType -Field "PhoneNumber" -ContentType "Event Registrations"
Add-SPOFieldToContentType -Field "PositionTitle" -ContentType "Event Registrations"
Add-SPOFieldToContentType -Field "PostCode" -ContentType "Event Registrations"
Add-SPOFieldToContentType -Field "BuyerContact" -ContentType "Event Registrations"
Add-SPOFieldToContentType -Field "VpName" -ContentType "Event Registrations"
Add-SPOFieldToContentType -Field "UserId" -ContentType "Event Registrations"
Add-SPOFieldToContentType -Field "ExternalUser" -ContentType "Event Registrations"
#Add-SPOFieldToContentType -Field "ProfileImageLookUp" -ContentType "Event Registrations"


Add-SPOFieldToContentType -Field "Strapline" -ContentType "SupplierNet News"
Add-SPOFieldToContentType -Field "StartDate" -ContentType "SupplierNet News"
Add-SPOFieldToContentType -Field "_EndDate" -ContentType "SupplierNet News"

Add-SPOFieldToContentType -Field "Strapline" -ContentType "SupplierNet PTW Events"
Add-SPOFieldToContentType -Field "ItemLocation" -ContentType "SupplierNet PTW Events"
Add-SPOFieldToContentType -Field "StartDate" -ContentType "SupplierNet PTW Events"
Add-SPOFieldToContentType -Field "_EndDate" -ContentType "SupplierNet PTW Events"
Add-SPOFieldToContentType -Field "VenueInformation" -ContentType "SupplierNet PTW Events"
Add-SPOFieldToContentType -Field "Programme" -ContentType "SupplierNet PTW Events"
Add-SPOFieldToContentType -Field "EventPage" -ContentType "SupplierNet PTW Events"
Add-SPOFieldToContentType -Field "DocumentLink1" -ContentType "SupplierNet PTW Events"
Add-SPOFieldToContentType -Field "DocumentLink2" -ContentType "SupplierNet PTW Events"
Add-SPOFieldToContentType -Field "DocumentDescription1" -ContentType "SupplierNet PTW Events"
Add-SPOFieldToContentType -Field "DocumentDescription2" -ContentType "SupplierNet PTW Events"

Add-SPOFieldToContentType -Field "Strapline" -ContentType "SupplierNet Page"
Add-SPOFieldToContentType -Field "Strapline2" -ContentType "SupplierNet Page"



