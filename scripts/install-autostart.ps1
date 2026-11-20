# 設定開機登入後自動在背景啟動伺服器，並用 Tailscale Serve 對應到 tailnet 的 HTTPS 埠
param([int]$TailnetPort = 5443, [int]$LocalPort = 5178)
$ErrorActionPreference = 'Stop'
$vbs = Join-Path $PSScriptRoot 'run-hidden.vbs'
$action = New-ScheduledTaskAction -Execute 'wscript.exe' -Argument "`"$vbs`""
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit ([TimeSpan]::Zero)
Register-ScheduledTask -TaskName 'Subble Server' -Action $action -Trigger $trigger -Settings $settings -Description '訂閱泡泡本機伺服器' -Force | Out-Null
Start-ScheduledTask -TaskName 'Subble Server'
& "$env:ProgramFiles\Tailscale\tailscale.exe" serve --bg --https=$TailnetPort "http://127.0.0.1:$LocalPort"
Write-Host "已設定開機自動啟動。tailnet 網址：" -NoNewline
$dns = (& "$env:ProgramFiles\Tailscale\tailscale.exe" status --json | ConvertFrom-Json).Self.DNSName.TrimEnd('.')
Write-Host "https://${dns}:$TailnetPort/"
