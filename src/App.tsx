import React from "react"
import { useState} from "react"
// Types
interface EmailData {
  sender: string
  subject: string
  body: string
  headers: string
  attachments: string[]
  urls: string[]
}

interface RiskScores {
  url: number
  sender: number
  attachment: number
  content: number
}

interface AnalysisResult {
  email: EmailData
  aiScore: number
  aiDetails: string
  riskScores: RiskScores
  totalRisk: number
  verdict: "safe" | "suspicious" | "malicious"
  verdictText: string
  timestamp: string
}

// Mock data for demo
const mockEmails: EmailData[] = [
  {
    sender: "security-alert@bankofamerica-secure.xyz",
    subject: "🚨 ACİL! Hesabınız askıya alındı - hemen doğrulayın",
    body: "Sayın Müşterimiz, hesabınızda şüpheli aktivite tespit edildi. 24 saat içinde doğrulama yapmazsanız hesabınız kalıcı olarak kapatılacaktır. Hemen doğrulamak için tıklayın: http://bit.ly/3xK9mZ2",
    headers: "Return-Path: <bounce@mail-server.ru>\nReceived: from unknown (HELO mail.suspicious.net)",
    attachments: ["invoice_details.pdf.exe"],
    urls: ["http://bit.ly/3xK9mZ2", "http://bankofamerica-login.suspicious.net/verify"],
  },
  {
    sender: "newsletter@medium.com",
    subject: "Haftalık Özet: Bu hafta en çok okunan yazılar",
    body: "Merhaba, bu hafta platformumuzda en çok ilgi gören içerikleri sizin için derledik. Keyifli okumalar!",
    headers: "Return-Path: <newsletter@medium.com>\nDKIM-Signature: v=1; a=rsa-sha256; d=medium.com",
    attachments: [],
    urls: ["https://medium.com/weekly-digest"],
  },
  {
    sender: "support@paypa1.com",
    subject: "Ödemeniz başarısız oldu - Kart bilgilerinizi güncelleyin",
    body: "PayPal hesabınıza bağlı kartınızın süresi dolmuş. Lütfen aşağıdaki bağlantıdan kart bilgilerinizi güncelleyiniz.",
    headers: "Return-Path: <noreply@mail-marketing.cc>\nX-Originating-IP: [185.234.xx.xx]",
    attachments: ["payment_receipt.html"],
    urls: ["http://paypa1-secure.com/update-card"],
  },
]

// Simulate analysis
const analyzeEmail = (email: EmailData): AnalysisResult => {
  const urlRisk = email.urls.some((u) => u.includes("bit.ly") || !u.startsWith("https")) ? 85 : 15
  const senderRisk = email.sender.includes(".xyz") || email.sender.includes("paypa1") ? 90 : 20
  const attachmentRisk = email.attachments.some((a) => a.includes(".exe") || a.includes(".html")) ? 95 : 10
  const contentRisk = email.body.includes("ACİL") || email.body.includes("24 saat") ? 80 : 25

  const totalRisk = Math.round((urlRisk * 0.25 + senderRisk * 0.3 + attachmentRisk * 0.25 + contentRisk * 0.2) * 10) / 10

  let verdict: "safe" | "suspicious" | "malicious"
  let verdictText: string

  if (totalRisk >= 70) {
    verdict = "malicious"
    verdictText = "DANGER - Zararlı Mail Tespit Edildi"
  } else if (totalRisk >= 40) {
    verdict = "suspicious"
    verdictText = "WARNING - Şüpheli İçerik"
  } else {
    verdict = "safe"
    verdictText = "SUCCESS - Güvenli"
  }

  const details =
    verdict === "malicious"
      ? `Bu e-posta yüksek riskli olarak değerlendirilmiştir. Sebepleri: ${senderRisk > 70 ? "Şüpheli gönderen domain'i tespit edildi. " : ""}${urlRisk > 70 ? "Kısa URL veya güvensiz bağlantılar mevcut. " : ""}${attachmentRisk > 70 ? "Potansiyel zararlı dosya eki bulunuyor. " : ""}${contentRisk > 70 ? "Aciliyet ve tehdit içeren dil kullanımı." : ""}`
      : verdict === "suspicious"
        ? "Bu e-posta bazı şüpheli özellikler içermektedir. Manuel inceleme önerilir."
        : "E-posta güvenlik kontrollerinden başarıyla geçmiştir."

  return {
    email,
    aiScore: Math.round((urlRisk * 0.3 + contentRisk * 0.7) * 10) / 10,
    aiDetails: details,
    riskScores: { url: urlRisk, sender: senderRisk, attachment: attachmentRisk, content: contentRisk },
    totalRisk,
    verdict,
    verdictText,
    timestamp: new Date().toLocaleString("tr-TR"),
  }
}

