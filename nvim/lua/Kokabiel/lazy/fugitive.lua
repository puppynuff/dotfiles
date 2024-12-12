-- #############
-- ## Credits ##
-- #############
-- Kokabiel, Dec 9 2024
-- ThePrimeagen's init.lua

return {
    "tpope/vim-fugitive",
    config = function()
        vim.keymap.set("n", "<leader>gs", vim.cmd.Git)

        local Kok_Fugitive = vim.api.nvim_create_augroup("Kok_Fugitive", {})

        local autocmd = vim.api.nvim_create_autocmd
        
        autocmd("BufWinEnter", {
            group = Kok_Fugitive,
            pattern = "*",
            callback = function ()
                if vim.bo.ft ~= "fugitive" then
                    return
                end

                local bufnr = vim.api.nvim_get_current_buf()
                local opts = { buffer = bufnr, remap = false }

                vim.keymaps.set("n", "<leader>p", function()
                    vim.cmd.Git("push")
                end, opts)

                vim.keymap.set("n", "<leader>P", function()
                    vim.cmd.Git('pull', "--rebase")
                end, opts)


                vim.keymap.set("n", "<leader>t", ":Git push -u origin", opts)
            end
        })

        vim.keymap.set("n", "gu", "<cmd>diffget //2<CR>")
        vim.keymap.set("n", "gh", "<cmd>diffget //3<CR>")
    end
}