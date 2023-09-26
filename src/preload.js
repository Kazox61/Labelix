const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
    getDirectoryFiles: (directoryPath) => ipcRenderer.invoke('fs:getDirectoryFiles', directoryPath),
    writeFile: (filePath, content) => ipcRenderer.invoke('fs:writeFile', filePath, content),
    getSettings: () => ipcRenderer.invoke('fs:loadSettings'),
    saveSettings: (settings) => ipcRenderer.invoke('fs:saveSettings', settings),
    writeLabels: (imagePath, labels) => ipcRenderer.invoke('fs:writeLabels', imagePath, labels),
    loadProject: (path) => ipcRenderer.invoke('fs:loadProject', path),
    saveProject: (path, labelTypes) => ipcRenderer.invoke('fs:saveProject', path, labelTypes),
})

