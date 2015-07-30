echo off

git checkout master

git pull

git merge --no-ff development

git status


git push origin master


git status

pause