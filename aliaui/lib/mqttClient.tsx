
import config from '../app/config.json'
import mqtt from 'mqtt'
export const mqttConnecter = (ip: { ip: string } | undefined) => {
  if (ip == undefined)
    return null
  const client = mqtt.connect('ws://' + ip['ip'] + ':' + config['MQTT-PORT'], { keepalive: 20 })
  client.on('connect', function () {
    client.subscribe('sensors', function (err) {
      if (!err) {
        console.log("connected to sensors")
      }
    })
    client.subscribe('hub_response', function (err) {
      if (!err) {
        console.log("connected to hub")
      }
    })
  })
  client.on('reconnect', () => {
    console.log('Reconnecting...');
  });

  client.on('close', () => {
    console.log('Connection closed');
  });

  client.on('offline', () => {
    console.log('Client is offline');
  });

  client.on('error', (error) => {
    console.error('Connection error: ', error);
  });
  return client
}