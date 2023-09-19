let sidebar_border_position = 300;
let cursor_in_sidebar_resize = false;
let is_resizing_sidebar = false;

document.addEventListener("mousemove", (event) => {
    if (event.clientX >= sidebar_border_position -3 && event.clientX <= sidebar_border_position + 3) {
        if (!cursor_in_sidebar_resize) {
            document.body.style.cursor = "e-resize";
            cursor_in_sidebar_resize = true;
        }
    }
    else {
        if (cursor_in_sidebar_resize && !is_resizing_sidebar) {
            document.body.style.cursor = "default";
            cursor_in_sidebar_resize = false;
        }
    }

    if (is_resizing_sidebar) {
        sidebar_border_position = Math.min(window.innerWidth / 2, Math.max(200, event.clientX));
        secondary_sidebar.style.width = String(sidebar_border_position - 50) + "px";
        main.style.marginLeft = String(sidebar_border_position) + "px";
    }
});

document.addEventListener("mousedown", (event) => {
    if (cursor_in_sidebar_resize) {
        is_resizing_sidebar = true;
        secondary_sidebar.classList.add('highlighted-border')
    }
});

document.addEventListener("mouseup", (event) => {
    if (is_resizing_sidebar) {
        is_resizing_sidebar = false;
        secondary_sidebar.classList.remove('highlighted-border')
    }
});

// important to disable the cursor to change cursor to warning symbol and lagging
document.addEventListener('dragstart', (event) => {
    event.preventDefault();
});