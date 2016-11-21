# connection
'.\0. Connection.ps1'

# vars declaration


$columnsGroup = "SupplierNet Redesign"


# Add Text site columns
Add-SPOField -DisplayName "Strapline" -InternalName "Strapline" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Strapline2" -InternalName "Strapline2" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Name" -InternalName "ItemName" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Location" -InternalName "ItemLocation" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Email" -InternalName "Email" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Byline" -InternalName "Byline" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Full Name" -InternalName "ItemFullName" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Company" -InternalName "ItemCompany" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Address Line 1" -InternalName "AddressLine1" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Address Line 2" -InternalName "AddressLine2" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Post/Zip code" -InternalName "PostCode" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Position Title" -InternalName "PositionTitle" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Phone Number" -InternalName "PhoneNumber" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Director Name" -InternalName "DirectorName" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "VP Name" -InternalName "VpName" -Group $columnsGroup -Type Text -Required
Add-SPOField -DisplayName "Icon" -InternalName "ItemIcon" -Group $columnsGroup -Type Text
Add-SPOField -DisplayName "Unilever Buyer Contact" -InternalName "BuyerContact" -Group $columnsGroup -Type Text

Add-SPOField -DisplayName "Document Description 1" -InternalName "DocumentDescription1" -Group $columnsGroup -Type Note
Add-SPOField -DisplayName "Document Description 2" -InternalName "DocumentDescription2" -Group $columnsGroup -Type Note


# Add Boolean site columns
Add-SPOField -DisplayName "Visited" -InternalName "Visited" -Group $columnsGroup -Type Boolean -Required 
Add-SPOField -DisplayName "External User" -InternalName "ExternalUser" -Group $columnsGroup -Type Boolean -Required 
Add-SPOField -DisplayName "Event Page" -InternalName "EventPage" -Group $columnsGroup -Type Boolean -Required 


# Add Choice site columns
Add-SPOField -DisplayName "My Reports Categories" -InternalName "MyReportsCategories" -Group $columnsGroup -Type Choice -Choices @("Global reports","Cluster reports","Collaboration")
Add-SPOField -DisplayName "My Reports Subcategories" -InternalName "MyReportsSubcategories" -Group $columnsGroup -Type Choice -Choices @("Video tutorials","Details reports","Summary reports")  
Add-SPOField -DisplayName "Third Party Manufacture Quality Manual" -InternalName "ThirdPartyMQM" -Group $columnsGroup -Type Choice -Choices @("Unilever Product Requirements","Traceability and Lot Coding","Product Quality Verification and Due Diligence Program", "Storage", "Transport & Delivery", "Non-Conformance Management", "Weight Monitoring and Control", "Regulatory Verification", "Change Notification")
Add-SPOField -DisplayName "Link Type" -InternalName "ItemType" -Group $columnsGroup -Type Choice -Choices @("Link","Language","Search") -Required
Add-SPOField -DisplayName "Visibility" -InternalName "ItemVisibility" -Group $columnsGroup -Type MultiChoice -Choices @("Unilever","Suppliers") -Required
Add-SPOField -DisplayName "Category" -InternalName "CategoryType" -Group $columnsGroup -Type Choice -Choices @("Generic Information","Supplier Specific Information")
Add-SPOField -DisplayName "Document Type" -InternalName "QasSubSubCategory" -Group $columnsGroup -Type Choice -Choices @("Mix-Up Avoidance Instructions","Traceability and Lot Coding","Unilever Product Requirement")

# Add Hyperlink site columns
Add-SPOField -DisplayName "URL" -InternalName "ItemURL" -Group $columnsGroup -Type URL -Required
Add-SPOField -DisplayName "Programme" -InternalName "Programme" -Group $columnsGroup -Type URL -Required
Add-SPOField -DisplayName "Venue Information" -InternalName "VenueInformation" -Group $columnsGroup -Type URL -Required
Add-SPOField -DisplayName "Document Link 1" -InternalName "DocumentLink1" -Group $columnsGroup -Type URL
Add-SPOField -DisplayName "Document Link 2" -InternalName "DocumentLink2" -Group $columnsGroup -Type URL

# Add Number site columns
Add-SPOField -DisplayName "Item Order" -InternalName "ItemOrder" -Group $columnsGroup -Type Number -Required
Add-SPOField -DisplayName "User Id" -InternalName "UserId" -Group $columnsGroup -Type Number -Required

