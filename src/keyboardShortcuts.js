export class KeyboardShortcuts {
    constructor() {

    }

    init(app) {
        Mousetrap.bind(['ctrl+o'], async () => await app.sidebar.explorer.openFolder());
        Mousetrap.bind(['a', 'left'], () => {
            const explorer = app.sidebar.explorer;
            const images = app.sidebar.explorer.project.images;
            let currentIndex = images.indexOf(explorer.selectedLabelixImage);
            currentIndex--;
            if (currentIndex < 0) currentIndex = images.length - 1;
            explorer.selectLabelixImage(images[currentIndex]);
        });
        Mousetrap.bind(['d', 'right'], () => {
            const explorer = app.sidebar.explorer;
            const images = app.sidebar.explorer.project.images;
            let currentIndex = images.indexOf(explorer.selectedLabelixImage);
            currentIndex = (currentIndex + 1) % images.length;
            explorer.selectLabelixImage(images[currentIndex]);
        });
        Mousetrap.bind(['w', 'up'], () => {
            const classEditor = app.sidebar.classEditor;
            let currentIndex = classEditor.labelClasses.indexOf(classEditor.selectedLabelClass);
            currentIndex--;
            if (currentIndex < 0) currentIndex = classEditor.labelClasses.length - 1;
            classEditor.selectLabelClass(classEditor.labelClasses[currentIndex]);
        });
        Mousetrap.bind(['s', 'down'], () => {
            const classEditor = app.sidebar.classEditor;
            let currentIndex = classEditor.labelClasses.indexOf(classEditor.selectedLabelClass);
            currentIndex = (currentIndex + 1) % classEditor.labelClasses.length;
            classEditor.selectLabelClass(classEditor.labelClasses[currentIndex]);
        });


    }
}