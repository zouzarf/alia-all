
import config from '../app/config.json'
import mqtt from 'mqtt'
export const mqttConnecter = (ip: { ip: string } | undefined) => {
  if (ip == undefined)
    return null
  const client = mqtt.connect('ws://' + ip['ip'] + ':' + config['MQTT-PORT'], { keepalive: 20 })
  client.on('connect', function () {
    client.subscribe('water_sensor', function (err) {
      if (!err) {
        console.log("connected to water_sensor")
      }
    })
    client.subscribe('hub', function (err) {
      if (!err) {
        console.log("connected to zones")
      }
    })
  })
  return client
}