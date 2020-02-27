export const Sidebar = (open: boolean, action: string) => ({
    type: "SIDEBAR",
    payload: { open, action }
})