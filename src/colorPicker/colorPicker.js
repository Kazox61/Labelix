const defaultSettings = {
    parent: null,
    anchor: null,
    defaultColor: "#ff0000"
}

export class ColorPicker {
    constructor(options) {
        this.settings = defaultSettings;
        this.configure(options);
        this.parentContainerNode = this.settings.parent;
        this.anchorNode = this.settings.anchor;
        this.isInAnchorArea = false;
        this.isInColorPickerArea = false;
        this.hasColorPicker = false;
        this.isMouseDownSVMap = false;
        this.isMouseDownHueMap = false;
        this.hue = 0; //from 0 to 360
        this.saturation = 1; //from 0 to 1
        this.value = 1; //from 0 to 1

        this.anchorNode.addEventListener("mouseenter", () => {
            this.isInAnchorArea = true;
            if (this.timerColorPickerArea != null) {
                clearTimeout(this.timerColorPickerArea);
            }
            if (!this.hasColorPicker) this.create();
        })
        
        
        this.anchorNode.addEventListener("mouseleave", () => {
            this.isInAnchorArea = false;
            this.timerAnchorArea = setTimeout(() => {
                if (!this.isInColorPickerArea && this.hasColorPicker) {
                    this.parentContainerNode.removeChild(this.colorPickerNode);
                    this.hasColorPicker = false;
                };
            }, 500);
        });
    }

    configure(options) {
        if (typeof options !== 'object') {
            return;
        }

        for (const key in options) {
            switch (key) {
                default:
                    this.settings[key] = options[key];
            }
        }
    }

    create() {
        this.hasColorPicker = true;
        this.colorPickerNode = document.createElement("div");
        this.colorPickerNode.className = "colorPicker";
        this.parentContainerNode.appendChild(this.colorPickerNode);

        this.colorPickerPrieview = document.createElement("div");
        this.colorPickerPrieview.className = "colorPickerPreview";
        this.colorPickerNode.appendChild(this.colorPickerPrieview);

        this.colorPickerContainer = document.createElement("div");
        this.colorPickerContainer.className = "colorPickerContainer";
        this.colorPickerNode.appendChild(this.colorPickerContainer);

        const [x, y] = this.getColorPickerPosition();
        this.colorPickerNode.style.top = y + "px";
        this.colorPickerNode.style.left = x + "px";

        this.colorPickerNode.addEventListener("mouseenter", () => {
            this.isInColorPickerArea = true;
            clearTimeout(this.timerAnchorArea);
        });
        this.colorPickerNode.addEventListener("mouseleave", () => {
            this.isInColorPickerArea = false;
            if (!this.isMouseDownSVMap && !this.isMouseDownHueMap) {
                this.parentContainerNode.removeChild(this.colorPickerNode);
                this.hasColorPicker = false;
            }
        });

        this.createSVMap();
        this.createHueMap();

        this.colorInputRow = document.createElement("div");
        this.colorInputRow.className = "colorInputRow";
        this.colorPickerNode.appendChild(this.colorInputRow);

        this.colorInputRGB = document.createElement("input");
        this.colorInputRGB.setAttribute("type", "text");
        this.colorInputRow.appendChild(this.colorInputRGB);

        this.colorInputRGB.addEventListener("change", () => this.onColorInputRGB());

        document.addEventListener("mousemove", (event) => {
            event.preventDefault();
            if (this.isMouseDownSVMap) {
                //TODO: update also in mousedown, so extract the code to a separate function
                this.updateSV(event);

                this.updateColor();
            }
            if (this.isMouseDownHueMap) {
                this.updateHue(event);
                this.updateColor();
            }
        });

        document.addEventListener("mouseup", () => {
            if (this.isMouseDownSVMap) {
                this.isMouseDownSVMap = false;
            }
            if (this.isMouseDownHueMap) {
                this.isMouseDownHueMap = false;
            }
            if (!this.isInColorPickerArea && this.hasColorPicker) {
                this.parentContainerNode.removeChild(this.colorPickerNode);
                this.hasColorPicker = false;
            }
        });
        
        //update x pos of hue slider just once when creating, because its stays the same
        const colorPickerBounds = this.colorPickerNode.getBoundingClientRect();
        const hueMapBounds = this.hueMapNode.getBoundingClientRect();
        // not sure why we need here the -1, but it has a offset without it?!
        this.hueMapSlider.style.left = hueMapBounds.left -1- colorPickerBounds.left + "px";

        this.updateColor();
        this.updateColorMaps();
    }

    getColorPickerPosition() {
        const boundsAnchorNode = this.anchorNode.getBoundingClientRect();
        const x = boundsAnchorNode.left;
        const y = boundsAnchorNode.bottom;
        return [x,y];
    }

