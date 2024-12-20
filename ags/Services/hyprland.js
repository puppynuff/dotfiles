// #############
// ## CREDITS ##
// #############
// Kokabiel, December 8th


// #############
// ## IMPORTS ##
// #############

const hyprland = await Service.import("hyprland");

const dispatch = ws => hyprland.messageAsync(`dispatch workspace ${ws}`);

function generate_children(starting_numbers, length, holderwidget) {
    let button_array = [];
    for (let i = 0; i < starting_numbers.length; i++) {
        for(let j = 0; j < length[i]; j++) {
            let created_button = Widget.Button({
                attribute: starting_numbers[i] + 1 + j,
                label: `${starting_numbers[i] + 1 + j}`,
                class_name: `workspace-button`,
                on_clicked: (self) => {
                    dispatch(starting_numbers[i] + 1 + j);
                },
                setup: (self) => self.hook(hyprland.active.workspace, (self) => {
                    if(self.label == hyprland.active.workspace.id) {
                        self.toggleClassName("enabled");
                    } else {
                        if(self.class_names.includes("enabled")) {
                            self.toggleClassName("enabled", false);
                        }
                    }
                })
            })

            button_array.push(created_button);
        }
        if(i != starting_numbers.length - 1) {
            button_array.push(Widget.Button())
        }
    }

    return button_array
}


export const Workspaces = (starting_numbers = [], length = [], holderwidget, class_name = "workspaces") => Widget.EventBox({
    onScrollUp: () => dispatch('+1'),
    onScrollDown: () => dispatch('-1'),
    child: Widget.Box({
        children: generate_children(starting_numbers, length)
    }),
    class_name
});

export function ClientTitle() {
    return Widget.Label({
        class_name: "client-title",
        label: hyprland.active.client.bind("title"),
    })
}