echo off
SET currentFolder=%~dp0
echo %currentFolder%

nssm.exe install codesanook-frontend-production "%currentFolder%node.exe" "app.js"

