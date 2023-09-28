const path = require('path');
const fs = require('fs');

async function loadProject(rootPath) {
    const projectPath = path.join(rootPath, ".labelix");
    let labelClasses = [];
    if (fs.existsSync(projectPath)) {

        const labelClassesPath = path.join(projectPath, "labelClasses.json");
        if (fs.existsSync(labelClassesPath)) {
            const labelClassesData = await fs.promises.readFile(labelClassesPath, 'utf-8');
            labelClasses =  JSON.parse(labelClassesData);
        }
    }
    else {
        await fs.promises.mkdir(projectPath);
    }

    const images = await getImages(rootPath);


    return { "labelClasses": labelClasses, "images": images };
}


async function getImages(dirPath) {
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
    } 
    catch (err) {
        console.error("Error reading directory:", err);
        throw err;
    }
}


function parseLabelBoxes(boxes) {
    if (boxes === null) {
        return [];
    }
    const parsedData = []
    const lines = boxes.split("\n");
    lines.forEach(line => {
        const values = line.split(" ");
        parsedData.push([parseInt(values[0]), parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3]), parseFloat(values[4])]);
    })
    return parsedData;
}


module.exports = {
    loadProject   
}