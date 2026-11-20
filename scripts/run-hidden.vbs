' 由排程工作呼叫：在背景（無視窗）啟動伺服器，輸出寫到 data\server.log
Set fso = CreateObject("Scripting.FileSystemObject")
root = fso.GetParentFolderName(fso.GetParentFolderName(WScript.ScriptFullName))
If Not fso.FolderExists(root & "\data") Then fso.CreateFolder(root & "\data")
Set sh = CreateObject("WScript.Shell")
sh.CurrentDirectory = root
sh.Run "cmd /c node server.js >> data\server.log 2>&1", 0, False
