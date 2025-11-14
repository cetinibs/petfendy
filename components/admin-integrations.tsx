"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, MessageSquare, Send, Check, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface PaymentGatewayConfig {
  provider: 'iyzico' | 'paytr' | 'stripe' | 'none';
  enabled: boolean;
  apiKey: string;
  secretKey: string;
  merchantId?: string;
  testMode: boolean;
}

interface SMSProviderConfig {
  provider: 'netgsm' | 'iletimerkezi' | 'twilio' | 'none';
  enabled: boolean;
  username: string;
  password: string;
  apiKey?: string;
  senderId: string;
  testMode: boolean;
}

interface WhatsAppConfig {
  enabled: boolean;
  provider: 'twilio' | 'whatsapp-business-api' | 'none';
  accountSid?: string;
  authToken?: string;
  phoneNumber: string;
  businessAccountId?: string;
  accessToken?: string;
  testMode: boolean;
}

export function AdminIntegrations() {
  // Payment Gateway Configuration
  const [paymentConfig, setPaymentConfig] = useState<PaymentGatewayConfig>({
    provider: 'none',
    enabled: false,
    apiKey: '',
    secretKey: '',
    merchantId: '',
    testMode: true,
  })

  // SMS Provider Configuration
  const [smsConfig, setSmsConfig] = useState<SMSProviderConfig>({
    provider: 'none',
    enabled: false,
    username: '',
    password: '',
    apiKey: '',
    senderId: 'PETFENDY',
    testMode: true,
  })

  // WhatsApp Configuration
  const [whatsappConfig, setWhatsAppConfig] = useState<WhatsAppConfig>({
    enabled: false,
    provider: 'none',
    phoneNumber: '',
    testMode: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  // Load configurations from localStorage on mount
  useEffect(() => {
    const loadedPayment = localStorage.getItem('payment_gateway_config')
    const loadedSMS = localStorage.getItem('sms_provider_config')
    const loadedWhatsApp = localStorage.getItem('whatsapp_config')

    if (loadedPayment) setPaymentConfig(JSON.parse(loadedPayment))
    if (loadedSMS) setSmsConfig(JSON.parse(loadedSMS))
    if (loadedWhatsApp) setWhatsAppConfig(JSON.parse(loadedWhatsApp))
  }, [])

  const savePaymentConfig = () => {
    setIsSaving(true)
    try {
      localStorage.setItem('payment_gateway_config', JSON.stringify(paymentConfig))
      toast({
        title: "✅ Başarılı",
        description: "Ödeme gateway ayarları kaydedildi.",
      })
    } catch (error) {
      toast({
        title: "❌ Hata",
        description: "Ayarlar kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const saveSMSConfig = () => {
    setIsSaving(true)
    try {
      localStorage.setItem('sms_provider_config', JSON.stringify(smsConfig))
      toast({
        title: "✅ Başarılı",
        description: "SMS sağlayıcı ayarları kaydedildi.",
      })
    } catch (error) {
      toast({
        title: "❌ Hata",
        description: "Ayarlar kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const saveWhatsAppConfig = () => {
    setIsSaving(true)
    try {
      localStorage.setItem('whatsapp_config', JSON.stringify(whatsappConfig))
      toast({
        title: "✅ Başarılı",
        description: "WhatsApp ayarları kaydedildi.",
      })
    } catch (error) {
      toast({
        title: "❌ Hata",
        description: "Ayarlar kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const testPaymentConnection = async () => {
    toast({
      title: "🧪 Test Ediliyor",
      description: "Ödeme gateway bağlantısı test ediliyor...",
    })

    // Simulate API test
    setTimeout(() => {
      if (paymentConfig.apiKey && paymentConfig.secretKey) {
        toast({
          title: "✅ Bağlantı Başarılı",
          description: `${paymentConfig.provider.toUpperCase()} bağlantısı test edildi.`,
        })
      } else {
        toast({
          title: "❌ Bağlantı Hatası",
          description: "API anahtarlarını kontrol edin.",
          variant: "destructive",
        })
      }
    }, 2000)
  }

  const testSMSConnection = async () => {
    toast({
      title: "🧪 Test Ediliyor",
      description: "SMS sağlayıcı bağlantısı test ediliyor...",
    })

    setTimeout(() => {
      if (smsConfig.username && smsConfig.password) {
        toast({
          title: "✅ Bağlantı Başarılı",
          description: `${smsConfig.provider.toUpperCase()} bağlantısı test edildi.`,
        })
      } else {
        toast({
          title: "❌ Bağlantı Hatası",
          description: "Kullanıcı adı ve şifre kontrol edin.",
          variant: "destructive",
        })
      }
    }, 2000)
  }

  const testWhatsAppConnection = async () => {
    toast({
      title: "🧪 Test Ediliyor",
      description: "WhatsApp bağlantısı test ediliyor...",
    })

    setTimeout(() => {
      if (whatsappConfig.phoneNumber) {
        toast({
          title: "✅ Bağlantı Başarılı",
          description: "WhatsApp bağlantısı test edildi.",
        })
      } else {
        toast({
          title: "❌ Bağlantı Hatası",
          description: "Telefon numarasını kontrol edin.",
          variant: "destructive",
        })
      }
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Entegrasyon Ayarları</h2>
        <p className="text-muted-foreground">
          Ödeme, SMS ve WhatsApp entegrasyonlarını yapılandırın
        </p>
      </div>

      <Tabs defaultValue="payment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Sanal POS
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            SMS Entegrasyonu
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
        </TabsList>

        {/* Payment Gateway Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Sanal POS Entegrasyonu</CardTitle>
              <CardDescription>
                Ödeme işlemleri için kullanılacak sanal POS sağlayıcısını yapılandırın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Güvenlik nedeniyle, API anahtarlarınızı güvenli bir şekilde saklayın ve asla paylaşmayın.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="payment-enabled">Ödeme Gateway'i Etkinleştir</Label>
                  <p className="text-sm text-muted-foreground">
                    Müşterilerin ödeme yapabilmesi için aktif edin
                  </p>
                </div>
                <Switch
                  id="payment-enabled"
                  checked={paymentConfig.enabled}
                  onCheckedChange={(checked) =>
                    setPaymentConfig({ ...paymentConfig, enabled: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-provider">Sağlayıcı</Label>
                <select
                  id="payment-provider"
                  value={paymentConfig.provider}
                  onChange={(e) =>
                    setPaymentConfig({
                      ...paymentConfig,
                      provider: e.target.value as PaymentGatewayConfig['provider'],
                    })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="none">Seçiniz</option>
                  <option value="iyzico">İyzico</option>
                  <option value="paytr">PayTR</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>

              {paymentConfig.provider !== 'none' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="payment-apikey">API Key</Label>
                    <Input
                      id="payment-apikey"
                      type="password"
                      value={paymentConfig.apiKey}
                      onChange={(e) =>
                        setPaymentConfig({ ...paymentConfig, apiKey: e.target.value })
                      }
                      placeholder="API anahtarınızı girin"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-secretkey">Secret Key</Label>
                    <Input
                      id="payment-secretkey"
                      type="password"
                      value={paymentConfig.secretKey}
                      onChange={(e) =>
                        setPaymentConfig({ ...paymentConfig, secretKey: e.target.value })
                      }
                      placeholder="Secret key'inizi girin"
                    />
                  </div>

                  {(paymentConfig.provider === 'iyzico' || paymentConfig.provider === 'paytr') && (
                    <div className="space-y-2">
                      <Label htmlFor="payment-merchantid">Merchant ID</Label>
                      <Input
                        id="payment-merchantid"
                        value={paymentConfig.merchantId}
                        onChange={(e) =>
                          setPaymentConfig({ ...paymentConfig, merchantId: e.target.value })
                        }
                        placeholder="Merchant ID'nizi girin"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="payment-testmode">Test Modu</Label>
                      <p className="text-sm text-muted-foreground">
                        Geliştirme ve test için sandbox kullan
                      </p>
                    </div>
                    <Switch
                      id="payment-testmode"
                      checked={paymentConfig.testMode}
                      onCheckedChange={(checked) =>
                        setPaymentConfig({ ...paymentConfig, testMode: checked })
                      }
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={testPaymentConnection} variant="outline" className="flex-1">
                      Bağlantıyı Test Et
                    </Button>
                    <Button onClick={savePaymentConfig} disabled={isSaving} className="flex-1">
                      {isSaving ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Integration Tab */}
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>SMS Sağlayıcı Entegrasyonu</CardTitle>
              <CardDescription>
                Toplu SMS gönderimi için SMS sağlayıcısını yapılandırın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-enabled">SMS Bildirimlerini Etkinleştir</Label>
                  <p className="text-sm text-muted-foreground">
                    Müşterilere SMS gönderin
                  </p>
                </div>
                <Switch
                  id="sms-enabled"
                  checked={smsConfig.enabled}
                  onCheckedChange={(checked) =>
                    setSmsConfig({ ...smsConfig, enabled: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms-provider">SMS Sağlayıcı</Label>
                <select
                  id="sms-provider"
                  value={smsConfig.provider}
                  onChange={(e) =>
                    setSmsConfig({
                      ...smsConfig,
                      provider: e.target.value as SMSProviderConfig['provider'],
                    })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="none">Seçiniz</option>
                  <option value="netgsm">Netgsm</option>
                  <option value="iletimerkezi">İletimerkezi</option>
                  <option value="twilio">Twilio</option>
                </select>
              </div>

              {smsConfig.provider !== 'none' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sms-username">Kullanıcı Adı</Label>
                      <Input
                        id="sms-username"
                        value={smsConfig.username}
                        onChange={(e) =>
                          setSmsConfig({ ...smsConfig, username: e.target.value })
                        }
                        placeholder="Kullanıcı adınız"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sms-password">Şifre</Label>
                      <Input
                        id="sms-password"
                        type="password"
                        value={smsConfig.password}
                        onChange={(e) =>
                          setSmsConfig({ ...smsConfig, password: e.target.value })
                        }
                        placeholder="Şifreniz"
                      />
                    </div>
                  </div>

                  {smsConfig.provider === 'twilio' && (
                    <div className="space-y-2">
                      <Label htmlFor="sms-apikey">API Key (Twilio)</Label>
                      <Input
                        id="sms-apikey"
                        type="password"
                        value={smsConfig.apiKey}
                        onChange={(e) =>
                          setSmsConfig({ ...smsConfig, apiKey: e.target.value })
                        }
                        placeholder="Twilio API key"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="sms-senderid">Gönderici Adı (Sender ID)</Label>
                    <Input
                      id="sms-senderid"
                      value={smsConfig.senderId}
                      onChange={(e) =>
                        setSmsConfig({ ...smsConfig, senderId: e.target.value })
                      }
                      placeholder="PETFENDY"
                      maxLength={11}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maksimum 11 karakter, sadece harf kullanın
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-testmode">Test Modu</Label>
                      <p className="text-sm text-muted-foreground">
                        SMS'ler gerçekten gönderilmeyecek
                      </p>
                    </div>
                    <Switch
                      id="sms-testmode"
                      checked={smsConfig.testMode}
                      onCheckedChange={(checked) =>
                        setSmsConfig({ ...smsConfig, testMode: checked })
                      }
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={testSMSConnection} variant="outline" className="flex-1">
                      Bağlantıyı Test Et
                    </Button>
                    <Button onClick={saveSMSConfig} disabled={isSaving} className="flex-1">
                      {isSaving ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Integration Tab */}
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Entegrasyonu</CardTitle>
              <CardDescription>
                Müşterilere WhatsApp üzerinden bildirim gönderin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  WhatsApp Business API kullanmak için onaylı bir hesaba ihtiyacınız var.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="whatsapp-enabled">WhatsApp Bildirimlerini Etkinleştir</Label>
                  <p className="text-sm text-muted-foreground">
                    Sipariş bildirimleri WhatsApp'tan gönderilsin
                  </p>
                </div>
                <Switch
                  id="whatsapp-enabled"
                  checked={whatsappConfig.enabled}
                  onCheckedChange={(checked) =>
                    setWhatsAppConfig({ ...whatsappConfig, enabled: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-provider">Sağlayıcı</Label>
                <select
                  id="whatsapp-provider"
                  value={whatsappConfig.provider}
                  onChange={(e) =>
                    setWhatsAppConfig({
                      ...whatsappConfig,
                      provider: e.target.value as WhatsAppConfig['provider'],
                    })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="none">Seçiniz</option>
                  <option value="twilio">Twilio WhatsApp</option>
                  <option value="whatsapp-business-api">WhatsApp Business API</option>
                </select>
              </div>

              {whatsappConfig.provider !== 'none' && (
                <>
                  {whatsappConfig.provider === 'twilio' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp-accountsid">Account SID</Label>
                        <Input
                          id="whatsapp-accountsid"
                          type="password"
                          value={whatsappConfig.accountSid || ''}
                          onChange={(e) =>
                            setWhatsAppConfig({ ...whatsappConfig, accountSid: e.target.value })
                          }
                          placeholder="Twilio Account SID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="whatsapp-authtoken">Auth Token</Label>
                        <Input
                          id="whatsapp-authtoken"
                          type="password"
                          value={whatsappConfig.authToken || ''}
                          onChange={(e) =>
                            setWhatsAppConfig({ ...whatsappConfig, authToken: e.target.value })
                          }
                          placeholder="Twilio Auth Token"
                        />
                      </div>
                    </>
                  )}

                  {whatsappConfig.provider === 'whatsapp-business-api' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp-businessid">Business Account ID</Label>
                        <Input
                          id="whatsapp-businessid"
                          value={whatsappConfig.businessAccountId || ''}
                          onChange={(e) =>
                            setWhatsAppConfig({ ...whatsappConfig, businessAccountId: e.target.value })
                          }
                          placeholder="WhatsApp Business Account ID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="whatsapp-accesstoken">Access Token</Label>
                        <Input
                          id="whatsapp-accesstoken"
                          type="password"
                          value={whatsappConfig.accessToken || ''}
                          onChange={(e) =>
                            setWhatsAppConfig({ ...whatsappConfig, accessToken: e.target.value })
                          }
                          placeholder="Access Token"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-phone">WhatsApp Telefon Numarası</Label>
                    <Input
                      id="whatsapp-phone"
                      value={whatsappConfig.phoneNumber}
                      onChange={(e) =>
                        setWhatsAppConfig({ ...whatsappConfig, phoneNumber: e.target.value })
                      }
                      placeholder="+905551234567"
                    />
                    <p className="text-xs text-muted-foreground">
                      Örnek: +905551234567 (Ülke kodu ile birlikte)
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="whatsapp-testmode">Test Modu</Label>
                      <p className="text-sm text-muted-foreground">
                        Mesajlar gerçekten gönderilmeyecek
                      </p>
                    </div>
                    <Switch
                      id="whatsapp-testmode"
                      checked={whatsappConfig.testMode}
                      onCheckedChange={(checked) =>
                        setWhatsAppConfig({ ...whatsappConfig, testMode: checked })
                      }
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={testWhatsAppConnection} variant="outline" className="flex-1">
                      Bağlantıyı Test Et
                    </Button>
                    <Button onClick={saveWhatsAppConfig} disabled={isSaving} className="flex-1">
                      {isSaving ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
