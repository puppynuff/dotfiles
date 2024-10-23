// #############
// ## CREDITS ##
// #############
// Kokabiel, October 21
// https://github.com/end-4/

// #############
// ## IMPORTS ##
// #############

// Built in resources
import hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import SystemTray from "resource:///com/github/Aylur/ags/service/systemtray.js";
import mpris from "resource:///com/github/Aylur/ags/service/mpris.js";
import audio from "resource:///com/github/Aylur/ags/service/audio.js";
const { Gravity } = imports.gi.Gdk;
const { GLib } = imports.gi;

// Custom files
import { time_variable, cpu_usage } from "../Services/variables.js";
import { Workspaces } from "../Services/hyprland.js";

// #############
// ## WIDGETS ##
// #############

// ###############
// ## LEFT SIDE ##
// ###############
const icon_widget = Widget.Button({
    class_name: "icon_widget",
    child: Widget.Icon({
        icon: `${GLib.get_user_config_dir()}/ags/resources/arch_linux.png`
    }),
});

// --- I really liked how End-4 did it. Thank you~ ---
const hyprland_window_title = Widget.Scrollable({
    class_name: "hyprland_window_title",
    hexpand: true,
    vexpand: true,
    hscroll: "automatic",
    vscroll: "never",
    child: Widget.Box({
        vertical: true,
        children: [
            Widget.Label({
                xalign: 0,
                truncate: "end",
                class_name: "top_window_label",
                max_width_chars: 20,
                setup: (self) =>
                    self.hook(hyprland.active.client, (label) => {
                        label.label =
                            hyprland.active.client.class.length === 0
                                ? "Desktop"
                                : hyprland.active.client.class;
                    }),
            }),

            Widget.Label({
                xalign: 0,
                truncate: "end",
                class_name: "botton_window_label",
                setup: (self) =>
                    self.hook(hyprland.active.client, (label) => {
                        label.label =
                            hyprland.active.client.title.length === 0
                                ? `Empty Workspace`
                                : hyprland.active.client.title;
                    }),
            }),
        ],
    }),
});

const start_widget = Widget.Box({
    children: [icon_widget, hyprland_window_title],
});

// ############
// ## CENTER ##
// ############

// Music player
const CPU_widget = Widget.Button({
    class_name: "cpu_widget",
    child: Widget.Box({
        children: [
            Widget.Icon({
                icon: `${App.configDir}/resources/cpu.png`,
                css: "font-size: 15px",
            }),
            Widget.Label({
                class_name: "cpu_percentage",
                label: cpu_usage.bind(),
            }),
        ],
    }),
});


let last_song = "";
function trim_track_title(title) {
    if (!title) return "";
    const clean_patters = [/[[^]*]/, " [FREE DOWNLOAD]", " - YouTube Music"];
    
    clean_patters.forEach((expr) => (title = title.replace(expr, "")));

    if(title == "YouTube Music") title = last_song;

    last_song = title;


    if(title.length < 20) {
        while(title.length < 20) {
            title += " "
        }
    }
    return title;
}

// Primary click will pause, secondary will open a menu.
const trackTitle = Widget.Button({
    class_name: "track_title_button",
    on_primary_click: () => {
        const Mpris = mpris.getPlayer();
        if (Mpris) Mpris.playPause();
    },
    on_secondary_click: () => {

    },
    child: Widget.Box({
        children: [
            Widget.Label({
                hexpand: true,
                class_name: "music_title",
                truncate: "end",
                max_width_chars: 20,
                setup: (self) =>
                    self.hook(mpris, (label) => {
                        const Mpris = mpris.getPlayer("");
                        if (Mpris) label.label = `${trim_track_title(Mpris.track_title)}`;
                        else label.label = "No media";
                    }),
            })
        ]
    })
})

const music_holder = Widget.Box({
    hexpand: true,
    children: [trackTitle],
});


const workspace_widget = Widget.Box({
    class_name: "primary_workspaces",
    children: [
        Workspaces([0, 10], [5, 5])
    ]
});


const date_box = Widget.Box({
    class_name: "primary_date_time",
    child: Widget.Label({
        class_name: "primary_time",
        hpack: "center",
        label: time_variable.bind(),
    }),
});

