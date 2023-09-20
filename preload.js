const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
    getDirectoryFiles: (directoryPath) => ipcRenderer.invoke('fs:getDirectoryFiles', directoryPath)
})
