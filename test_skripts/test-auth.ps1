$apiUrl = "http://localhost:5000/api"

Write-Host "TEST 1: LOGIN" -ForegroundColor Green
$loginBody = '{"email":"test@example.com","password":"test123"}'
$loginResp = Invoke-RestMethod -Uri "$apiUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
$token = $loginResp.token
Write-Host "Token: $($token.Substring(0,20))..." -ForegroundColor Green

Write-Host "`nTEST 2: REGISTER" -ForegroundColor Green
$registerBody = '{"email":"john@example.com","password":"john123456","name":"John Doe"}'
$regResp = Invoke-RestMethod -Uri "$apiUrl/auth/register" -Method Post -ContentType "application/json" -Body $registerBody
Write-Host "New user: $($regResp.user.email)" -ForegroundColor Green

Write-Host "`nTEST 3: PROFILE (Protected)" -ForegroundColor Green
$headers = @{Authorization="Bearer $token"}
$profileResp = Invoke-RestMethod -Uri "$apiUrl/auth/profile" -Method Get -Headers $headers
Write-Host "User: $($profileResp.user.name) ($($profileResp.user.email))" -ForegroundColor Green

Write-Host "`nTEST 4: RESTAURANTS" -ForegroundColor Green
$restResp = Invoke-RestMethod -Uri "$apiUrl/restaurants" -Method Get
Write-Host "Found $($restResp.Count) restaurants:" -ForegroundColor Green
$restResp | ForEach-Object { Write-Host "  - $($_.name)" -ForegroundColor Green }

Write-Host "`nTEST 5: MENU" -ForegroundColor Green
$menuResp = Invoke-RestMethod -Uri "$apiUrl/restaurants/1/menu" -Method Get
Write-Host "Found $($menuResp.Count) menu items:" -ForegroundColor Green
$menuResp | ForEach-Object { Write-Host "  - $($_.name) (`$$($_.price))" -ForegroundColor Green }

Write-Host "`nAll tests completed!" -ForegroundColor Cyan
