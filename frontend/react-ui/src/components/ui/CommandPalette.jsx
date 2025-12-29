import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import {
    FileText,
    LayoutDashboard,
    Search,
    Bot,
    Sun,
    Moon,
    Laptop
} from "lucide-react";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command) => {
        setOpen(false);
        command();
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-popover border shadow-2xl rounded-xl p-2 z-[9999]"
        >
            <Command.Input
                placeholder="Type a command or search..."
                className="w-full bg-transparent border-b p-3 outline-none text-lg text-foreground placeholder:text-muted-foreground mb-2"
            />
            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                <Command.Empty className="p-4 text-center text-sm text-muted-foreground">
                    No results found.
                </Command.Empty>

                <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
                    <Command.Item
                        onSelect={() => runCommand(() => navigate("/"))}
                        className="flex items-center gap-2 px-2 py-2 text-sm text-foreground rounded-md cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => navigate("/articles"))}
                        className="flex items-center gap-2 px-2 py-2 text-sm text-foreground rounded-md cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary"
                    >
                        <FileText className="h-4 w-4" />
                        <span>Articles</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => navigate("/scraper"))}
                        className="flex items-center gap-2 px-2 py-2 text-sm text-foreground rounded-md cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary"
                    >
                        <Search className="h-4 w-4" />
                        <span>Scraper</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => navigate("/automation"))}
                        className="flex items-center gap-2 px-2 py-2 text-sm text-foreground rounded-md cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary"
                    >
                        <Bot className="h-4 w-4" />
                        <span>Automation</span>
                    </Command.Item>
                </Command.Group>

                <Command.Group heading="Theme" className="text-xs font-medium text-muted-foreground px-2 py-1 mt-2 mb-1">
                    <Command.Item
                        onSelect={() => runCommand(() => {
                            localStorage.setItem('theme', 'light');
                            window.location.reload();
                        })}
                        className="flex items-center gap-2 px-2 py-2 text-sm text-foreground rounded-md cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary"
                    >
                        <Sun className="h-4 w-4" />
                        <span>Light Mode</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => {
                            localStorage.setItem('theme', 'dark');
                            window.location.reload();
                        })}
                        className="flex items-center gap-2 px-2 py-2 text-sm text-foreground rounded-md cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary"
                    >
                        <Moon className="h-4 w-4" />
                        <span>Dark Mode</span>
                    </Command.Item>
                </Command.Group>
            </Command.List>
        </Command.Dialog>
    );
}
