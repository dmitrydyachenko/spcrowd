# connection
& '.\0. Connection.ps1'

# sites creation

New-SPOWeb -Title "Partner to Win" -Url "Partner to Win" -Description "" -Locale 1033 -Template "BLANKINTERNET#0"
New-SPOWeb -Title "Partner to Win Event" -Url "Partner to Win Event" -Description "" -Locale 1033 -Template "BLANKINTERNET#0" -Web "Partner to Win"
New-SPOWeb -Title "Quality and Services" -Url "Quality and Services" -Description "" -Locale 1033 -Template "BLANKINTERNET#0" -Web "Partner to Win"
