// Notification Service for SMS and WhatsApp
// This service sends notifications when orders are completed

import type { Order } from "./types"

interface NotificationConfig {
  sms: {
    enabled: boolean
    provider: 'netgsm' | 'iletimerkezi' | 'twilio' | 'none'
    username: string
    password: string
    apiKey?: string
    senderId: string
    testMode: boolean
  }
  whatsapp: {
    enabled: boolean
    provider: 'twilio' | 'whatsapp-business-api' | 'none'
    phoneNumber: string
    testMode: boolean
  }
}

interface NotificationResult {
  success: boolean
  messageId?: string
  error?: string
  provider: string
  type: 'sms' | 'whatsapp'
}

/**
 * Load notification configuration from localStorage
 */
export function getNotificationConfig(): NotificationConfig {
  const defaultConfig: NotificationConfig = {
    sms: {
      enabled: false,
      provider: 'none',
      username: '',
      password: '',
      senderId: 'PETFENDY',
      testMode: true,
    },
    whatsapp: {
      enabled: false,
      provider: 'none',
      phoneNumber: '',
      testMode: true,
    },
  }

  try {
    const smsConfig = localStorage.getItem('sms_provider_config')
    const whatsappConfig = localStorage.getItem('whatsapp_config')

    return {
      sms: smsConfig ? JSON.parse(smsConfig) : defaultConfig.sms,
      whatsapp: whatsappConfig ? JSON.parse(whatsappConfig) : defaultConfig.whatsapp,
    }
  } catch (error) {
    console.error('Error loading notification config:', error)
    return defaultConfig
  }
}

/**
 * Send SMS notification
 */
export async function sendSMSNotification(
  phoneNumber: string,
  message: string
): Promise<NotificationResult> {
  const config = getNotificationConfig()

  if (!config.sms.enabled) {
    return {
      success: false,
      error: 'SMS notifications are disabled',
      provider: 'none',
      type: 'sms',
    }
  }

  // Test mode: simulate sending
  if (config.sms.testMode) {
    console.log(`[TEST MODE] SMS to ${phoneNumber}: ${message}`)
    return {
      success: true,
      messageId: `test-${Date.now()}`,
      provider: config.sms.provider,
      type: 'sms',
    }
  }

  try {
    // Real SMS sending based on provider
    switch (config.sms.provider) {
      case 'netgsm':
        return await sendNetgsmSMS(phoneNumber, message, config.sms)
      case 'iletimerkezi':
        return await sendIletimerkeziSMS(phoneNumber, message, config.sms)
      case 'twilio':
        return await sendTwilioSMS(phoneNumber, message, config.sms)
      default:
        return {
          success: false,
          error: 'No SMS provider configured',
          provider: 'none',
          type: 'sms',
        }
    }
  } catch (error) {
    console.error('Error sending SMS:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      provider: config.sms.provider,
      type: 'sms',
    }
  }
}

/**
 * Send WhatsApp notification
 */
export async function sendWhatsAppNotification(
  phoneNumber: string,
  message: string
): Promise<NotificationResult> {
  const config = getNotificationConfig()

  if (!config.whatsapp.enabled) {
    return {
      success: false,
      error: 'WhatsApp notifications are disabled',
      provider: 'none',
      type: 'whatsapp',
    }
  }

  // Test mode: simulate sending
  if (config.whatsapp.testMode) {
    console.log(`[TEST MODE] WhatsApp to ${phoneNumber}: ${message}`)
    return {
      success: true,
      messageId: `test-wa-${Date.now()}`,
      provider: config.whatsapp.provider,
      type: 'whatsapp',
    }
  }

  try {
    // Real WhatsApp sending based on provider
    switch (config.whatsapp.provider) {
      case 'twilio':
        return await sendTwilioWhatsApp(phoneNumber, message, config.whatsapp)
      case 'whatsapp-business-api':
        return await sendWhatsAppBusinessAPI(phoneNumber, message, config.whatsapp)
      default:
        return {
          success: false,
          error: 'No WhatsApp provider configured',
          provider: 'none',
          type: 'whatsapp',
        }
    }
  } catch (error) {
    console.error('Error sending WhatsApp:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      provider: config.whatsapp.provider,
      type: 'whatsapp',
    }
  }
}

/**
 * Send order confirmation notifications (SMS + WhatsApp)
 */
export async function sendOrderNotifications(
  order: Order,
  customerPhone: string
): Promise<{ sms: NotificationResult; whatsapp: NotificationResult }> {
  const message = generateOrderMessage(order)

  const [smsResult, whatsappResult] = await Promise.all([
    sendSMSNotification(customerPhone, message),
    sendWhatsAppNotification(customerPhone, message),
  ])

  return {
    sms: smsResult,
    whatsapp: whatsappResult,
  }
}

/**
 * Generate order confirmation message
 */
function generateOrderMessage(order: Order): string {
  const orderType = order.items[0]?.type === 'hotel' ? 'Otel Rezervasyonu' : 'Pet Taksi Hizmeti'
  const totalPrice = order.totalAmount.toFixed(2)

  return `
Petfendy - ${orderType}

Sipariş No: ${order.id}
Tutar: ${totalPrice} TL
Durum: ${getOrderStatusText(order.status)}

Detaylar için: https://petfendy.com

Teşekkür ederiz! 🐾
  `.trim()
}

