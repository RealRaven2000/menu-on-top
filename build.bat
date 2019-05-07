set /P menuOnTopRev=<revision.txt
set /a oldRev=%menuOnTopRev%
set /a menuOnTopRev+=1
REM replace previous rev with new gc -en utf8 
pwsh -Command "(gc -en UTF8NoBOM install.rdf) -replace 'pre%oldRev%'.trim(), 'pre%menuOnTopRev%' | Out-File install.rdf"
"C:\Program Files\7-Zip\7z" a -xr!.svn menuOnTop.zip avatars chrome skin install.rdf icon.png chrome.manifest bootstrap.js
echo %menuOnTopRev% > revision.txt
move *.xpi "..\..\Test\1.15\"
pwsh -Command "Start-Sleep -m 150"
rename menuOnTop.zip menuOnTop-1.15pre%menuOnTopRev%.xpi
