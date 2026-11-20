# 前景啟動訂閱泡泡伺服器（關掉視窗就停止）
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
node server.js
