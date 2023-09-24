const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');

function createWindow () {
    const win = new BrowserWindow({
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            height: 25,
            color: '#ffffff00',
            symbolColor: '#ffffff'
        },
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '../preload.js')
        }
    })
    
    win.loadFile('static/index.html')
    return win
}

app.whenReady().then(() => {
    let win = createWindow();

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

    ipcMain.handle("fs:writeLabels", (event, imagePath, labels) => {
        let content = ""
        labels.forEach((label) => {
            content += `${label.x} ${label.y} ${label.w} ${label.h}\n`;
        });
        const imageName = path.basename(imagePath);
        const dirPath = path.dirname(imagePath);
        const suffix = path.extname(imageName);
        const labelFilePath = path.join(dirPath, imageName.replace(suffix, ".txt"));
        fs.writeFile(labelFilePath, content, () => {
            
        });
    });

    ipcMain.handle('fs:loadSettings', async () => {
        const settingsPath = path.join(app.getPath("userData"), "settings.json");
        
        try {
            if (fs.existsSync(settingsPath)) {
                const userData = await fs.promises.readFile(settingsPath, 'utf-8');
                console.log("Load Settings from User.");
                return JSON.parse(userData);
            } else {
                console.log("User settings file not found, loading Default Settings.");
                const defaultData = await fs.promises.readFile(path.join(__dirname, "../../static/defaultSettings.json"), 'utf-8');
                return JSON.parse(defaultData);
            }
        } catch (error) {
            console.error("Error reading settings:", error);

            throw error;
        }
    })

    ipcMain.handle('fs:saveSettings', (event, settings) => {
        const settingsPath = path.join(app.getPath("userData"), "settings.json");

        fs.writeFile(settingsPath, JSON.stringify(settings), (err) => {
            if (err) {
            console.error('Error writing Settings:', err);
            } else {
            console.log('Settings overwritten successfully.');
            }
        });
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})