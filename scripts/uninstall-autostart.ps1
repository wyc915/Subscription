# 移除開機自動啟動與 Tailscale 對應（資料檔 data\ 不會被刪除）
param([int]$TailnetPort = 5443, [int]$LocalPort = 5178)
Unregister-ScheduledTask -TaskName 'Subble Server' -Confirm:$false -ErrorAction SilentlyContinue
# 只停止正在監聽本專案埠號的 node 程序，不影響其他專案
Get-NetTCPConnection -LocalPort $LocalPort -State Listen -ErrorAction SilentlyContinue |
  ForEach-Object { Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue } |
  Where-Object { $_.ProcessName -eq 'node' } |
  Stop-Process -Force
& "$env:ProgramFiles\Tailscale\tailscale.exe" serve --https=$TailnetPort off
Write-Host '已移除自動啟動與 Tailscale 對應。'
