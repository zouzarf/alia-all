"use client"

import React, { useState } from "react";
import { Button, Card, CardBody, CardHeader, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { init } from "@/lib/init";
import { ReloadDriver } from "@/lib/checkStatus";
import { AlertTriangle, RefreshCcw, Database, HardDriveDownload } from "lucide-react";

export default function Init() {
    const [isReloading, setIsReloading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);

    // Disclosure for the "Danger Zone" modal
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleReloadDriver = async () => {
        try {
            setIsReloading(true);
            await ReloadDriver();
            // Optional: add a success toast here
        } catch (error) {
            console.error('Driver reload failed:', error);
        } finally {
            setIsReloading(false);
        }
    };

    const handleInitDatabase = async () => {
        setIsInitializing(true);
        try {
            await init();
            // Usually, init() might trigger a page refresh or redirect
        } finally {
            setIsInitializing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <Card className="border-none shadow-sm bg-default-50">
                <CardHeader className="flex gap-3 px-6 pt-6">
                    <div className="p-2 bg-warning-100 text-warning rounded-lg">
                        <RefreshCcw size={20} />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-md font-bold uppercase tracking-tight">System Maintenance</p>
                        <p className="text-tiny text-default-500">Service controls</p>
                    </div>
                </CardHeader>
                <CardBody className="px-6 pb-6 gap-6">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-default-700">Hardware Driver</p>
                        <p className="text-xs text-default-500 mb-2">
                            Restarts the driver service. Use this if you change the configuration.
                        </p>
                        <Button
                            color="warning"
                            variant="flat"
                            className="font-bold uppercase tracking-widest"
                            isLoading={isReloading}
                            onPress={handleReloadDriver}
                            startContent={!isReloading && <HardDriveDownload size={18} />}
                        >
                            Reload Driver
                        </Button>
                    </div>

                    <Divider />

                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-danger">Databse</p>
                        <p className="text-xs text-default-500 mb-2">
                            Clears the whole database and resets the system to factory defaults.
                        </p>
                        <Button
                            color="danger"
                            className="font-bold uppercase tracking-widest"
                            onPress={onOpen}
                            startContent={<Database size={18} />}
                        >
                            Reset System Database
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {/* Confirmation Modal for Database Init */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-danger">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle />
                                    <span>Confirm Full Reset</span>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-default-600">
                                    Are you absolutely sure you want to initialize the database?
                                    This will <strong>delete all zones, stations, and logs</strong>. This action cannot be undone.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    isLoading={isInitializing}
                                    onPress={async () => {
                                        await handleInitDatabase();
                                        onClose();
                                    }}
                                >
                                    Yes, Reset Everything
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}