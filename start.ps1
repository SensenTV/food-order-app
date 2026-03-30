# Food Order App - Startup Script
# Startet Frontend und Backend, oder restartet sie falls sie laufen

$appRoot = Get-Location
$backendPath = Join-Path $appRoot "backend"

Write-Host ""
Write-Host "======================================"
Write-Host "  FOOD ORDER APP - STARTUP SCRIPT"
Write-Host "======================================"
Write-Host ""
Write-Host "App Root: $appRoot" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill old processes
Write-Host "[1/5] Checking for running Node processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue

if ($nodeProcesses.Count -gt 0) {
    Write-Host "  Stopping $($nodeProcesses.Count) old process(es)..." -ForegroundColor Yellow
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "  [OK] Old processes stopped" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "  [OK] No running processes found" -ForegroundColor Green
    Write-Host ""
}

# Step 2: Run Backend Seed
Write-Host "[2/5] Running Backend Seed..." -ForegroundColor Yellow

if (-Not (Test-Path $backendPath)) {
    Write-Host "  [ERROR] Backend path not found: $backendPath" -ForegroundColor Red
    exit 1
}

$seedPathSrc = Join-Path $backendPath "src\seed.js"
$seedPathRoot = Join-Path $backendPath "seed.js"

if (Test-Path $seedPathSrc) {
    & node $seedPathSrc
} elseif (Test-Path $seedPathRoot) {
    & node $seedPathRoot
} else {
    Write-Host "  [ERROR] seed.js not found (checked src\seed.js and seed.js)" -ForegroundColor Red
    exit 1
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "  [ERROR] Seed failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit 1
} else {
    Write-Host "  [OK] Seed executed successfully" -ForegroundColor Green
    Write-Host ""
}

# Step 3: Start Backend
Write-Host "[3/5] Starting Backend Server..." -ForegroundColor Yellow

$backendProcess = Start-Process -NoNewWindow -FilePath "node" -ArgumentList "src/server.js" -WorkingDirectory $backendPath -PassThru

if ($backendProcess) {
    Write-Host "  [OK] Backend started (PID: $($backendProcess.Id))" -ForegroundColor Green
    Write-Host "  URL: http://localhost:5000" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "  [ERROR] Failed to start Backend!" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 3

# Step 4: Start Frontend
Write-Host "[4/5] Starting Frontend Server..." -ForegroundColor Yellow
$frontendPath = Join-Path $appRoot "frontend"

if (-Not (Test-Path $frontendPath)) {
    Write-Host "  [ERROR] Frontend path not found: $frontendPath" -ForegroundColor Red
    exit 1
}

$frontendProcess = Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList '/c npm run dev' -WorkingDirectory $frontendPath -PassThru

if ($frontendProcess) {
    Write-Host "  [OK] Frontend started (PID: $($frontendProcess.Id))" -ForegroundColor Green
    Write-Host "  URL: http://localhost:5173" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "  [ERROR] Failed to start Frontend!" -ForegroundColor Red
    exit 1
}

# Step 5: Status
Write-Host "[5/5] All servers running" -ForegroundColor Green
Write-Host ""
Write-Host "======================================"
Write-Host "  SERVERS RUNNING"
Write-Host "======================================"
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "TIP: Open http://localhost:5173 in your browser" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to shutdown all servers"
Write-Host ""

# Monitor and cleanup
try {
    while ($true) {
        Start-Sleep -Seconds 5
        
        $backendStill = Get-Process -Id $backendProcess.Id -ErrorAction SilentlyContinue
        $frontendStill = Get-Process -Id $frontendProcess.Id -ErrorAction SilentlyContinue
        
        if (-not $backendStill -or -not $frontendStill) {
            Write-Host ""
            Write-Host "WARNING: A server has stopped!" -ForegroundColor Red
            if (-not $backendStill) { Write-Host "  Backend is not running" -ForegroundColor Red }
            if (-not $frontendStill) { Write-Host "  Frontend is not running" -ForegroundColor Red }
            Write-Host ""
            exit 1
        }
    }
} 
catch {
    Write-Host ""
    Write-Host "Shutting down servers..." -ForegroundColor Yellow
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "All servers stopped" -ForegroundColor Green
    exit 0
}