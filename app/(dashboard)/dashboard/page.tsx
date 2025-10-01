"use client";
import {
    Drawer,
    DrawerContent,
    ScrollArea,
    Button,
} from "@hdfclife-insurance/one-x-ui";
import {
    Copy,
    Gear,
    Handshake,
    House,
    Layout,
    Power,
} from "@phosphor-icons/react";
import clsx from "clsx";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setLeftSection, setSelectedSection } from "../../../store/slices/sidebarSlice";
import MainContent from "../../../components/dashboard-sections/MainContent";

export default function DashboardPage() {
    const leftSectionOpen = useAppSelector((state) => state.sidebar.leftSection);
    const dispatch = useAppDispatch();

    const [drawerOpen, setDrawerOpen] = useState(true);

    const handleSectionClick = (section: string) => {
        console.log("Section clicked:", section);
        dispatch(setSelectedSection(section));
    };

    return (
        // custom properties for the layout
        <div className="min-h-dvh flex flex-col bg-gray-100 [--left-sidebar-width:240px] [--gutter:24px] [--header-height:68px] [--right-sidebar-width:80px]">

            <div className="lg:flex flex-1">
                {/* Left Sidebar Desktop */}
                <aside
                    style={
                        {
                            "--left-sidebar-width": leftSectionOpen ? "240px" : "78px",
                        } as React.CSSProperties
                    }
                    className="hidden bg-white lg:flex flex-col fixed transition-all bottom-0 top-0 pt-[var(--header-height)] left-0 "
                >
                    <div className="p-4 space-y-2">
                        <div
                            className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSectionClick('dashboard')}
                        >
                            <House />
                            {leftSectionOpen && <span>Dashboard</span>}
                        </div>
                        <div
                            className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSectionClick('partner')}
                        >
                            <Handshake />
                            {leftSectionOpen && <span>Partner</span>}
                        </div>
                        <div
                            className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSectionClick('loaders')}
                        >
                            <Copy />
                            {leftSectionOpen && <span>Loaders</span>}
                        </div>
                        <div
                            className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSectionClick('services')}
                        >
                            <Layout />
                            {leftSectionOpen && <span>Services</span>}
                        </div>
                        <div
                            className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSectionClick('settings')}
                        >
                            <Gear />
                            {leftSectionOpen && <span>Settings</span>}
                        </div>
                    </div>

                </aside>
                {/* Left Sidebar Mobile */}
                {/* {!isDesktop && ( */}
                <Drawer
                    open={false}
                    onClose={() => dispatch(setLeftSection(false))}
                    direction="left"
                >
                    <DrawerContent className="w-[250px] px-3">
                        <ScrollArea className="flex-1 h-0">
                            <div className="space-y-1">
                                <div
                                    className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSectionClick('dashboard')}
                                >
                                    <House />
                                    <span>Dashboard</span>
                                </div>
                                <div
                                    className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSectionClick('partner')}
                                >
                                    <Handshake />
                                    <span>Partner</span>
                                </div>
                                <div
                                    className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSectionClick('loaders')}
                                >
                                    <Copy />
                                    <span>Loaders</span>
                                </div>
                                <div
                                    className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSectionClick('services')}
                                >
                                    <Layout />
                                    <span>Services</span>
                                </div>
                                <div
                                    className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSectionClick('settings')}
                                >
                                    <Gear />
                                    <span>Settings</span>
                                </div>
                            </div>
                        </ScrollArea>
                        <Button variant="tertiary" size="sm" startIcon={<Power />}>
                            Logout
                        </Button>
                    </DrawerContent>
                </Drawer>
                {/* )} */}
                {/* Main  */}
                <main
                    style={
                        {
                            "--left-sidebar-width": leftSectionOpen ? "240px" : "76px",
                        } as React.CSSProperties
                    }
                    className={clsx(
                        "flex-1 px-4 lg:px-0 pb-[var(--gutter)] pt-[calc(var(--header-height)+var(--gutter))] lg:pl-[calc(var(--gutter)+var(--left-sidebar-width))] lg:pr-[calc(var(--gutter)+var(--right-sidebar-width))] transition-[padding]",
                    )}
                >
                    <MainContent />
                </main>
            </div>
        </div>
    );
}