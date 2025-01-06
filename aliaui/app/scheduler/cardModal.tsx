"use client"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button
} from "@nextui-org/react";
import JobInfo from "./JobInfo";
import { irrigation } from "@prisma/client";
import useSWR from "swr";
import { mqttConnecter } from "@/lib/mqttClient";
import { deleteJob } from "@/lib/schedulerActions";
interface scheduleStats {
    name: string
    zones: string[]
    todoCount: number;
    notTodoCount: number;
    minDate: Date | null;
    maxDate: Date | null;
    nextIrrigation: Date | null;
    schedule: {
        hour: number;
        minute: number,
        water_level: number,
        dose_1: number,
        dose_2: number,
        dose_3: number,
        dose_4: number,
        mixing_time: number,
        routing_time: number,
        compressing_time: number;
    }[];
}
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
export default function CardModal({ irrigations, scheduleStats }: { irrigations: irrigation[], scheduleStats: scheduleStats }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { data, error } = useSWR("/api/config", fetcher);
    const client = mqttConnecter(data)
    return (
        <>
            <Button
                color="primary"
                radius="full"
                size="sm"
                variant={"solid"}
                onPress={onOpen}
            >
                {"Edit"}
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-center">Schedule: {scheduleStats.name}</ModalHeader>
                            <ModalBody>
                                <JobInfo irrigations={irrigations} scheduleStats={scheduleStats} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={(e) => {
                                    deleteJob(scheduleStats.name);
                                    client?.publish(
                                        "hub",
                                        JSON.stringify({ command: "RELOAD_CONFIG", arg1: "", arg2: "", arg3: "" })
                                    );
                                    onClose()
                                }}>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}