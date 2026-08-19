const functionUrl = import.meta.env.VITE_ALIYUN_FUNCTION_URL || ''
const authUrl = import.meta.env.VITE_ALIYUN_AUTH_URL || ''

export function isCloudConfigured() {
  return Boolean(functionUrl)
}

export function isExternalAuthConfigured() {
  return Boolean(authUrl)
}

export async function externalAuthRequest(action, payload) {
  if (!authUrl) return { configured: false }
  const response = await fetch(authUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload })
  })
  if (!response.ok) throw new Error(`External authentication returned ${response.status}`)
  return response.json()
}

export async function invokeCloudFunction(action, payload = {}) {
  if (!functionUrl) {
    return { success: false, configured: false, message: 'Cloud Function endpoint is not configured. Running in local demo mode.' }
  }
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload })
  })
  if (!response.ok) throw new Error(`Cloud Function returned ${response.status}`)
  return response.json()
}

export async function sendAppointmentEmail(appointment) {
  return invokeCloudFunction('send-appointment-email', { appointment })
}

export async function askHealthAssistant(question) {
  if (!functionUrl) {
    return {
      success: true,
      configured: false,
      answer: 'I can help you find HealthBridge resources. Try asking about exercise, nutrition, sleep, or finding a local service. For medical advice, please contact a qualified health professional.'
    }
  }
  return invokeCloudFunction('health-assistant', { question })
}