    createSVMap() {
        this.svMapNode = document.createElement("div");
        this.svMapNode.className = "sv-map";
        const rgb = hsvToRgb(this.hue, 1, 1);
        this.svMapNode.style.setProperty("--currentHueColor", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
        this.colorPickerContainer.appendChild(this.svMapNode);

        this.svMapMarker = document.createElement("div");
        this.svMapMarker.className = "colorPickerMarkerSV";
        this.colorPickerContainer.appendChild(this.svMapMarker);

        this.svMapNode.addEventListener("mousedown", (event) => {
            this.isMouseDownSVMap = true;
            this.updateSV(event);
        });
    }

    createHueMap() {
        this.hueMapNode = document.createElement("div");
        this.hueMapNode.className = "hue-map";
        this.colorPickerContainer.appendChild(this.hueMapNode);

        this.hueMapSlider = document.createElement("div");
        this.hueMapSlider.className = "colorPickerMarkerHue";
        this.colorPickerContainer.appendChild(this.hueMapSlider);

        this.hueMapNode.addEventListener("mousedown", (event) => {
            this.isMouseDownHueMap = true;
            this.updateHue(event);
        });
    }

    updateColor() {
        const color = this.getRGBColorS();
        this.colorPickerNode.style.setProperty("--currentColor", color);
        this.anchorNode.style.backgroundColor = color;
        this.colorInputRGB.value = color;
    }

    updateColorMaps() {
        const rgb = hsvToRgb(this.hue, 1, 1);
        this.svMapNode.style.setProperty("--currentHueColor", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);

        
        const colorPickerBounds = this.colorPickerNode.getBoundingClientRect();

        const hueMapBounds = this.hueMapNode.getBoundingClientRect();
        const yHue = hueMapBounds.top - colorPickerBounds.top + this.hue / 360 * 150;
        this.hueMapSlider.style.top = yHue-1+"px";

        const svMapBounds = this.svMapNode.getBoundingClientRect();
        const xSV = svMapBounds.left - colorPickerBounds.left + this.saturation * 200;
        const ySV = svMapBounds.top - colorPickerBounds.top + (1-this.value) * 150;
        this.svMapMarker.style.left = xSV-5+"px";
        this.svMapMarker.style.top = ySV-5+"px";
    }

    updateSV(event) {
        const svMapBounds = this.svMapNode.getBoundingClientRect();
        const colorPickerBounds = this.colorPickerNode.getBoundingClientRect();
        const x = Math.min(svMapBounds.right, Math.max(event.clientX, svMapBounds.left)) - colorPickerBounds.left;
        const y = Math.min(svMapBounds.bottom, Math.max(event.clientY, svMapBounds.top)) - colorPickerBounds.top;
        this.svMapMarker.style.left = x-5+"px";
        this.svMapMarker.style.top = y-5+"px";

        this.saturation = (x - (svMapBounds.left-colorPickerBounds.left)) / 200;
        this.value = 1-((y-(svMapBounds.top-colorPickerBounds.top)) / 150);
    }

    updateHue(event) {
        const hueMapBounds = this.hueMapNode.getBoundingClientRect();
        const colorPickerBounds = this.colorPickerNode.getBoundingClientRect();
        const y = Math.min(hueMapBounds.bottom, Math.max(event.clientY, hueMapBounds.top)) - colorPickerBounds.top;
        this.hueMapSlider.style.top = y-1+"px";

        this.hue = (y - (hueMapBounds.top-colorPickerBounds.top)) / 150 * 360
                
        const rgb = hsvToRgb(this.hue, 100, 50);
        this.svMapNode.style.setProperty("--currentHueColor", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    }

    onColorInputRGB() {
        let input = this.colorInputRGB.value;

        const indexLeftBracket = input.indexOf("(");
        if (indexLeftBracket < 0) {
            return;
        }
        input = input.slice(indexLeftBracket + 1);

        const indexRightBracket = input.indexOf(")");
        if (indexRightBracket < 0) {
            return;
        }
        input = input.substring(0, indexRightBracket);

        const values = input.split(",");
        if (values.length !== 3) {
            return;
        }
        const r = parseInt(values[0]);
        const g = parseInt(values[1]);
        const b = parseInt(values[2]);

        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return;
        }

        const hsvColor = rgbToHsv(r, g, b);
        this.hue = hsvColor.h;
        this.saturation = hsvColor.s;
        this.value = hsvColor.v;

        const color = `rgb(${r}, ${g}, ${b})`;
        this.colorPickerNode.style.setProperty("--currentColor", color);
        this.anchorNode.style.backgroundColor = color;

        this.updateColorMaps();
    }

    getRGBColor() {
        return hsvToRgb(this.hue, this.saturation, this.value);
    }

    getRGBColorS() {
        const color = hsvToRgb(this.hue, this.saturation, this.value);
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }
}

function hsvToRgb(h, s, v) {
    h = (h % 360 + 360) % 360; // Ensure h is in the range [0, 360]
    s = Math.max(0, Math.min(1, s)); // Normalize s to be in the range [0, 1]
    v = Math.max(0, Math.min(1, v)); // Normalize v to be in the range [0, 1]

    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r, g, b;

    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
}

function rgbToHsv(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, v = max;

    const delta = max - min;

    if (max === min) {
        h = 0;
        s = 0;
    } else {
        if (max === r) {
            h = (60 * ((g - b) / delta) + 360) % 360;
        } else if (max === g) {
            h = (60 * ((b - r) / delta) + 120) % 360;
        } else {
            h = (60 * ((r - g) / delta) + 240) % 360;
        }

        if (max === 0) {
            s = 0;
        } else {
            s = (delta / max);
        }
    }
    
    return { h, s, v };
}
