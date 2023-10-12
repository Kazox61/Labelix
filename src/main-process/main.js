const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');
const { loadProject } = require('./project.js');
const { parseTheme } = require('./vsCodeThemeParser.js');

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

    ipcMain.handle('fs:loadConfig', async () => {
        const settingsPath = path.join(app.getPath("userData"), "config.json");
        
        try {
            if (fs.existsSync(settingsPath)) {
                const userData = await fs.promises.readFile(settingsPath, 'utf-8');
                console.log("Load Config from User.");
                return JSON.parse(userData);
            }
            else return null
        } catch (error) {
            console.error("Error reading settings:", error);

            return null
        }
    })

    ipcMain.handle('fs:saveConfig', (event, config) => {
        const settingsPath = path.join(app.getPath("userData"), "config.json");

        fs.writeFile(settingsPath, JSON.stringify(config), (err) => {
            if (err) {
                console.error('Error writing Config:', err);
            } else {
                console.log('Config overwritten successfully.');
            }
        });
    });

    ipcMain.handle("fs:loadProject", async (event, dirPath) => {
        return await loadProject(dirPath);
    });

    ipcMain.handle("fs:saveProject", async (event, dirPath, labelClasses) => {
        const rootPath = path.join(dirPath, ".labelix");
        if (!fs.existsSync(rootPath)) {
            await fs.promises.mkdir(rootPath);
        }
        const labelTypePath = path.join(rootPath, "labelClasses.json");

        await fs.promises.writeFile(labelTypePath, JSON.stringify(labelClasses));
    });

    ipcMain.handle("fs:getThemes", async () => {
        const themesPath = "resources/vsCodeThemes"
        const files = await fs.promises.readdir(themesPath);
        const themes = [];
        for (const fileName of files) {
            themeString = (await fs.promises.readFile(path.join(themesPath, fileName))).toString();
            themes.push(parseTheme(JSON.parse(themeString)));
        }
        return themes;
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})
