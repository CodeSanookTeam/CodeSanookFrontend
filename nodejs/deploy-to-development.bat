echo off
SET currentDir=%~dp0
echo "current dir %currentDir%"
gradle -b %currentDir%build.gradle restartService -Pconfiguration=development

