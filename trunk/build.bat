"C:\Program Files\7-Zip\7z" a -xr!.svn menuOnTop.zip chrome install.rdf icon.png chrome.manifest bootstrap.js
set /P menuOnTopRev=<revision.txt
set /a menuOnTopRev+=1
echo %menuOnTopRev% > revision.txt
move *.xpi "..\Test\0.9.9\"
rename menuOnTop.zip menuOnTop-0.9.9pre%menuOnTopRev%.xpi
