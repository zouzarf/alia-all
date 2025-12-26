'use server'
interface ControllerCommand{
    actionner: string
    command: string
    arg1: string
}


export async function handleComponentCommand(component: string, command: string) {
    const res = await fetch(
        `http://${process.env.DRIVER_SERVER}:8000/${component}/${command}`, 
        { cache: 'no-store' }
    );
    const data = await res.json();
    return data;
}