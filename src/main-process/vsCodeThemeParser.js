const fs = require('fs');

function parseTheme(vsCodeTheme) {
    return {
        name: vsCodeTheme.name,
        category: "dark",
        style: {
            foreground: vsCodeTheme.colors.foreground,
            titlebar: {
                foreground: vsCodeTheme.colors["titleBar.activeForeground"],
                background: vsCodeTheme.colors["titleBar.activeBackground"],
                border: vsCodeTheme.colors["titleBar.border"],
                menubar: {
                    dropdown: {
                        buttonHoverBackground: vsCodeTheme.colors["button.secondaryHoverBackground"],
                        content: {
                            background: vsCodeTheme.colors["dropdown.background"],
                            elementHoverBackground: vsCodeTheme.colors["button.hoverBackground"]
                        }
                    }
                }
            },
            activitybar: { 
                border: vsCodeTheme.colors["activityBar.border"],
                background: vsCodeTheme.colors["activityBar.background"],
                foreground: vsCodeTheme.colors["activityBar.inactiveForeground"],
                selectedBackground: vsCodeTheme.colors["activityBar.activeBackground"],
                selectedForeground: vsCodeTheme.colors["activityBar.foreground"],
                selectedBorder: vsCodeTheme.colors["activityBar.activeBorder"]
            },
            sidebar: {
                border: vsCodeTheme.colors["sideBar.border"],
                background: vsCodeTheme.colors["sideBar.background"],
                resizeBackground: vsCodeTheme.colors.focusBorder,
                sectionHeaderBackground: vsCodeTheme.colors["sideBarSectionHeader.background"]
            },
            content: {
                containerBackground: vsCodeTheme.colors["editor.background"],
                tab: {
                    foreground: vsCodeTheme.colors["tab.inactiveForeground"],
                    border: vsCodeTheme.colors["tab.border"],
                    background: vsCodeTheme.colors["tab.inactiveBackground"],
                    hoverBackground: vsCodeTheme.colors["tab.hoverBackground"],
                    selectedForeground: vsCodeTheme.colors["tab.activeForeground"],
                    selectedBorder: vsCodeTheme.colors["tab.activeBorder"],
                    selectedBorderTop: vsCodeTheme.colors["tab.activeBorderTop"],
                    selectedBackground: vsCodeTheme.colors["tab.activeBackground"]
                },
                settings: {
                    navbarBorder: vsCodeTheme.colors["tab.border"],
                    fieldHoverBackground: vsCodeTheme.colors["list.hoverBackground"] || "#2a2d2e",
                    tableStripedBackground: vsCodeTheme.colors["list.activeSelectionBackground"] || "#37373d",
                    dropdownBackground: vsCodeTheme.colors["settings.dropdownBackground"],
                    dropdownBorder: vsCodeTheme.colors["settings.dropdownBorder"],
                    dropdownForeground: vsCodeTheme.colors["settings.dropdownForeground"] || vsCodeTheme.colors.foreground,
                    dropdownOptionHoverBackground: vsCodeTheme.colors["list.hoverBackground"] || vsCodeTheme.colors["selection.background"] || "#0078d4",
                }
            },
            colorPicker: {
                background: vsCodeTheme.colors["editor.background"],
                border: vsCodeTheme.colors["tab.border"],
                markerSV: vsCodeTheme.colors.foreground,
                markerHue: vsCodeTheme.colors.foreground
            },
            contextMenu: {
                background: vsCodeTheme.colors["dropdown.background"],
                hoverBackground: vsCodeTheme.colors["list.hoverBackground"] || vsCodeTheme.colors["selection.background"] || "#0078d4"
            },
            list: {
                selectedBackground: vsCodeTheme.colors["list.activeSelectionBackground"] || "#37373d",
                hoverBackground: vsCodeTheme.colors["list.hoverBackground"] || "#2a2d2e",
            },
            selectedBackground: vsCodeTheme.colors["selection.background"] || "#0078d4",
            input: {
                background: vsCodeTheme.colors["input.background"],
                foreground: vsCodeTheme.colors["input.foreground"],
                border: vsCodeTheme.colors["input.border"],
                placeholderForeground: vsCodeTheme.colors["input.placeholderForeground"],
                focusBorder: vsCodeTheme.colors.focusBorder
            },
            button: {
                background: vsCodeTheme.colors["button.background"] || vsCodeTheme.colors["button.secondaryBackground"],
                foreground: vsCodeTheme.colors["button.foreground"] || vsCodeTheme.colors["button.secondaryForeground"],
                hoverBackground: vsCodeTheme.colors["button.hoverBackground"] || vsCodeTheme.colors["button.secondaryHoverBackground"]
            }
        }
    }
}

module.exports = {
    parseTheme   
}