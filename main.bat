@echo off
for %%i in (%*) do (
    @if not "%%~xi"==".pdf" (
        echo %%~ni%%~xi is not a PDF file...
    ) else (
        node "%~dp0/main" %%i "%%~ni.csv"
    )
)
pause
