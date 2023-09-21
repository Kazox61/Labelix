const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');
const nativeImage = require('electron').nativeImage;

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        preload: path.join(__dirname, '../preload.js')
        }
    })

    win.loadFile('static/index.html')
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })

    ipcMain.handle("dialog:openDirectory", async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
        if (!canceled) {
            let dirPath = filePaths[0];
            let dirName = path.basename(dirPath);
            return { dirName, dirPath };
        }
    });

    ipcMain.handle("fs:getDirectoryFiles", async (event, directoryPath) => {
        return new Promise((resolve, reject) => {
            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    const images = {};
                    files.forEach(fileName => {
                        let filePath = path.join(directoryPath, fileName)
                        images[fileName] = filePath;
                    });
                    resolve(images);
                }
            });
        });
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})