"use client"


import * as React from 'react';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
} from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation'
const pages = [['System Health', '/system_health'], ['Logs', '/logs']];

export const AcmeLogo = () => {
    return (
        <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
            <path
                clipRule="evenodd"
                d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
};
export const ChevronDown = () => {
    return (
        <svg
            fill="none"
            height="16"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
            />
        </svg>
    );
};

function NavigationBar() {

    const pathname = usePathname();
    const router = useRouter()

    return (
        <Navbar isBordered className='relative flex items-center w-full'>
            <NavbarBrand className='absolute left-0 flex items-center'>
                <AcmeLogo />
                <p className="font-bold text-inherit">ALIA</p>
            </NavbarBrand>
            <NavbarContent className="absolute left-1/2 transform -translate-x-1/2 hidden sm:flex gap-4 flex flex-row align-center">
                <NavbarItem isActive={pathname.includes('/config')}>
                    <Link color="foreground" href="/config">
                        <div className='text-sm'>Config</div>
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathname === '/scheduler'}>
                    <Link color="foreground" href="/scheduler">
                        <div className='text-sm'>Scheduler</div>
                    </Link>
                </NavbarItem>
                <Dropdown >
                    <NavbarItem isActive >
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className="p-0 h-auto bg-transparent leading-none data-[hover=true]:bg-transparent"
                                radius="none"
                                aria-label='Manual Commands'
                                endContent={<ChevronDown />}
                                variant="light"
                            >
                                <div className='text-sm'>Manual Commands</div>
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                        aria-label="ACME features"
                        className="w-[340px]"
                        itemClasses={{
                            base: "gap-4",
                        }}
                    >
                        <DropdownItem
                            key="autoscaling"
                            description=""
                            onPress={() => router.push("/init")}
                        >
                            <div className='text-sm'>Initialize database</div>
                        </DropdownItem>
                        <DropdownItem
                            key="usage_metrics"
                            description=""
                            onPress={() => router.push("/manual_components_commands")}
                        >
                            <div className='text-sm'>Hardware</div>
                        </DropdownItem>
                        <DropdownItem
                            key="production_ready"
                            description=""
                            onPress={() => router.push("/manual_hub_commands")}
                        >
                            <div className='text-sm'>Hub</div>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className="p-0 h-auto bg-transparent leading-none data-[hover=true]:bg-transparent"
                                endContent={<ChevronDown />}
                                radius="sm"
                                variant="light"

                            >
                                Observability
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                        aria-label="ACME features"
                        className="w-[340px]"
                        itemClasses={{
                            base: "gap-4",
                        }}
                    >
                        <DropdownItem
                            key="autoscaling"
                            description=""
                            onPress={() => router.push("/logs")}
                        >
                            <div className='text-sm'>Logs</div>
                        </DropdownItem>
                        <DropdownItem
                            key="usage_metrics"
                            description=""
                            onPress={() => router.push("/system_health")}
                        >
                            <div className='text-sm'>System health</div>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    );
}
export default NavigationBar;