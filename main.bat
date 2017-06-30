@echo off
@if not "%~x1"==".pdf" (
    echo ≥o§£¨OPDF¿….../It's not a PDF file...
) else (
    node "%~dp0/main" %1 "%~n1.csv"
)
start "" "%~n1.csv"
