const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
    writeFile: (filePath, content) => ipcRenderer.invoke('fs:writeFile', filePath, content),
    loadConfig: () => ipcRenderer.invoke('fs:loadConfig'),
    saveConfig: (config) => ipcRenderer.invoke('fs:saveConfig', config),
    writeLabels: (imagePath, labels) => ipcRenderer.invoke('fs:writeLabels', imagePath, labels),
    loadProject: (path) => ipcRenderer.invoke('fs:loadProject', path),
    saveProject: (path, labelTypes) => ipcRenderer.invoke('fs:saveProject', path, labelTypes),
})

