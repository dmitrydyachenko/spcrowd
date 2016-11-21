# connection
& '.\0. Connection.ps1'

# ROOT SITE LISTS
New-SPOList -Title "Header Links" -Template GenericList -EnableContentTypes 
New-SPOList -Title "Global Navigation" -Template GenericList -EnableContentTypes
New-SPOList -Title "Footer Links" -Template GenericList -EnableContentTypes
New-SPOList -Title "Pillars" -Template GenericList -EnableContentTypes
New-SPOList -Title "User Preferences" -Template GenericList -EnableContentTypes
New-SPOList -Title "I Need To" -Template GenericList -EnableContentTypes
New-SPOList -Title "Report Shortcuts" -Template GenericList -EnableContentTypes
New-SPOList -Title "Regional Cluster Leaders" -Template GenericList -EnableContentTypes

# PARTNER TO WIN LISTS AND DOCUMENT LIBRARIES

New-SPOList -Title "Third Party Manufacture Quality Manual Featured Links" -Template GenericList -EnableContentTypes -Web "Partner to Win"

New-SPOList -Title "Quality and Service Documents" -Template DocumentLibrary -EnableContentTypes -Web "Partner to Win"
New-SPOList -Title "Supplier Quality Manual Documents" -Template DocumentLibrary -EnableContentTypes -Web "Partner to Win"
New-SPOList -Title "Third Party Manufacture Quality Manual" -Template DocumentLibrary -EnableContentTypes -Web "Partner to Win"
New-SPOList -Title "PTW Home Page Links" -Template GenericList -EnableContentTypes -Web "Partner to Win"


# PARTNER TO WIN EVENT LIST
New-SPOList -Title "Event Registrations" -Template GenericList -EnableContentTypes -Web "Partner to Win/Partner to Win Event"
New-SPOList -Title "User Photos" -Template PictureLibrary -EnableContentTypes -Web "Partner to Win/Partner to Win Event"

# QUALITY AND SERVICES LISTS
New-SPOList -Title "Quality and Services Categories" -Template GenericList -EnableContentTypes -Web "Partner to Win/Quality and Services"
New-SPOList -Title "Suppliers Specific Categories" -Template GenericList -EnableContentTypes -Web "Partner to Win/Quality and Services"
New-SPOList -Title "Quality and Services Documents" -Template DocumentLibrary -EnableContentTypes -Web "Partner to Win/Quality and Services"

# TRAINING DOCUMENT LIBRARIES

New-SPOList -Title "CAM Guides" -Template DocumentLibrary -EnableContentTypes -Web "Training"
New-SPOList -Title "Code and Policies" -Template DocumentLibrary -EnableContentTypes -Web "Training"
New-SPOList -Title "Specifications System" -Template DocumentLibrary -EnableContentTypes -Web "Training"

