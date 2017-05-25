Function AddFiles
{
  	Param([String]$SourceDir, [String]$TargetDir, [string]$LogFilePath, [string]$SubSite)

	Try
	{
		if($SubSite.length -eq 0)
		{
			$Web = Get-PnPWeb
		}
		else
		{
			$Web = Get-PnPWeb -Identity $SubSite	
		}

		$Files =  Get-ChildItem $SourceDir

		for($i = 0; $i -lt $Files.Count; $i++)
		{
			if($Files[$i].Attributes -ne "Directory")
			{
				Add-PnPFile -Path $Files[$i].FullName -folder $TargetDir -Checkout -Web $Web
			     
				$DateTime= Get-Date
				"Time:" + $DateTime + " Successfully added file:" + $Files[$i].FullName + "in $TargetDir folder "| Out-File $logFilePath –append
			}
		}
	}
	Catch
	{          
		$DateTime= Get-Date
		Write "Time: $DateTime  Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)"
		throw  $_.Exception.Message
	}
}

Function AddSolutionFiles
{
	Param([String]$SourceDir, [String]$TargetDir, [string]$LogFilePath)

	Try
	{
		$Files =  Get-ChildItem $SourceDir

		for($i = 0; $i -lt $Files.Count; $i++)
		{
			if($Files[$i].Attributes -ne "Directory")
			{
				Add-PnPFile -Path $Files[$i].FullName -folder $TargetDir -Checkout
				$DateTime= Get-Date
				Write "Time:" + $DateTime + " Successfully added file:" + $Files[$i].FullName + "in $TargetDir folder "
			}
		}
	}
	Catch
	{          
		$DateTime= Get-Date
		Write "Time: $DateTime  Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)"
		throw  $_.Exception.Message
	}
}
