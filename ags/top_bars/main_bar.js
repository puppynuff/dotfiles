// #############
// ## CREDITS ##
// #############
// Kokabiel, December 8th


// Working on the decorating of it

// #############
// ## IMPORTS ##
// #############

const notifications = await Service.import("notifications");
const mpris = await Service.import("mpris");
const audio = await Service.import("audio");
const systemtray = await Service.import("systemtray");

import { ClientTitle, Workspaces } from "../Services/hyprland.js";
import { date } from "../Services/variables.js";

function Clock() {
    return Widget.Label({
        class_name: "clock",
        label: date.bind(),
    });
}

function Notification() {
    const popups = notifications.bind("popups");

    return Widget.Box({
        class_name: "notification",
        visible: popups.as((p) => p.length > 0),
        children: [
            Widget.Icon({
                icon: "preferences-system-notifications-symbolic",
            }),
            Widget.Label({
                label: popups.as((p) => p[0]?.summary || ""),
            }),
        ],
    });
}


let last_song = "";
function trim_track_title(title) {
    if (!title) return "";
    const clean_patters = [/[[^]*]/, " [FREE DOWNLOAD]", " - YouTube Music", " | Spotify"];

    clean_patters.forEach((expr) => (title = title.replace(expr, "")));

    if (title == "YouTube Music") title = last_song;

    last_song = title;

    if (title.length < 20) {
        while (title.length < 20) {
            title += " ";
        }
    }
    return title;
}

// Primary click will pause, secondary will open a menu.
function Media() {
    return Widget.Button({
        class_name: "track_title_button",
        on_primary_click: () => {
            const Mpris = mpris.getPlayer();
            if (Mpris) Mpris.playPause();
        },
        on_secondary_click: () => { },
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
                            console.log(Mpris.track_artists, Mpris.track_title)
                            if (Mpris) label.label = `${Mpris.track_artists.join(", ") ? Mpris.track_artists.join(", ") + " - " : ""}${trim_track_title(Mpris.track_title)}`;
                            else label.label = "No media";
                        }),
                }),
            ],
        }),
    });
}

function Volume() {
    const icons = {
        101: "overamplified",
        67: "high",
        34: "medium",
        1: "low",
        0: "muted",
    };

    function getIcon() {
        const icon = audio.speaker.is_muted
            ? 0
            : [101, 67, 34, 1, 0].find(
                (threshold) => threshold <= audio.speaker.volume * 100
            );

        return `audio-volume-${icons[icon]}-symbolic`;
    }

    const icon = Widget.Icon({
        icon: Utils.watch(getIcon(), audio.speaker, getIcon),
    });

    const slider = Widget.Slider({
        hexpand: true,
        draw_value: false,
        on_change: ({ value }) => (audio.speaker.volume = value),
        setup: (self) =>
            self.hook(audio.speaker, () => {
                self.value = audio.speaker.volume || 0;
            }),
    });

    return Widget.Box({
        class_name: "volume",
        css: "min-width: 180px",
        children: [icon,slider],
    });
}

function SysTray() {
    const items = systemtray.bind("items").as((items) =>
        items.map((item) =>
            Widget.Button({
                child: Widget.Icon({ icon: item.bind("icon") }),
                on_primary_click: (_, event) => item.activate(event),
                on_secondary_click: (_, event) => item.openMenu(event),
                tooltip_markup: item.bind("tooltip_markup"),
            })
        )
    );

    return Widget.Box({
        children: items,
    });
}

function Left() {
    return Widget.Box({
        spacing: 8,
        children: [Workspaces([0], [5]), ClientTitle()],
    });
}

function Center() {
    return Widget.Box({
        spacing: 8,
        children: [Media(), Notification()],
    });
}

function Right() {
    return Widget.Box({
        hpack: "end",
        spacing: 8,
        children: [Volume(), Clock(), SysTray()],
    });
}

export function main_bar(monitor = 0) {
    return Widget.Window({
        name: `bar-${monitor}`,
        class_name: "bar",
        monitor,
        anchor: ["bottom", "left", "right"],
        exclusivity: "exclusive",
        child: Widget.CenterBox({
            start_widget: Left(),
            center_widget: Center(),
            end_widget: Right(),
        }),
    });
}
