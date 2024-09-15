// app/api/mqtt-config/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  if (!global.process.env.RASP_SERV) {
    return NextResponse.json({ error: 'Environment variable not set' }, { status: 500 });
  }

  // Return the environment variable
  return NextResponse.json({ ip: global.process.env.RASP_SERV });
  const configPath = path.join(process.cwd(), 'public/', 'config.json');
  
  try {
    const configFile = await fs.promises.readFile(configPath, 'utf8');
    const config = JSON.parse(configFile);
    console.log(config)
    
    return NextResponse.json({
      brokerUrl: `ws://${config['MQTT-IP']}:${config['MQTT-PORT'] || 1883}`
    });
  } catch (error) {
    console.error('Error reading config:', error);
    return NextResponse.json({ error: 'Failed to read configuration' }, { status: 500 });
  }
}