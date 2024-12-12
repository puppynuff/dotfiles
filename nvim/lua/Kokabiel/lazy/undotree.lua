-- #############
-- ## Credits ##
-- #############
-- Kokabiel, Dec 9 2024
-- ThePrimeagen's init.lua

return {
    "mbbill/undotree",
    
    config = function()
        vim.keymap.set("n", "<leader>u", vim.cmd.UndotreeToggle)
    end
}