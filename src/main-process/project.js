const path = require('path');
const fs = require('fs');
const naturalSort = require('javascript-natural-sort')

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
    
        files.sort(naturalSort)

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
                    "labelBoxesNormalized": parsedBoxes
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
        if (values.length !== 5) return;
        const labelClassIndex = parseInt(values[0]);
        const x = parseFloat(values[1]);
        const y = parseFloat(values[2]);
        const w = parseFloat(values[3]);
        const h = parseFloat(values[4]);

        const isValid = !isNaN(labelClassIndex) && !isNaN(x) && !isNaN(y) && !isNaN(w) && !isNaN(h)

        if (!isValid) return;

        const isInImageBounds = x >= 0 && x <= 1 && y >= 0 && y <= 1 && (x-w/2) >= 0 && (x+w/2) <= 1 && (y-h/2) >= 0 && (y+h/2) <= 1;
        if (!isInImageBounds) return;

        parsedData.push([labelClassIndex, x, y, w, h]);
    })
    return parsedData;
}


module.exports = {
    loadProject   
}