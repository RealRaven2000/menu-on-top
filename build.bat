"C:\Program Files\7-Zip\7z" a -xr!.svn menuOnTop.zip chrome skin install.rdf icon.png chrome.manifest bootstrap.js
set /P menuOnTopRev=<revision.txt
set /a menuOnTopRev+=1
echo %menuOnTopRev% > revision.txt
move *.xpi "..\..\Test\1.0\"
rename menuOnTop.zip menuOnTop-1.0pre%menuOnTopRev%.xpi
