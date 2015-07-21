echo off

git checkout development

git pull

git status

set /p msg= Please input your commit comment message?

git add -A 

git commit -am "%msg%"


git push origin development


git status

pause