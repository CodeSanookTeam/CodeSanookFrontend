echo off
SET curentDir=%~dp0
echo "current dir %currentDir%"
gradle -b %currentDir%build.gradle restartService -Pconfiguration=production