const center_widget = Widget.Box({
    children: [CPU_widget, music_holder, workspace_widget, date_box],
});

// ################
// ## RIGHT SIDE ##
// ################

// System Tray

// Change this to have the menu appear beneath
const sys_tray_item = (item) =>
    item.id !== null
        ? Widget.Button({
            class_name: "systray_item",
            child: Widget.Icon({ hpack: "center" }).bind("icon", item, "icon"),
            setup: (self) =>
                self.hook(
                    item,
                    (self) => (self.tooltip_markup = item["tooltip-markup"])
                ),
            on_primary_click: (_, event) => item.activate(event),
            on_secondary_click: (btn, event) =>
                item.menu.popup_at_widget(btn, Gravity.SOUTH, Gravity.NORTH, null),
        })
        : null;

const sysTray = Widget.Box({
    children: SystemTray.bind("items").as((i) => i.map(sys_tray_item)),
});

const sys_tray_holder = Widget.Revealer({
    child: sysTray,
    transition: "slide_left",
    transition_duration: 40,
});

const reveal_label = Widget.Label({
    hexpand: true,
    truncate: "end",
    label: "v"
});

const space_creator = Widget.Box({
    children: [
        Widget.Label({
            label: "                                                                                                                          "
        })
    ]
})

const reveal_button = Widget.Button({
    class_name: 'tray_opener',
    child: reveal_label,
    on_clicked: () => {
        if (sys_tray_holder.reveal_child == false) {
            reveal_label.label = "^";
            sys_tray_holder.reveal_child = true;
        } else {
            reveal_label.label = "v";
            sys_tray_holder.reveal_child = false;
        }
    },
});

const bluetooth = Widget.Button({
    class_name: 'bluetooth',
    child: Widget.Icon({
        icon: `${App.configDir}/resources/bluetooth.png`,
    }),
    on_clicked: () => Utils.execAsync("blueberry"),
});

// I want to make my own settings menu at some point~
const wifi = Widget.Button({
    class_name: 'wifi',
    child: Widget.Icon({
        icon: `network-wireless`
    }),
    on_clicked: () => Utils.execAsync("nm-connection-editor"),
});

const volume_indicator = Widget.Button({
    class_name: 'volume_indicator',
    on_clicked: () => Utils.execAsync("pavucontrol"),
    on_scroll_up: () => {
        if (!audio.speaker) return;
        audio.speaker.volume += 0.03;
        if (audio.speaker.volume > 1) {
            audio.speaker.volume = 1
        }
    },
    on_scroll_down: () => {
        if (!audio.speaker) return;
        audio.speaker.volume -= 0.03;
        if (audio.speaker.volume < 0) {
            audio.speaker.volume = 0
        }
    },
    child: Widget.Box({
        children: [
            Widget.Icon().hook(audio.speaker, (self) => {
                const volume = audio.speaker.volume * 100;

                const icon = [
                    [101, "overamplified"],
                    [67, "high"],
                    [32, "medium"],
                    [1, "low"],
                    [0, "muted"],
                ].find(([threshold]) => threshold <= volume)?.[1];

                self.icon = `audio-volume-${icon}-symbolic`;
                self.tooltip_text = `Volume ${Math.floor(volume)}%`;
            }),

            Widget.Label({
                class_name: 'volume_indicator_label',
                label: audio.speaker.bind("volume").as(v => `${Math.floor(v * 100)}`)
            })
        ],
    }),
});

const end_widget = Widget.Box({
    children: [space_creator, sys_tray_holder, reveal_button, bluetooth, wifi, volume_indicator],
});

// #################
// ## PRIMARY BAR ##
// #################

// -- This is meant for the primary monitor. --
export const primary_bar = (/** @type {number} */ monitor = 0) =>
    Widget.Window({
        class_name: "primary_bar_window",
        monitor,
        name: `primary_bar`,
        anchor: ["top", "left", "right"],
        exclusivity: "exclusive",
        child: Widget.CenterBox({
            start_widget,
            center_widget,
            end_widget,
        }),
    });