// Components
const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
)

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const LoadingSpinner = () => (
  <div
    style={{
      width: 40,
      height: 40,
      border: "3px solid rgba(0, 212, 170, 0.2)",
      borderTop: "3px solid #00D4AA",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    }}
  />
)

const RiskBar = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
      <span style={{ color: "#94A3B8" }}>{label}</span>
      <span style={{ color, fontWeight: 600 }}>%{value}</span>
    </div>
    <div style={{ background: "#1E293B", borderRadius: 4, height: 8, overflow: "hidden" }}>
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 4,
          transition: "width 0.8s ease-out",
        }}
      />
    </div>
  </div>
)

const TabButton = ({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  icon: React.ReactNode
}) => (
  <button
    onClick={onClick}
    style={{
      background: active ? "linear-gradient(135deg, #00D4AA20, #00D4AA10)" : "transparent",
      border: active ? "1px solid #00D4AA40" : "1px solid transparent",
      borderBottom: active ? "2px solid #00D4AA" : "2px solid transparent",
      color: active ? "#00D4AA" : "#64748B",
      padding: "12px 20px",
      cursor: "pointer",
      fontSize: 14,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: 8,
      transition: "all 0.2s ease",
      borderRadius: "8px 8px 0 0",
    }}
  >
    {icon}
    {children}
  </button>
)

