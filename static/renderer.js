const secondary_sidebar = document.querySelector(".secondary-sidebar")
const main = document.querySelector(".main")
const sidebar_tab_explorer = document.getElementById("sidebar-tab-explorer")
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let sidebar_border_position = 300;

const eventhandler = new EventHandler();
const project = new Project();
const label_window = new LabelWindow();

sidebar_tab_explorer.addEventListener("click", async () => {
    await project.choose_project_path();
    await project.load_project();
});