/**
 * Get order status text in Turkish
 */
function getOrderStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Beklemede',
    paid: 'Ödendi',
    confirmed: 'Onaylandı',
    completed: 'Tamamlandı',
    cancelled: 'İptal Edildi',
  }
  return statusMap[status] || status
}

// ===== Provider-specific implementations =====

/**
 * Send SMS via Netgsm
 */
async function sendNetgsmSMS(
  phoneNumber: string,
  message: string,
  config: any
): Promise<NotificationResult> {
  // Netgsm API implementation
  const url = 'https://api.netgsm.com.tr/sms/send/get'
  const params = new URLSearchParams({
    usercode: config.username,
    password: config.password,
    gsmno: phoneNumber.replace('+', ''),
    message: message,
    msgheader: config.senderId,
  })

  const response = await fetch(`${url}?${params.toString()}`)
  const result = await response.text()

  if (result.startsWith('00') || result.startsWith('01')) {
    return {
      success: true,
      messageId: result,
      provider: 'netgsm',
      type: 'sms',
    }
  } else {
    return {
      success: false,
      error: `Netgsm error: ${result}`,
      provider: 'netgsm',
      type: 'sms',
    }
  }
}

/**
 * Send SMS via İletimerkezi
 */
async function sendIletimerkeziSMS(
  phoneNumber: string,
  message: string,
  config: any
): Promise<NotificationResult> {
  // İletimerkezi API implementation
  const url = 'https://api.iletimerkezi.com/v1/send-sms/get'
  const params = new URLSearchParams({
    username: config.username,
    password: config.password,
    receipents: phoneNumber.replace('+', ''),
    message: message,
    sender: config.senderId,
  })

  const response = await fetch(`${url}?${params.toString()}`)
  const result = await response.json()

  if (result.status === 'success') {
    return {
      success: true,
      messageId: result.messageId,
      provider: 'iletimerkezi',
      type: 'sms',
    }
  } else {
    return {
      success: false,
      error: `İletimerkezi error: ${result.message}`,
      provider: 'iletimerkezi',
      type: 'sms',
    }
  }
}

/**
 * Send SMS via Twilio
 */
async function sendTwilioSMS(
  phoneNumber: string,
  message: string,
  config: any
): Promise<NotificationResult> {
  // Twilio API implementation (requires server-side endpoint)
  const response = await fetch('/api/notifications/sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: phoneNumber,
      message: message,
      provider: 'twilio',
    }),
  })

  const result = await response.json()

  if (result.success) {
    return {
      success: true,
      messageId: result.messageId,
      provider: 'twilio',
      type: 'sms',
    }
  } else {
    return {
      success: false,
      error: result.error,
      provider: 'twilio',
      type: 'sms',
    }
  }
}

/**
 * Send WhatsApp via Twilio
 */
async function sendTwilioWhatsApp(
  phoneNumber: string,
  message: string,
  config: any
): Promise<NotificationResult> {
  // Twilio WhatsApp API implementation (requires server-side endpoint)
  const response = await fetch('/api/notifications/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: phoneNumber,
      message: message,
      provider: 'twilio',
    }),
  })

  const result = await response.json()

  if (result.success) {
    return {
      success: true,
      messageId: result.messageId,
      provider: 'twilio',
      type: 'whatsapp',
    }
  } else {
    return {
      success: false,
      error: result.error,
      provider: 'twilio',
      type: 'whatsapp',
    }
  }
}

/**
 * Send WhatsApp via WhatsApp Business API
 */
async function sendWhatsAppBusinessAPI(
  phoneNumber: string,
  message: string,
  config: any
): Promise<NotificationResult> {
  // WhatsApp Business API implementation (requires server-side endpoint)
  const response = await fetch('/api/notifications/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: phoneNumber,
      message: message,
      provider: 'whatsapp-business-api',
    }),
  })

  const result = await response.json()

  if (result.success) {
    return {
      success: true,
      messageId: result.messageId,
      provider: 'whatsapp-business-api',
      type: 'whatsapp',
    }
  } else {
    return {
      success: false,
      error: result.error,
      provider: 'whatsapp-business-api',
      type: 'whatsapp',
    }
  }
}

/**
 * Send admin notification (for new orders)
 */
export async function sendAdminNotification(order: Order): Promise<void> {
  const config = getNotificationConfig()

  // Send to admin phone if configured
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE || '+905551234567'

  const message = `
🔔 Yeni Sipariş!

Sipariş No: ${order.id}
Tutar: ${order.totalAmount.toFixed(2)} TL
Müşteri: ${order.userId || 'Misafir'}

Yönetim panelinden detayları görüntüleyin.
  `.trim()

  await Promise.all([
    config.sms.enabled ? sendSMSNotification(adminPhone, message) : Promise.resolve(null),
    config.whatsapp.enabled ? sendWhatsAppNotification(adminPhone, message) : Promise.resolve(null),
  ])
}
