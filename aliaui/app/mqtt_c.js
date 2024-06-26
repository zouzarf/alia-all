
import config from './config.json'
import mqtt from 'mqtt'
const client = mqtt.connect('ws://'+config['MQTT-IP']+':'+config['MQTT-PORT'], { keepalive: 20 })

client.on('connect', function () {
    client.subscribe('water_level', function (err) {
      if (!err) {
        console.log("connected to water_level")
      }
    })
    client.subscribe('config', function (err) {
      if (!err) {
        console.log("connected to zones")
      }
    })
    client.subscribe('master_event', function (err) {
      if (!err) {
        console.log("connected to master_event")
      }
    })
  })

export default client