# Add Image site columns
$xmlThumbnail = '<Field ID="{2f240f7c-044e-4cb0-a3f1-17d6a017651b}" Type="Image" Name="ItemThumbnail" DisplayName="Thumbnail" Group="SupplierNet Redesign" Required="FALSE" Sealed="FALSE" RichText="TRUE" RichTextMode="FullHtml" DisplaceOnUpgrade="TRUE"></Field>'
$xmlProfile   = '<Field ID="{fbb9bcae-9c21-439b-8d69-959aa3d5c89f}" Type="Image" Name="ProfileImage" DisplayName="Profile Image" Group="SupplierNet Redesign" Required="FALSE" Sealed="FALSE" RichText="TRUE" RichTextMode="FullHtml" DisplaceOnUpgrade="TRUE"></Field>'
Add-SPOFieldFromXml -FieldXml $xmlThumbnail
Add-SPOFieldFromXml -FieldXml $xmlProfile

# Add lookup
$listNavigation = Get-SPOList "Global Navigation"
$xmlParent = '<Field ID="{69FCEC38-3F15-48DB-891E-D76EF66A02A4}" Name="ItemParent" Group="SupplierNet Redesign" Type="Lookup" List="'+$listNavigation.ID+'" ShowField="Title" DisplayName="Parent" Required="false" UnlimitedLengthInDocumentLibrary="FALSE" ></Field>'
Add-SPOFieldFromXml -FieldXml $xmlParent 
$listPillars = Get-SPOList "Pillars"

$xmlPillars = '<Field ID="{5863c777-1e43-4d1f-bc59-17897e258929}" Name="UserPillars" Group="SupplierNet Redesign" Type="LookupMulti" List="'+$listPillars.ID+'" ShowField="Title" Mult="TRUE" DisplayName="User Pillars" Required="false" UnlimitedLengthInDocumentLibrary="FALSE"></Field>'
Add-SPOFieldFromXml -FieldXml $xmlPillars

$xmlPillars2 = '<Field ID="{15955927-fb4a-4e64-a5ab-88395423dd32}" Name="Pillars" Group="SupplierNet Redesign" Type="LookupMulti" List="'+$listPillars.ID+'" ShowField="Title" Mult="TRUE" DisplayName="Pillars" Required="false" UnlimitedLengthInDocumentLibrary="FALSE"></Field>'
Add-SPOFieldFromXml -FieldXml $xmlPillars2

$listPages = Get-SPOList "Pages" -web "Partner to Win/Partner to Win Event"
$xmlEvent = '<Field ID="{ff4d1ea1-f17b-481c-b6f9-b3f0a6977c20}" Name="EventLookup" Group="SupplierNet Redesign" Type="Lookup" List="'+$listPages.ID+'" ShowField="Title" DisplayName="Event" Required="false" UnlimitedLengthInDocumentLibrary="FALSE"></Field>'
Add-SPOFieldFromXml -FieldXml $xmlEvent -List "Event Registrations" -web "Partner to Win/Partner to Win Event" 

$listPhotos = Get-SPOList "User Photos" -web "Partner to Win/Partner to Win Event"
$xmlPhoto = '<Field ID="{8d81e1fb-24d5-4317-8113-c093d80092ee}" Name="ProfileImageLookUp" Group="SupplierNet Redesign" Type="Lookup" List="'+$listPhotos.ID+'" ShowField="Title" DisplayName="Profile Image" Required="false" UnlimitedLengthInDocumentLibrary="FALSE"></Field>'
Add-SPOFieldFromXml -FieldXml $xmlPhoto -List "Event Registrations" -web "Partner to Win/Partner to Win Event" 

$listCategories = Get-SPOList "Quality and Services Categories" -web "Partner to Win/Quality and Services"
$xmlQasCategory = '<Field ID="{11c517c7-3bbf-4701-b5d5-265c4261c0b2}" Name="QasCategory" Group="SupplierNet Redesign" Type="Lookup" List="'+$listCategories.ID+'" ShowField="Title" DisplayName="Quality and Services Category" Required="false" UnlimitedLengthInDocumentLibrary="FALSE"></Field>'
Add-SPOFieldFromXml -FieldXml $xmlQasCategory -List "Quality and Services Documents" -web "Partner to Win/Quality and Services" 

$listSpecificCat = Get-SPOList "Suppliers Specific Categories" -web "Partner to Win/Quality and Services"
$xmlQasSubCategory = '<Field ID="{8d827b2b-46f2-4cc5-9103-c75e988ea60f}" Name="QasSubCategory" Group="SupplierNet Redesign" Type="Lookup" List="'+$listSpecificCat.ID+'" ShowField="Title" DisplayName="Supplier Specific Category" Required="false" UnlimitedLengthInDocumentLibrary="FALSE"></Field>'
Add-SPOFieldFromXml -FieldXml $xmlQasSubCategory -List "Quality and Services Documents" -web "Partner to Win/Quality and Services" 




