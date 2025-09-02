export interface LineItem {
  id: number
  product: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface CompanyInfo {
  name: string
  logo?: string
  email: string
  phoneNumbers: string[]
}

export interface SignatureInfo {
  includeSignature: boolean
  name: string
  designation: string
}

export interface InvoiceData {
  documentType: "invoice" | "delivery-challan" | "quotation"
  invoiceNumber: string
  recipient: string
  subject: string
  address: string
  date: string
  lineItems: LineItem[]
  subtotal: number
  deliveryCost: number
  discount: number
  total: number
  showTotals: boolean
  advance: number
  currency: string
  companyInfo: CompanyInfo
  signatureInfo: SignatureInfo
}
