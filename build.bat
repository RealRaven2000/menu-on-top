set /P menuOnTopRev=<revision.txt
set /a oldRev=%menuOnTopRev%
set /a menuOnTopRev+=1
REM replace previous rev with new gc -en utf8 
pwsh -Command "(gc -en UTF8NoBOM install.rdf) -replace 'pre%oldRev%'.trim(), 'pre%menuOnTopRev%' | Out-File install.rdf"
pwsh -Command "(gc -en UTF8NoBOM manifest.json) -replace 'pre%oldRev%'.trim(), 'pre%menuOnTopRev%' | Out-File manifest.json"
"C:\Program Files\7-Zip\7z" a -xr!.svn menuOnTop.zip avatars chrome skin install.rdf manifest.json icon.png chrome.manifest bootstrap.js
echo %menuOnTopRev% > revision.txt
move *.xpi "..\..\Test\1.16\"
pwsh -Command "Start-Sleep -m 150"
rename menuOnTop.zip menuOnTop-1.16pre%menuOnTopRev%.xpi
