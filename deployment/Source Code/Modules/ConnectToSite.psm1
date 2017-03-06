Function ConnectToSite([string]$siteUrl, [string]$RootLocation, [string]$credStoreName) { 
    
    $logFilePath = "$RootLocation\ConnectToSiteLog.txt"
    $ErrorActionPreference = "Stop"

    Try {	
        #Write-Host "Connecting to the site..." -ForegroundColor Green
	    Connect-SPOnline -Url $siteUrl -Credential $credStoreName
        #Write-Host "Connected to the site" -ForegroundColor Green
    }
    Catch {
	    $dateTime= Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append 
	    throw  $_.Exception.Message
    }
}
