'use server'
interface HubCommand{
    command: string
    arg1: string
    arg2: string
    arg3: string
    arg4: string
}

export async function routeWater(
    pump_number: string, 
    pump_warm_up: string, 
    pump_timer: string, 
    warm_up_compressor: string, 
    compression_time: string, 
    zone: string
) {
    const res = await fetch(
        `http://127.0.0.1:8001/route_water?pump_number=${pump_number}&pump_warm_up=${pump_warm_up}&pump_seconds=${pump_timer}&compressor_warm_up=${warm_up_compressor}&compressor_seconds=${compression_time}&destination=${zone}`, 
        { cache: 'no-store' }
    );
    const data = await res.json();
    return data;
}