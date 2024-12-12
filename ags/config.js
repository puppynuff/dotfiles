// #############
// ## CREDITS ##
// #############
// Kokabiel, October 21

// #############
// ## IMPORTS ##
// #############
import { main_bar } from "./top_bars/main_bar.js";
import { secondary_bar } from "./top_bars/.old/secondary_bar.js"

// #################
// ## BAR WIDGETS ##
// #################

Utils.monitorFile(
    `${App.configDir}/theme.css`,
    function () {
        const css = `${App.configDir}/theme.css`;
        App.resetCss();
        App.applyCss(css);
    }
)


App.config({
    windows: [main_bar(0), secondary_bar(1)],
    style: `./theme.css`
})