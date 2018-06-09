# connection
Connect-PnPOnline -Url https://architect365.sharepoint.com/sites/CSA -Credentials architect365-davide

# init logging
$ErrorActionPreference="SilentlyContinue"
Stop-Transcript | out-null
$ErrorActionPreference = "Continue"
$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$OutputFileLocation = $scriptDir +"\1. Deploy Sites.log"
Start-Transcript -path $OutputFileLocation -append

# sites creation
New-PnPWeb -Title "News" -Url "News" -Description "" -Locale 1033 -Template "BLANKINTERNET#0" 
New-PnPWeb -Title "Events" -Url "Events" -Description "" -Locale 1033 -Template "BLANKINTERNET#0" 
New-PnPWeb -Title "Team Sites" -Url "Team-Sites" -Description "" -Locale 1033 -Template "BLANKINTERNET#0" 
New-PnPWeb -Title "Corporate Divisions" -Url "Corporate-Divisions" -Description "" -Locale 1033 -Template "BLANKINTERNET#0"
New-PnPWeb -Title "Internal Resources" -Url "Internal-Resources" -Description "" -Locale 1033 -Template "BLANKINTERNET#0" 

Stop-Transcript
