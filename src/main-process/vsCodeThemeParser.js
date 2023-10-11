const fs = require('fs');

function readTheme() {
    const themeString = fs.readFileSync("C:\\Users\\pawel\\.vscode\\extensions\\monokai.theme-monokai-pro-vscode-1.2.1\\themes\\Monokai Pro.json");
    return JSON.parse(themeString);
}

function parseTheme(vsCodeTheme) {
    return {
        name: vsCodeTheme.name,
        category: "dark",
        style: {
            foreground: vsCodeTheme.colors.foreground,
            titlebar: {
                background: vsCodeTheme.colors["titleBar.inactiveBackground"],
                menubar: {
                    dropdown: {
                        buttonHoverBackground: "#4f4b5e",
                        content: {
                            background: vsCodeTheme.colors["dropdown.background"],
                            elementHoverBackground: "#7d779c"
                        }
                    }
                }
            },
            activitybar: { 
                background: vsCodeTheme.colors["activityBar.background"],
                foreground: vsCodeTheme.colors["activityBar.inactiveForeground"],
                selectedBackground: vsCodeTheme.colors["activityBar.activeBackground"],
                selectedForeground: vsCodeTheme.colors.foreground
            },
            sidebar: {
                background: vsCodeTheme.colors["sideBar.background"],
                resizeBackground: vsCodeTheme.colors.focusBorder,
                sectionHeaderBackground: vsCodeTheme.colors["sideBarSectionHeader.background"]
            },
            content: {
                containerBackground: vsCodeTheme.colors["editor.background"]
            },
            colorPicker: {
                background: vsCodeTheme.colors["editor.background"],
                bordercolors: vsCodeTheme.colors.focusBorder,
                markerSV: "#ffffff",
                markerHue: "#ffffff"
            },
            list: {
                selectedBackground: vsCodeTheme.colors["list.activeSelectionBackground"],
                hoverBackground: vsCodeTheme.colors["list.hoverBackground"]
            },
            selectedBackground: vsCodeTheme.colors["selection.background"],
            input: {
                background: vsCodeTheme.colors["input.background"],
                foreground: vsCodeTheme.colors["input.foreground"],
                border: vsCodeTheme.colors["input.border"],
                placeholderForeground: vsCodeTheme.colors["input.placeholderForeground"],
                focusBorder: vsCodeTheme.colors.focusBorder
            },
            button: {
                background: vsCodeTheme.colors["button.secondaryBackground"],
                foreground:vsCodeTheme.colors["button.secondaryForeground"],
                hoverBackground: vsCodeTheme.colors["button.secondaryHoverBackground"]
            }
        }
    }
}

function saveTheme(theme) {
    fs.writeFileSync("newTheme.txt", JSON.stringify(theme));
}

const theme = readTheme();
const parsedTheme = parseTheme(theme);
saveTheme(parsedTheme);