export default function PhishingShieldAdmin() {
  const [activeScene, setActiveScene] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [formData, setFormData] = useState<EmailData>({
    sender: "",
    subject: "",
    body: "",
    headers: "",
    attachments: [],
    urls: [],
  })
  const [files, setFiles] = useState<File[]>([])

  const loadRandomSample = () => {
    const sample = mockEmails[Math.floor(Math.random() * mockEmails.length)]
    setFormData(sample)
    setAnalysisResult(null)
    setActiveScene(0)
  }

  const runAnalysis = async () => {
    if (!formData.sender || !formData.subject) return

    setIsAnalyzing(true)
    setActiveScene(1)

    // Simulate analysis delay
    await new Promise((r) => setTimeout(r, 2000))
    const result = analyzeEmail(formData)
    setAnalysisResult(result)
    setIsAnalyzing(false)
  }

  const getVerdictColor = (verdict?: string) => {
    switch (verdict) {
      case "malicious":
        return "#EF4444"
      case "suspicious":
        return "#F59E0B"
      case "safe":
        return "#10B981"
      default:
        return "#64748B"
    }
  }

  const getRiskColor = (value: number) => {
    if (value >= 70) return "#EF4444"
    if (value >= 40) return "#F59E0B"
    return "#10B981"
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0B1120 0%, #0F172A 50%, #1E293B 100%)",
        color: "#E2E8F0",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        input, textarea { font-family: inherit; }
        input:focus, textarea:focus { outline: none; border-color: #00D4AA !important; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1E293B; }
        ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
      `}</style>

      {/* Header */}
      <header
        style={{
          background: "linear-gradient(90deg, #0B1120, #162032)",
          borderBottom: "1px solid #1E3A5F",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              color: "#00D4AA",
              background: "linear-gradient(135deg, #00D4AA20, #00D4AA10)",
              padding: 10,
              borderRadius: 12,
              border: "1px solid #00D4AA30",
            }}
          >
            <ShieldIcon />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#F1F5F9" }}>
              AI E-Posta Tehdit Analiz Motoru
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: "#64748B" }}>Siber Güvenlik Koruma Sistemi v1.0</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              background: "#10B98120",
              color: "#10B981",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ width: 8, height: 8, background: "#10B981", borderRadius: "50%" }} />
            Sistem Aktif
          </div>
        </div>
      </header>

      <main style={{ padding: "24px 32px", maxWidth: 1400, margin: "0 auto" }}>
        {/* Input Form Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #1E293B, #162032)",
            borderRadius: 16,
            border: "1px solid #334155",
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}
          >
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#F1F5F9" }}>📧 E-Posta Analiz Formu</h2>
            <button
              onClick={loadRandomSample}
              style={{
                background: "linear-gradient(135deg, #3B82F620, #3B82F610)",
                border: "1px solid #3B82F640",
                color: "#60A5FA",
                padding: "8px 16px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              📌 CSV'den Örnek Getir
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>
                Gönderen (Sender)
              </label>
              <input
                type="email"
                value={formData.sender}
                onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                placeholder="ornek@domain.com"
                style={{
                  width: "100%",
                  background: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  padding: "12px 14px",
                  color: "#E2E8F0",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>Konu (Subject)</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="E-posta konusu"
                style={{
                  width: "100%",
                  background: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  padding: "12px 14px",
                  color: "#E2E8F0",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>İçerik (Body)</label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="E-posta içeriği..."
              rows={3}
              style={{
                width: "100%",
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: 8,
                padding: "12px 14px",
                color: "#E2E8F0",
                fontSize: 14,
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>
          
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>Headers</label>
            
            <input
              type="text"
              value={formData.headers}
              onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
              placeholder="E-posta başlık bilgileri"

              style={{
                width: "100%",
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: 8,
                padding: "12px 14px",
                color: "#E2E8F0",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginTop: 16 }}>
  <label style={{ display: "block", fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>
    Ek Dosya (PDF, EXE vb.)
  </label>

  <input
  type="file"
  multiple
  onChange={(e) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return

    const fileArray = Array.from(selectedFiles)

    setFiles(fileArray)

    setFormData({
      ...formData,
      attachments: fileArray.map((f) => f.name),
    })
  }}
/>
{files.map((file, i) => (
  <div key={i} style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>
    📎 {file.name}
  </div>
))}
</div>
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing || !formData.sender}
            style={{
              width: "100%",
              marginTop: 20,
              background: isAnalyzing
                ? "#475569"
                : "linear-gradient(135deg, #00D4AA, #00B894)",
              border: "none",
              borderRadius: 10,
              padding: "14px 24px",
              color: isAnalyzing ? "#94A3B8" : "#0B1120",
              fontSize: 15,
              fontWeight: 700,
              cursor: isAnalyzing ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s ease",
            }}
          >
            {isAnalyzing ? (
              <>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    border: "2px solid #94A3B8",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Analiz Yapılıyor...
              </>
            ) : (
              <>🔍 TARA VE ANALİZ ET</>
            )}
          </button>
        </div>

        {/* Scene Tabs */}
        <div
          style={{
            background: "#0F172A",
            borderRadius: "12px 12px 0 0",
            borderBottom: "1px solid #334155",
            display: "flex",
            gap: 4,
            padding: "8px 8px 0",
          }}
        >
          <TabButton active={activeScene === 0} onClick={() => setActiveScene(0)} icon={<MailIcon />}>
            Anasayfa
          </TabButton>
          <TabButton
            active={activeScene === 1}
            onClick={() => analysisResult && setActiveScene(1)}
            icon={<MailIcon />}
          >
            Scene-1: Alınan Mail
          </TabButton>
          <TabButton
            active={activeScene === 2}
            onClick={() => analysisResult && setActiveScene(2)}
            icon={<AlertIcon />}
          >
            Scene-2: AI Analizi
          </TabButton>
          <TabButton
            active={activeScene === 3}
            onClick={() => analysisResult && setActiveScene(3)}
            icon={<ChartIcon />}
          >
            Scene-3: Risk Skorları
          </TabButton>
          <TabButton
            active={activeScene === 4}
            onClick={() => analysisResult && setActiveScene(4)}
            icon={<CheckIcon />}
          >
            Scene-4: Sonuç
          </TabButton>
        </div>

        {/* Scene Content */}
        <div
          style={{
            background: "linear-gradient(180deg, #0F172A, #1E293B)",
            borderRadius: "0 0 12px 12px",
            border: "1px solid #334155",
            borderTop: "none",
            minHeight: 400,
            padding: 24,
          }}
        >
          {/* Scene 0: Home */}
          {activeScene === 0 && !isAnalyzing && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 350,
                textAlign: "center",
              }}
            >
              <div style={{ color: "#00D4AA", marginBottom: 20, opacity: 0.6 }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 style={{ margin: "0 0 12px", color: "#F1F5F9", fontSize: 20, fontWeight: 600 }}>
                Analiz Bekleniyor
              </h3>
              <p style={{ margin: 0, color: "#64748B", fontSize: 14, maxWidth: 400 }}>
                Yukarıdaki forma e-posta bilgilerini girin veya CSV'den örnek yükleyin, ardından "Tara ve Analiz Et"
                butonuna tıklayın.
              </p>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 350,
              }}
            >
              <LoadingSpinner />
              <p style={{ marginTop: 20, color: "#94A3B8", animation: "pulse 1.5s infinite" }}>
                ⏳ E-posta analiz ediliyor...
              </p>
              <p style={{ color: "#64748B", fontSize: 13 }}>URL, Gönderen, İçerik ve Ek dosyalar taranıyor</p>
            </div>
          )}

          {/* Scene 1: Received Mail */}
          {activeScene === 1 && analysisResult && !isAnalyzing && (
            <div style={{ animation: "slideIn 0.3s ease" }}>
              <h3 style={{ margin: "0 0 20px", color: "#F1F5F9", fontSize: 18, fontWeight: 600 }}>
                📨 Alınan E-Posta Detayları
              </h3>
              <div
                style={{
                  background: "#0B1120",
                  borderRadius: 12,
                  border: "1px solid #334155",
                  padding: 20,
                }}
              >
                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <span style={{ color: "#64748B", fontSize: 12, display: "block", marginBottom: 4 }}>Gönderen</span>
                    <span style={{ color: "#EF4444", fontWeight: 500 }}>{analysisResult.email.sender}</span>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: 12, display: "block", marginBottom: 4 }}>Konu</span>
                    <span style={{ color: "#F1F5F9" }}>{analysisResult.email.subject}</span>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: 12, display: "block", marginBottom: 4 }}>İçerik</span>
                    <p style={{ color: "#94A3B8", margin: 0, lineHeight: 1.6, fontSize: 14 }}>
                      {analysisResult.email.body.slice(0, 200)}...
                    </p>
                  </div>
                  {analysisResult.email.urls.length > 0 && (
                    <div>
                      <span style={{ color: "#64748B", fontSize: 12, display: "block", marginBottom: 8 }}>
                        🔗 Tespit Edilen URL'ler
                      </span>
                      {analysisResult.email.urls.map((url, i) => (
                        <div
                          key={i}
                          style={{
                            background: "#1E293B",
                            padding: "8px 12px",
                            borderRadius: 6,
                            marginBottom: 6,
                            fontSize: 13,
                            color: "#F59E0B",
                            fontFamily: "monospace",
                          }}
                        >
                          {url}
                        </div>
                      ))}
                    </div>
                  )}
                  {analysisResult.email.attachments.length > 0 && (
                    <div>
                      <span style={{ color: "#64748B", fontSize: 12, display: "block", marginBottom: 8 }}>
                        📎 Ek Dosyalar
                      </span>
                      {analysisResult.email.attachments.map((file, i) => (
                        <span
                          key={i}
                          style={{
                            background: "#EF444420",
                            color: "#EF4444",
                            padding: "4px 10px",
                            borderRadius: 4,
                            fontSize: 12,
                            marginRight: 8,
                          }}
                        >
                          ⚠️ {file}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Scene 2: AI Analysis */}
          {activeScene === 2 && analysisResult && !isAnalyzing && (
            <div style={{ animation: "slideIn 0.3s ease" }}>
              <h3 style={{ margin: "0 0 20px", color: "#F1F5F9", fontSize: 18, fontWeight: 600 }}>
                🤖 AI Analiz Sonucu
              </h3>
              <div
                style={{
                  background: "linear-gradient(135deg, #1E293B, #0F172A)",
                  borderRadius: 12,
                  border: "1px solid #334155",
                  padding: 24,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: `conic-gradient(${getRiskColor(analysisResult.aiScore)} ${analysisResult.aiScore * 3.6}deg, #1E293B 0deg)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "#0F172A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <span style={{ fontSize: 22, fontWeight: 700, color: getRiskColor(analysisResult.aiScore) }}>
                        %{analysisResult.aiScore}
                      </span>
                      <span style={{ fontSize: 10, color: "#64748B" }}>AI Risk</span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 8px", color: "#F1F5F9", fontSize: 16 }}>Yapay Zeka Değerlendirmesi</h4>
                    <p style={{ margin: 0, color: "#94A3B8", fontSize: 14, lineHeight: 1.7 }}>
                      {analysisResult.aiDetails}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    background: "#0B112080",
                    padding: 16,
                    borderRadius: 8,
                    borderLeft: `3px solid ${getRiskColor(analysisResult.aiScore)}`,
                  }}
                >
                  <p style={{ margin: 0, color: "#94A3B8", fontSize: 13 }}>
                    <strong style={{ color: "#F1F5F9" }}>Analiz Zamanı:</strong> {analysisResult.timestamp}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Scene 3: Risk Scores */}
          {activeScene === 3 && analysisResult && !isAnalyzing && (
            <div style={{ animation: "slideIn 0.3s ease" }}>
              <h3 style={{ margin: "0 0 20px", color: "#F1F5F9", fontSize: 18, fontWeight: 600 }}>
                📊 Detaylı Risk Skorlaması
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div
                  style={{
                    background: "#0F172A",
                    borderRadius: 12,
                    border: "1px solid #334155",
                    padding: 20,
                  }}
                >
                  <h4 style={{ margin: "0 0 20px", color: "#F1F5F9", fontSize: 14, fontWeight: 600 }}>
                    Metrik Bazlı Analiz
                  </h4>
                  <RiskBar
                    label="🔗 URL Risk Skoru"
                    value={analysisResult.riskScores.url}
                    color={getRiskColor(analysisResult.riskScores.url)}
                  />
                  <RiskBar
                    label="👤 Gönderen Risk Skoru"
                    value={analysisResult.riskScores.sender}
                    color={getRiskColor(analysisResult.riskScores.sender)}
                  />
                  <RiskBar
                    label="📎 Ek Dosya Risk Skoru"
                    value={analysisResult.riskScores.attachment}
                    color={getRiskColor(analysisResult.riskScores.attachment)}
                  />
                  <RiskBar
                    label="📝 İçerik Risk Skoru"
                    value={analysisResult.riskScores.content}
                    color={getRiskColor(analysisResult.riskScores.content)}
                  />
                </div>

                <div
                  style={{
                    background: "#0F172A",
                    borderRadius: 12,
                    border: "1px solid #334155",
                    padding: 20,
                  }}
                >
                  <h4 style={{ margin: "0 0 20px", color: "#F1F5F9", fontSize: 14, fontWeight: 600 }}>
                    Teknik Analiz Detayları
                  </h4>
                  <div style={{ display: "grid", gap: 12 }}>
                    {[
                      { label: "SPF Kontrolü", status: analysisResult.riskScores.sender > 50 ? "Başarısız" : "Geçti" },
                      { label: "DKIM İmzası", status: analysisResult.riskScores.sender > 70 ? "Geçersiz" : "Geçerli" },
                      { label: "DMARC Politikası", status: analysisResult.riskScores.sender > 60 ? "Yok" : "Aktif" },
                      { label: "Domain Yaşı", status: analysisResult.riskScores.sender > 80 ? "< 30 gün" : "> 1 yıl" },
                      {
                        label: "URL Kısaltma",
                        status: analysisResult.riskScores.url > 70 ? "Tespit Edildi" : "Yok",
                      },
                      {
                        label: "Zararlı Hash",
                        status: analysisResult.riskScores.attachment > 80 ? "Eşleşme Var" : "Temiz",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 14px",
                          background: "#1E293B",
                          borderRadius: 8,
                        }}
                      >
                        <span style={{ color: "#94A3B8", fontSize: 13 }}>{item.label}</span>
                        <span
                          style={{
                            color: item.status.includes("Başarısız") || item.status.includes("Yok") || item.status.includes("Geçersiz") || item.status.includes("Tespit") || item.status.includes("Eşleşme") || item.status.includes("< 30")
                              ? "#EF4444"
                              : "#10B981",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scene 4: Final Verdict */}
          {activeScene === 4 && analysisResult && !isAnalyzing && (
            <div style={{ animation: "slideIn 0.3s ease" }}>
              <h3 style={{ margin: "0 0 20px", color: "#F1F5F9", fontSize: 18, fontWeight: 600 }}>
                ⚖️ Nihai Sonuç
              </h3>

              <div
                style={{
                  background: `linear-gradient(135deg, ${getVerdictColor(analysisResult.verdict)}15, ${getVerdictColor(analysisResult.verdict)}05)`,
                  borderRadius: 16,
                  border: `2px solid ${getVerdictColor(analysisResult.verdict)}40`,
                  padding: 32,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    margin: "0 auto 24px",
                    borderRadius: "50%",
                    background: `conic-gradient(${getVerdictColor(analysisResult.verdict)} ${analysisResult.totalRisk * 3.6}deg, #1E293B 0deg)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 95,
                      height: 95,
                      borderRadius: "50%",
                      background: "#0F172A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: getVerdictColor(analysisResult.verdict),
                      }}
                    >
                      %{analysisResult.totalRisk}
                    </span>
                    <span style={{ fontSize: 11, color: "#64748B" }}>TOPLAM RİSK</span>
                  </div>
                </div>

                <div
                  style={{
                    display: "inline-block",
                    background: `${getVerdictColor(analysisResult.verdict)}20`,
                    border: `1px solid ${getVerdictColor(analysisResult.verdict)}60`,
                    borderRadius: 30,
                    padding: "12px 32px",
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: getVerdictColor(analysisResult.verdict),
                      letterSpacing: 2,
                    }}
                  >
                    {analysisResult.verdictText}
                  </span>
                </div>

                <p style={{ color: "#94A3B8", maxWidth: 500, margin: "0 auto", fontSize: 14, lineHeight: 1.7 }}>
                  {analysisResult.verdict === "malicious" &&
                    "Bu e-posta yüksek güvenlik riski taşımaktadır. Otomatik olarak engellenmiştir. Bağlantılara tıklamayın ve ekleri açmayın."}
                  {analysisResult.verdict === "suspicious" &&
                    "Bu e-posta şüpheli özellikler içermektedir. Karantinaya alınmıştır. Manuel inceleme yapılması önerilir."}
                  {analysisResult.verdict === "safe" &&
                    "E-posta tüm güvenlik kontrollerinden geçmiştir. Güvenli olarak işaretlenmiştir."}
                </p>
              </div>

              {/* Action Legend */}
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "center",
                  gap: 24,
                }}
              >
                {[
                  { color: "#10B981", label: "SUCCESS", desc: "Güvenli" },
                  { color: "#F59E0B", label: "WARNING", desc: "Şüpheli" },
                  { color: "#EF4444", label: "DANGER", desc: "Engellendi" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      opacity: analysisResult.verdictText.includes(item.label) ? 1 : 0.4,
                    }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: item.color,
                      }}
                    />
                    <span style={{ color: "#94A3B8", fontSize: 12 }}>
                      {item.label} ({item.desc})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
