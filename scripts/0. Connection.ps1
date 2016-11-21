# OFFICE365 TEST ENVIRONMENT
#$siteurl = "https://architect365.sharepoint.com/sites/SupplierNetTest"
#Connect-SPOnline –Url $siteurl –Credentials architect365-davide

# DEV ENVIRONMENT

#$siteDev = "https://supplier-d-int.unileverservices.com"
#Connect-SPOnline –Url $siteDev -UseWebLogin

# QA ENVIRONMENT

$siteQA = "UPDATE ME"
Connect-SPOnline –Url $siteQA -UseWebLogin