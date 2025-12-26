"use client"

import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button,
    Tooltip
} from "@nextui-org/react";
import { Eye, Trash2 } from "lucide-react";
import JobInfo from "./JobInfo";
import { irrigation } from "@prisma/client";
import useSWR from "swr";
import { mqttConnecter } from "@/lib/mqttClient";
import { deleteJob } from "@/lib/schedulerActions";

interface scheduleStats {
    name: string;
    zones: string[];
    todoCount: number;
    notTodoCount: number;
    minDate: Date | null;
    maxDate: Date | null;
    nextIrrigation: Date | null;
    schedule: {
        hour: number;
        minute: number;
        water_pump: number;
        routing_time: number;
        warmup_pump: number;
        warmup_compressor: number;
        compressing_time: number;
    }[];
}

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export default function CardModal({ irrigations, scheduleStats }: { irrigations: irrigation[], scheduleStats: scheduleStats }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { data } = useSWR("/api/config", fetcher);
    const client = mqttConnecter(data);

    const handleDelete = (onClose: () => void) => {
        deleteJob(scheduleStats.name);
        client?.publish(
            "hub",
            JSON.stringify({ command: "RELOAD_CONFIG", arg1: "", arg2: "", arg3: "" })
        );
        onClose();
    };

    return (
        <>
            <Button
                color="primary"
                radius="full"
                size="sm"
                variant="flat"
                className="font-bold uppercase text-[10px] tracking-wider"
                onPress={onOpen}
                startContent={<Eye size={16} />}
            >
                View Details
            </Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="5xl"
                scrollBehavior="inside"
                backdrop="blur"
                classNames={{
                    base: "border border-default-100",
                    header: "border-b border-default-100 pb-4",
                    footer: "border-t border-default-100 pt-4"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-6 bg-primary rounded-full" />
                                    <h2 className="text-xl font-black uppercase tracking-tight">
                                        {scheduleStats.name}
                                    </h2>
                                </div>
                                <p className="text-tiny text-default-400 font-normal uppercase tracking-widest">
                                    System Configuration & History
                                </p>
                            </ModalHeader>

                            <ModalBody className="py-6">
                                <JobInfo irrigations={irrigations} scheduleStats={scheduleStats} />
                            </ModalBody>

                            <ModalFooter className="justify-between">
                                <Tooltip content="Permanently delete this schedule" color="danger">
                                    <Button
                                        variant="light"
                                        color="danger"
                                        className="font-bold uppercase text-[10px]"
                                        startContent={<Trash2 size={18} />}
                                        onPress={() => {
                                            if (confirm("Are you sure you want to delete this schedule?")) {
                                                handleDelete(onClose);
                                            }
                                        }}
                                    >
                                        Delete Schedule
                                    </Button>
                                </Tooltip>

                                <Button
                                    color="primary"
                                    variant="solid"
                                    onPress={onClose}
                                    className="font-bold px-8 shadow-lg shadow-primary/20"
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}