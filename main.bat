@echo off
del "%~dp1*.csv"
for %%i in (%*) do (
    @if not "%%~xi"==".pdf" (
        echo %%~nxi is not a PDF file...
    ) else (
        node "%~dp0/main" %%i "%%~ni.csv"
    )
)
::copy "%~dp0title.csv"+"%~dp1*.csv" "%~dp1all.csv"
::attrib +r "%~dp1all.csv"
::del "%~dp1*.csv"
::attrib -r "%~dp1all.csv"
pause
