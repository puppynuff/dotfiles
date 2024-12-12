// #############
// ## CREDITS ##
// #############
// Kokabiel, October 21

// This will be reworked later on.

import { Workspaces } from "../../Services/old/hyprland.js";


const workspace_widget = Widget.Box({
    class_name: "secondary_workspaces",
    children: [
        Workspaces([5],[5])
    ]
});

// -- This is meant for the primary monitor. --
export const secondary_bar = (/** @type {number} */ monitor = 1) =>
    Widget.Window({
        class_name: "primary_bar_window",
        monitor,
        name: `secondary__bar`,
        anchor: ["bottom", "left", "right"],
        exclusivity: "exclusive",
        child: Widget.CenterBox({
            start_widget: workspace_widget,
            center_widget: Widget.Label({}),


        }),
    });
