const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
    getDirectoryFiles: (directoryPath) => ipcRenderer.invoke('fs:getDirectoryFiles', directoryPath)
})

contextBridge.exposeInMainWorld('windowAPI', {
    close: () => ipcRenderer.invoke('window:close'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    minimize: () => ipcRenderer.invoke('window:minimize')
})
