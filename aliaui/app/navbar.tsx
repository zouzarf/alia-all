"use client"

import * as React from 'react';
import {
    Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle,
    NavbarMenu, NavbarMenuItem, Link, Button, DropdownItem,
    DropdownTrigger, Dropdown, DropdownMenu, Divider
} from "@nextui-org/react";
import { usePathname, useRouter } from 'next/navigation';
import {
    ChevronDown, Settings, Calendar, Terminal, Activity,
    Cpu, Database, FileText, ShieldAlert, PlaySquare
} from 'lucide-react';

export default function NavigationBar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const isActive = (path: string) => pathname.startsWith(path);

    const navLinks = [
        { label: "Config", href: "/config", icon: <Settings size={18} /> },
        { label: "Scheduler", href: "/scheduler", icon: <Calendar size={18} /> },
    ];

    return (
        <Navbar
            isBordered
            maxWidth="xl"
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
        >
            {/* Mobile Toggle */}
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
            </NavbarContent>

            {/* Brand Logo */}
            <NavbarBrand className="gap-3">
                <img
                    src="/logo.jpeg"
                    alt="Logo"
                    className="w-8 h-8 rounded-lg object-contain shadow-sm"
                />
                <p className="font-black text-inherit tracking-tighter text-xl">ALIA</p>
            </NavbarBrand>

            {/* Desktop Menu */}
            <NavbarContent className="hidden sm:flex gap-8" justify="center">
                {navLinks.map((link) => (
                    <NavbarItem key={link.href} isActive={isActive(link.href)}>
                        <Link
                            href={link.href}
                            className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${isActive(link.href) ? 'text-blue-600' : 'text-foreground'}`}
                        >
                            {link.icon} {link.label}
                        </Link>
                    </NavbarItem>
                ))}

                <Dropdown placement="bottom">
                    <NavbarItem isActive={isActive('/manual')}>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-transparent ${isActive('/manual') ? 'text-blue-600' : 'text-foreground'}`}
                                endContent={<ChevronDown size={14} />}
                                variant="light"
                            >
                                <Terminal size={18} /> Commands
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu className="w-[260px]" variant="flat">

                        {/* SECTION: FUNCTIONALITIES (Routing, Logic) */}
                        <DropdownItem
                            key="hub"
                            description="Execute multi-step sequences"
                            startContent={<PlaySquare size={20} className="text-blue-500" />}
                            onPress={() => router.push("/manual_hub_commands")}
                        >
                            Process Logic
                        </DropdownItem>

                        {/* SECTION: INDIVIDUAL HARDWARE (Valves, Pumps) */}
                        <DropdownItem
                            key="hard"
                            description="Direct manual actuator control"
                            startContent={<Cpu size={20} className="text-orange-500" />}
                            onPress={() => router.push("/manual_components_commands")}
                        >
                            Field Units
                        </DropdownItem>

                        {/* SECTION: SYSTEM (Reset, DB, Software) */}
                        <DropdownItem
                            key="sys"
                            description="Manage software & database"
                            startContent={<ShieldAlert size={20} className="text-red-500" />}
                            onPress={() => router.push("/manual_system_commands")}
                        >
                            System Maintenance
                        </DropdownItem>

                    </DropdownMenu>
                </Dropdown>

                <Dropdown placement="bottom">
                    <NavbarItem isActive={isActive('/logs') || isActive('/system_health')}>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-transparent ${(isActive('/logs') || isActive('/system_health')) ? 'text-blue-600' : 'text-foreground'}`}
                                endContent={<ChevronDown size={14} />}
                                variant="light"
                            >
                                <Activity size={18} /> Observability
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu className="w-[240px]" variant="flat">
                        <DropdownItem key="logs" startContent={<FileText size={18} />} onPress={() => router.push("/logs")}>Activity Logs</DropdownItem>
                        <DropdownItem key="health" startContent={<Activity size={18} />} onPress={() => router.push("/system_health")}>System Health</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>

            {/* End Status */}
            <NavbarContent justify="end">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-full">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="hidden xs:block text-[10px] font-black text-blue-700 uppercase tracking-tight">System Online</span>
                </div>
            </NavbarContent>

            {/* Mobile Drawer Menu */}
            <NavbarMenu className="pt-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
                <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-black text-default-400 uppercase tracking-widest px-4 mb-2">Navigation</p>
                    {navLinks.map((link) => (
                        <NavbarMenuItem key={link.href}>
                            <Link
                                className={`w-full flex gap-4 px-4 py-3 rounded-xl font-bold ${isActive(link.href) ? 'bg-blue-50 text-blue-600' : 'text-foreground'}`}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.icon} {link.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}

                    <Divider className="my-4 mx-4" />

                    <p className="text-[10px] font-black text-default-400 uppercase tracking-widest px-4 mb-2">Hardware Control</p>
                    <NavbarMenuItem>
                        <Link className="w-full px-4 py-3 flex gap-4 font-bold text-foreground" href="/manual_components_commands" onClick={() => setIsMenuOpen(false)}>
                            <Cpu size={20} className="text-primary" /> Hardware Control
                        </Link>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        <Link className="w-full px-4 py-3 flex gap-4 font-bold text-foreground" href="/manual_system_commands" onClick={() => setIsMenuOpen(false)}>
                            <Settings size={20} className="text-primary" /> System Commands
                        </Link>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        {/* RESTORED HUB COMMAND SECTION */}
                        <Link className="w-full px-4 py-3 flex gap-4 font-bold text-foreground" href="/manual_hub_commands" onClick={() => setIsMenuOpen(false)}>
                            <Database size={20} className="text-primary" /> Hub Management
                        </Link>
                    </NavbarMenuItem>

                    <Divider className="my-4 mx-4" />

                    <p className="text-[10px] font-black text-default-400 uppercase tracking-widest px-4 mb-2">Monitoring</p>
                    <NavbarMenuItem>
                        <Link className="w-full px-4 py-3 flex gap-4 font-bold text-foreground" href="/logs" onClick={() => setIsMenuOpen(false)}>
                            <FileText size={20} className="text-success" /> Activity Logs
                        </Link>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        <Link className="w-full px-4 py-3 flex gap-4 font-bold text-foreground" href="/system_health" onClick={() => setIsMenuOpen(false)}>
                            <Activity size={20} className="text-success" /> System Health
                        </Link>
                    </NavbarMenuItem>
                </div>
            </NavbarMenu>
        </Navbar>
    );
}