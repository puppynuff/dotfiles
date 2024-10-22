// #############
// ## CREDITS ##
// #############
// Kokabiel, October 21

import { Workspaces } from "../Services/hyprland.js";


const workspace_widget = Widget.Box({
    class_name: "secondary_workspaces",
    children: [
        Workspaces([5, 15], [5, 5])
    ]
});

// -- This is meant for the primary monitor. --
export const secondary_bar = (/** @type {number} */ monitor = 1) =>
    Widget.Window({
        class_name: "primary_bar_window",
        monitor,
        name: `secondary__bar`,
        anchor: ["top", "left", "right"],
        exclusivity: "exclusive",
        child: Widget.CenterBox({
            center_widget: workspace_widget
        }),
    });
