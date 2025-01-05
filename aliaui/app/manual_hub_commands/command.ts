import { MqttClient } from "mqtt/*";

interface HubCommand{
    command: string
    arg1: string
    arg2: string
    arg3: string
}

export function sendHubCommand(mqttClient: MqttClient, channel: string, command: HubCommand) {
    mqttClient.publish(
        channel,
        JSON.stringify(command)
    );
}