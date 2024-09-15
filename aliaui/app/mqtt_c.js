
import config from '@/public/config.json'
import mqtt from 'mqtt'
const client = mqtt.connect('ws://'+config['RASP_SERVER']+':9009', { keepalive: 20 })

client.on('connect', function () {
    client.subscribe('water_level', function (err) {
      if (!err) {
        console.log("connected to water_level")
      }
    })
    client.subscribe('hub', function (err) {
      if (!err) {
        console.log("connected to zones")
      }
    })
  })

export default client