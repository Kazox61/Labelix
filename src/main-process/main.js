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

    ipcMain.handle("fs:getDirectoryFiles", async (event, dirPath) => {
        try {
            const files = await fs.promises.readdir(dirPath);
            const data = [];
        
            for (const fileName of files) {
                const filePath = path.join(dirPath, fileName);
                const suffix = path.extname(fileName);
                const textName = fileName.replace(suffix, ".txt");
        
                if ([".png", ".jpeg", ".jpg"].includes(suffix.toLowerCase())) {
                    const labelFilePath = path.join(dirPath, textName);
                    let labelBoxes = null;

                    if (files.includes(textName)) {
                        try {
                            labelBoxes = (await fs.promises.readFile(labelFilePath)).toString();

                        } catch (err) {
                            console.error("Error reading label data:", err);
                        }
                    }
                    let parsedBoxes = parseLabelBoxes(labelBoxes);
                    data.push({
                        "name": fileName,
                        "imagePath": filePath,
                        "labelBoxes": parsedBoxes
                    });
                }
            }
            return data;
          } catch (err) {
            console.error("Error reading directory:", err);
            throw err;
          }
    });

    ipcMain.handle("fs:writeLabels", (event, imagePath, labels) => {
        let content = ""
        labels.forEach((label) => {
            content += label.join(" ") + "\n";
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

function parseLabelBoxes(boxes) {
    if (boxes === null) {
        return [];
    }
    const parsedData = []
    const lines = boxes.split("\n");
    lines.forEach(line => {
        const values = line.split(" ");
        parsedData.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3])]);
    })
    return parsedData;
}