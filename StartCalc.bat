@echo off
set "URL=file:///%~dp0index.html"
start msedge --app="%URL%" --window-size=500,700
exit