@echo off

REM Get the current directory
set "base_directory=%cd%"

REM Open PowerShell and run Python file
start powershell.exe -Command "python '%base_directory%\routes\CustDev\Core.py'"

REM Open another PowerShell and run Node.js file
start powershell.exe -Command "node '%base_directory%\routes\ClientDev\server.js'"

REM Open another PowerShell and run Node.js file
start powershell.exe -Command "node '%base_directory%\routes\ParkDev\parking\server.js'"

REM Change directory to the base directory
cd /d "%base_directory%"

REM Set the relative path to the folder containing manage.py
set "manage_directory=routes\CustDev\bot\"

REM Change directory to the folder containing manage.py
cd /d "%base_directory%\%manage_directory%"

REM Open PowerShell and run Python command
start powershell.exe -Command "python manage.py runserver"

timeout /t 5 /nobreak >nul
start "" "http://127.0.0.1:5000/"

