import { MqttClient } from "mqtt/*";

interface ControllerCommand{
    actionner: string
    command: string
    arg1: string
}

export default function sendControllerCommand(mqttClient: MqttClient, channel: string, command: ControllerCommand) {
    mqttClient.publish(
        channel,
        JSON.stringify(command)
    );
}