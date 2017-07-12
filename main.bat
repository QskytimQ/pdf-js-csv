@echo off
if exist %~dp1*.csv del "%~dp1*.csv"
for %%i in (%*) do (
    if not "%%~xi"==".pdf" (
        echo %%~nxi is not a PDF file...
    ) else (
        node "%~dp0main" %%i "%%~dpni.csv"
        if not exist "%%~dpiresults" md "%%~dpiresults"
        copy /b "%~dp0title.csv"+"%%~dpni.csv" "%%~dpiresults\%%~ni.csv"
    )
)
copy /b "%~dp0title.csv"+"%~dp1*.csv" "%~dp1results\all.csv"
del "%~dp1*.csv"
pause
