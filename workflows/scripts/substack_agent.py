@echo off
echo Deploying Quiet Authority agent scripts to GitHub...
echo.

set SCRIPT="C:\Users\tdwde\AppData\Roaming\Claude\local-agent-mode-sessions\4501c80b-13db-4d4f-a5cd-46c404ef3585\c0b7d5cd-4fb8-42e5-afe7-bf3626e9b3de\local_f53ab3d3-f4ee-421e-a38a-9d4ee8bdeb9d\outputs\push_to_github.py"
set LOG="%USERPROFILE%\Desktop\deploy_log.txt"

where py >nul 2>&1 && (py %SCRIPT% > %LOG% 2>&1) || (
  where python3 >nul 2>&1 && (python3 %SCRIPT% > %LOG% 2>&1) || (
    echo Python not found. Please install Python from python.org > %LOG%
  )
)

echo === RESULT ===
type %LOG%
echo.
echo Log saved to Desktop as deploy_log.txt
timeout /t 60
