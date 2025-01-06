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
export default function CardModal({ irrigations, scheduleStats }: { irrigations: irrigation[], scheduleStats: scheduleStats }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
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
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}