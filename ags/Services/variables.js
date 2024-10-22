// #############
// ## CREDITS ##
// #############
// Kokabiel, October 21

const { GLib } = imports.gi;

export const time_variable = Variable('', {
    poll: [1000, function() {
        return Utils.exec('date +"%H:%M • %A, %m/%y"');
    }],
})


export const cpu_usage = Variable('', {
    poll: [1000, function() {
        return Utils.exec(`${GLib.get_user_config_dir()}/ags/scripts/cpu.sh`)
    }]
})