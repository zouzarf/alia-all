'use server'

export async function checkStatusHub() {
    try {
        console.log(process.env.DRIVER_SERVER)
        const response = await fetch('http://' + process.env.HUB_SERVER + ':8001/status', {
            cache: 'no-store',
        })
        return response.status === 200
    } catch (error) {
        console.error('Status check failed:', error)
        return false
    }
}
export async function checkStatusDriver() {
    try {
        const response = await fetch('http://' + process.env.DRIVER_SERVER + ':8000/status', {
            cache: 'no-store',
        })
        return response.status === 200
    } catch (error) {
        console.error('Status check failed:', error)
        return false
    }
}
export async function checkStatusScheduler() {
    try {
        const response = await fetch('http://' + process.env.SCHEDULER_SERVER + ':8002/status', {
            cache: 'no-store',
        })
        return response.status === 200
    } catch (error) {
        console.error('Status check failed:', error)
        return false
    }
}
export async function ReloadDriver() {
    try {
        const response = await fetch('http://' + process.env.DRIVER_SERVER + ':8000/reload', {
            cache: 'no-store',
        })
        return response.status === 200
    } catch (error) {
        console.error('Reload check failed:', error)
        return false
    }
}