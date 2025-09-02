"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import InvoicePreview from "@/components/invoice-preview"
import { SearchableSelect } from "@/components/ui/searchable-select"
import type { InvoiceData, LineItem } from "@/types/invoice"
import { Plus, X } from "lucide-react"

// Currency options - All world currencies
const currencies = [
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "AFN", symbol: "؋", name: "Afghan Afghani" },
  { code: "ALL", symbol: "L", name: "Albanian Lek" },
  { code: "AMD", symbol: "֏", name: "Armenian Dram" },
  { code: "ANG", symbol: "ƒ", name: "Netherlands Antillean Guilder" },
  { code: "AOA", symbol: "Kz", name: "Angolan Kwanza" },
  { code: "ARS", symbol: "$", name: "Argentine Peso" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "AWG", symbol: "ƒ", name: "Aruban Florin" },
  { code: "AZN", symbol: "₼", name: "Azerbaijani Manat" },
  { code: "BAM", symbol: "KM", name: "Bosnia-Herzegovina Convertible Mark" },
  { code: "BBD", symbol: "$", name: "Barbadian Dollar" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "BGN", symbol: "лв", name: "Bulgarian Lev" },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar" },
  { code: "BIF", symbol: "FBu", name: "Burundian Franc" },
  { code: "BMD", symbol: "$", name: "Bermudan Dollar" },
  { code: "BND", symbol: "$", name: "Brunei Dollar" },
  { code: "BOB", symbol: "$b", name: "Bolivian Boliviano" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "BSD", symbol: "$", name: "Bahamian Dollar" },
  { code: "BTN", symbol: "Nu.", name: "Bhutanese Ngultrum" },
  { code: "BWP", symbol: "P", name: "Botswanan Pula" },
  { code: "BYN", symbol: "Br", name: "Belarusian Ruble" },
  { code: "BZD", symbol: "BZ$", name: "Belize Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CDF", symbol: "FC", name: "Congolese Franc" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CLP", symbol: "$", name: "Chilean Peso" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "COP", symbol: "$", name: "Colombian Peso" },
  { code: "CRC", symbol: "₡", name: "Costa Rican Colón" },
  { code: "CUC", symbol: "$", name: "Cuban Convertible Peso" },
  { code: "CUP", symbol: "₱", name: "Cuban Peso" },
  { code: "CVE", symbol: "$", name: "Cape Verdean Escudo" },
  { code: "CZK", symbol: "Kč", name: "Czech Republic Koruna" },
  { code: "DJF", symbol: "Fdj", name: "Djiboutian Franc" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "DOP", symbol: "RD$", name: "Dominican Peso" },
  { code: "DZD", symbol: "دج", name: "Algerian Dinar" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound" },
  { code: "ERN", symbol: "Nfk", name: "Eritrean Nakfa" },
  { code: "ETB", symbol: "Br", name: "Ethiopian Birr" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "FJD", symbol: "$", name: "Fijian Dollar" },
  { code: "FKP", symbol: "£", name: "Falkland Islands Pound" },
  { code: "GBP", symbol: "£", name: "British Pound Sterling" },
  { code: "GEL", symbol: "₾", name: "Georgian Lari" },
  { code: "GGP", symbol: "£", name: "Guernsey Pound" },
  { code: "GHS", symbol: "¢", name: "Ghanaian Cedi" },
  { code: "GIP", symbol: "£", name: "Gibraltar Pound" },
  { code: "GMD", symbol: "D", name: "Gambian Dalasi" },
  { code: "GNF", symbol: "FG", name: "Guinean Franc" },
  { code: "GTQ", symbol: "Q", name: "Guatemalan Quetzal" },
  { code: "GYD", symbol: "$", name: "Guyanaese Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "HNL", symbol: "L", name: "Honduran Lempira" },
  { code: "HRK", symbol: "kn", name: "Croatian Kuna" },
  { code: "HTG", symbol: "G", name: "Haitian Gourde" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "ILS", symbol: "₪", name: "Israeli New Sheqel" },
  { code: "IMP", symbol: "£", name: "Manx pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "IQD", symbol: "ع.د", name: "Iraqi Dinar" },
  { code: "IRR", symbol: "﷼", name: "Iranian Rial" },
  { code: "ISK", symbol: "kr", name: "Icelandic Króna" },
  { code: "JEP", symbol: "£", name: "Jersey Pound" },
  { code: "JMD", symbol: "J$", name: "Jamaican Dollar" },
  { code: "JOD", symbol: "JD", name: "Jordanian Dinar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "KGS", symbol: "лв", name: "Kyrgystani Som" },
  { code: "KHR", symbol: "៛", name: "Cambodian Riel" },
  { code: "KMF", symbol: "CF", name: "Comorian Franc" },
  { code: "KPW", symbol: "₩", name: "North Korean Won" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "KWD", symbol: "KD", name: "Kuwaiti Dinar" },
  { code: "KYD", symbol: "$", name: "Cayman Islands Dollar" },
  { code: "KZT", symbol: "лв", name: "Kazakhstani Tenge" },
  { code: "LAK", symbol: "₭", name: "Laotian Kip" },
  { code: "LBP", symbol: "£", name: "Lebanese Pound" },
  { code: "LKR", symbol: "₨", name: "Sri Lankan Rupee" },
  { code: "LRD", symbol: "$", name: "Liberian Dollar" },
  { code: "LSL", symbol: "M", name: "Lesotho Loti" },
  { code: "LYD", symbol: "LD", name: "Libyan Dinar" },
  { code: "MAD", symbol: "MAD", name: "Moroccan Dirham" },
  { code: "MDL", symbol: "lei", name: "Moldovan Leu" },
  { code: "MGA", symbol: "Ar", name: "Malagasy Ariary" },
  { code: "MKD", symbol: "ден", name: "Macedonian Denar" },
  { code: "MMK", symbol: "K", name: "Myanma Kyat" },
  { code: "MNT", symbol: "₮", name: "Mongolian Tugrik" },
  { code: "MOP", symbol: "MOP$", name: "Macanese Pataca" },
  { code: "MRU", symbol: "UM", name: "Mauritanian Ouguiya" },
  { code: "MUR", symbol: "₨", name: "Mauritian Rupee" },
  { code: "MVR", symbol: "Rf", name: "Maldivian Rufiyaa" },
  { code: "MWK", symbol: "MK", name: "Malawian Kwacha" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "MZN", symbol: "MT", name: "Mozambican Metical" },
  { code: "NAD", symbol: "$", name: "Namibian Dollar" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "NIO", symbol: "C$", name: "Nicaraguan Córdoba" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "NPR", symbol: "₨", name: "Nepalese Rupee" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "OMR", symbol: "﷼", name: "Omani Rial" },
  { code: "PAB", symbol: "B/.", name: "Panamanian Balboa" },
  { code: "PEN", symbol: "S/.", name: "Peruvian Nuevo Sol" },
  { code: "PGK", symbol: "K", name: "Papua New Guinean Kina" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "PYG", symbol: "Gs", name: "Paraguayan Guarani" },
  { code: "QAR", symbol: "﷼", name: "Qatari Rial" },
  { code: "RON", symbol: "lei", name: "Romanian Leu" },
  { code: "RSD", symbol: "Дин.", name: "Serbian Dinar" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "RWF", symbol: "R₣", name: "Rwandan Franc" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "SBD", symbol: "$", name: "Solomon Islands Dollar" },
  { code: "SCR", symbol: "₨", name: "Seychellois Rupee" },
  { code: "SDG", symbol: "ج.س.", name: "Sudanese Pound" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "SHP", symbol: "£", name: "Saint Helena Pound" },
  { code: "SLE", symbol: "Le", name: "Sierra Leonean Leone" },
  { code: "SLL", symbol: "Le", name: "Sierra Leonean Leone (Old)" },
  { code: "SOS", symbol: "S", name: "Somali Shilling" },
  { code: "SRD", symbol: "$", name: "Surinamese Dollar" },
  { code: "SSP", symbol: "£", name: "South Sudanese Pound" },
  { code: "STD", symbol: "Db", name: "São Tomé and Príncipe Dobra (Old)" },
  { code: "STN", symbol: "Db", name: "São Tomé and Príncipe Dobra" },
  { code: "SVC", symbol: "$", name: "Salvadoran Colón" },
  { code: "SYP", symbol: "£", name: "Syrian Pound" },
  { code: "SZL", symbol: "E", name: "Swazi Lilangeni" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "TJS", symbol: "SM", name: "Tajikistani Somoni" },
  { code: "TMT", symbol: "T", name: "Turkmenistani Manat" },
  { code: "TND", symbol: "د.ت", name: "Tunisian Dinar" },
  { code: "TOP", symbol: "T$", name: "Tongan Pa'anga" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "TTD", symbol: "TT$", name: "Trinidad and Tobago Dollar" },
  { code: "TVD", symbol: "$", name: "Tuvaluan Dollar" },
  { code: "TWD", symbol: "NT$", name: "New Taiwan Dollar" },
  { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "UYU", symbol: "$U", name: "Uruguayan Peso" },
  { code: "UYW", symbol: "UYW", name: "Uruguayan Nominal Wage Index Unit" },
  { code: "UZS", symbol: "лв", name: "Uzbekistan Som" },
  { code: "VED", symbol: "Bs.D", name: "Venezuelan Bolívar Digital" },
  { code: "VES", symbol: "Bs.S", name: "Venezuelan Bolívar Soberano" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "VUV", symbol: "VT", name: "Vanuatu Vatu" },
  { code: "WST", symbol: "WS$", name: "Samoan Tala" },
  { code: "XAF", symbol: "FCFA", name: "CFA Franc BEAC" },
  { code: "XCD", symbol: "$", name: "East Caribbean Dollar" },
  { code: "XDR", symbol: "SDR", name: "Special Drawing Rights" },
  { code: "XOF", symbol: "CFA", name: "CFA Franc BCEAO" },
  { code: "XPF", symbol: "₣", name: "CFP Franc" },
  { code: "YER", symbol: "﷼", name: "Yemeni Rial" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "ZMW", symbol: "ZK", name: "Zambian Kwacha" },
  { code: "ZWL", symbol: "Z$", name: "Zimbabwean Dollar" },
]

// Default template for a new document
const getDefaultTemplate = (docType: "invoice" | "delivery-challan" | "quotation"): InvoiceData => ({
  documentType: docType,
  invoiceNumber: "",
  recipient: "",
  subject: "",
  address: "",
  date: new Date().toISOString().split("T")[0],
  lineItems: [{ id: 1, product: "", description: "As per Sample", quantity: 0, rate: 0, amount: 0 }],
  subtotal: 0,
  deliveryCost: 0,
  discount: 0,
  total: 0,
  showTotals: true,
  advance: 0,
  currency: "USD",
  companyInfo: {
    name: "EDISON INNOVATIONS",
    email: "contact@edisoninnovations.com",
    phoneNumbers: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
  },
  signatureInfo: {
    includeSignature: true,
    name: "Thomas Edison",
    designation: "Chief Executive Officer",
  },
})

export default function InvoiceGenerator() {
  const [currentDocType, setCurrentDocType] = useState<"invoice" | "delivery-challan" | "quotation">("invoice")
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(getDefaultTemplate("invoice"))
  const [isLoadedFromDraft, setIsLoadedFromDraft] = useState(false)
  const [drafts, setDrafts] = useState<{ [key: string]: InvoiceData[] }>({
    invoice: [],
    "delivery-challan": [],
    quotation: [],
  })
  const invoiceRef = useRef<HTMLDivElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Load drafts from local storage on component mount
  useEffect(() => {
    const storedDrafts = localStorage.getItem("invoiceDrafts")
    if (storedDrafts) {
      try {
        const parsedDrafts = JSON.parse(storedDrafts)
        setDrafts(parsedDrafts)
      } catch (error) {
        console.error("Error parsing drafts from local storage:", error)
      }
    }
  }, [])

  // Handle document type change
  const handleDocTypeChange = (value: string) => {
    const newDocType = value as "invoice" | "delivery-challan" | "quotation"

    // Reset form to default values for the new document type
    setInvoiceData(getDefaultTemplate(newDocType))
    setCurrentDocType(newDocType)
    setIsLoadedFromDraft(false)
  }

  // Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const logoDataUrl = e.target?.result as string
        setInvoiceData({
          ...invoiceData,
          companyInfo: {
            ...invoiceData.companyInfo,
            logo: logoDataUrl,
          },
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Add phone number field
  const addPhoneNumber = () => {
    setInvoiceData({
      ...invoiceData,
      companyInfo: {
        ...invoiceData.companyInfo,
        phoneNumbers: [...invoiceData.companyInfo.phoneNumbers, ""],
      },
    })
  }

  // Remove phone number field
  const removePhoneNumber = (index: number) => {
    const updatedPhoneNumbers = invoiceData.companyInfo.phoneNumbers.filter((_, i) => i !== index)
    setInvoiceData({
      ...invoiceData,
      companyInfo: {
        ...invoiceData.companyInfo,
        phoneNumbers: updatedPhoneNumbers,
      },
    })
  }

  // Update phone number
  const updatePhoneNumber = (index: number, value: string) => {
    const updatedPhoneNumbers = [...invoiceData.companyInfo.phoneNumbers]
    updatedPhoneNumbers[index] = value
    setInvoiceData({
      ...invoiceData,
      companyInfo: {
        ...invoiceData.companyInfo,
        phoneNumbers: updatedPhoneNumbers,
      },
    })
  }

  // Get currency symbol
  const getCurrencySymbol = () => {
    const currency = currencies.find((c) => c.code === invoiceData.currency)
    return currency?.symbol || "$"
  }

  const handlePrint = () => {
    if (invoiceRef.current) {
      // Open print dialog
      window.print()
    }
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updatedItems = [...invoiceData.lineItems]

    if (field === "quantity" || field === "rate") {
      const numValue = typeof value === "string" ? Number.parseFloat(value) || 0 : value
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: numValue,
        amount: field === "quantity" ? numValue * updatedItems[index].rate : updatedItems[index].quantity * numValue,
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      }
    }

    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    const total = subtotal + invoiceData.deliveryCost - invoiceData.discount

    setInvoiceData({
      ...invoiceData,
      lineItems: updatedItems,
      subtotal,
      total,
    })
  }

  const updateDeliveryCost = (value: string) => {
    const deliveryCost = Number.parseFloat(value) || 0
    const total = invoiceData.subtotal + deliveryCost - invoiceData.discount

    setInvoiceData({
      ...invoiceData,
      deliveryCost,
      total,
    })
  }

  const updateDiscount = (value: string) => {
    const discount = Number.parseFloat(value) || 0
    const total = invoiceData.subtotal + invoiceData.deliveryCost - discount

    setInvoiceData({
      ...invoiceData,
      discount,
      total,
    })
  }

  const updateAdvance = (value: string) => {
    const advance = Number.parseFloat(value) || 0

    setInvoiceData({
      ...invoiceData,
      advance,
    })
  }

  const addLineItem = () => {
    const newId = Math.max(0, ...invoiceData.lineItems.map((item) => item.id)) + 1
    setInvoiceData({
      ...invoiceData,
      lineItems: [
        ...invoiceData.lineItems,
        { id: newId, product: "", description: "As per Sample", quantity: 0, rate: 0, amount: 0 },
      ],
    })
  }

  const removeLineItem = (id: number) => {
    const updatedItems = invoiceData.lineItems.filter((item) => item.id !== id)
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    const total = subtotal + invoiceData.deliveryCost - invoiceData.discount

    setInvoiceData({
      ...invoiceData,
      lineItems: updatedItems,
      subtotal,
      total,
    })
  }

  // Get the appropriate document number label based on document type
  const getDocumentNumberLabel = () => {
    switch (currentDocType) {
      case "invoice":
        return "Invoice #"
      case "delivery-challan":
        return "Challan #"
      case "quotation":
        return "Quotation #"
      default:
        return "Document #"
    }
  }

  // Save current invoice data as draft to local storage
  const saveAsDraft = () => {
    const updatedDrafts = { ...drafts }

    // Add current invoice data to the appropriate array
    updatedDrafts[currentDocType] = [
      ...(updatedDrafts[currentDocType] || []),
      { ...invoiceData, savedAt: new Date().toISOString() },
    ]

    // Save to local storage
    localStorage.setItem("invoiceDrafts", JSON.stringify(updatedDrafts))
    setDrafts(updatedDrafts)
    setIsLoadedFromDraft(true)

    alert(`Saved as ${currentDocType} draft!`)
  }

  // Load the most recent draft of the current document type
  const loadDraft = () => {
    if (drafts[currentDocType] && drafts[currentDocType].length > 0) {
      // Get the most recent draft
      const mostRecentDraft = drafts[currentDocType][drafts[currentDocType].length - 1]
      setInvoiceData(mostRecentDraft)
      setIsLoadedFromDraft(true)
    } else {
      alert(`No ${currentDocType} drafts found.`)
    }
  }

  // Reset form to default state for current document type
  const resetData = () => {
    setInvoiceData(getDefaultTemplate(currentDocType))
    setIsLoadedFromDraft(false)
  }

  // Check if there are drafts available for the current document type
  const hasDrafts = drafts[currentDocType]?.length > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:!grid-cols-1 print:gap-0">
      <Card className="print:hidden">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6">Document Details</h2>

          {/* Company Header Section */}
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Company Information</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={invoiceData.companyInfo.name}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      companyInfo: { ...invoiceData.companyInfo, name: e.target.value },
                    })
                  }
                  placeholder="Company Name"
                />
              </div>

              <div>
                <Label htmlFor="company-logo">Company Logo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="company-logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    ref={logoInputRef}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" onClick={() => logoInputRef.current?.click()}>
                    Upload Logo
                  </Button>
                  {invoiceData.companyInfo.logo && <span className="text-sm text-green-600">Logo uploaded</span>}
                </div>
              </div>

              <div>
                <Label htmlFor="company-email">Company Email</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={invoiceData.companyInfo.email}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      companyInfo: { ...invoiceData.companyInfo, email: e.target.value },
                    })
                  }
                  placeholder="company@example.com"
                />
              </div>

              <div>
                <Label>Phone Numbers</Label>
                {invoiceData.companyInfo.phoneNumbers.map((phone, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <Input
                      value={phone}
                      onChange={(e) => updatePhoneNumber(index, e.target.value)}
                      placeholder="Phone number"
                    />
                    {invoiceData.companyInfo.phoneNumbers.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removePhoneNumber(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPhoneNumber}
                  className="mt-2 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Phone Number
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="document-type">Document Type</Label>
                <Select value={currentDocType} onValueChange={handleDocTypeChange}>
                  <SelectTrigger id="document-type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="delivery-challan">Delivery Challan</SelectItem>
                    <SelectItem value="quotation">Quotation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="invoice-number">Document Number</Label>
                <Input
                  id="invoice-number"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                  placeholder={getDocumentNumberLabel()}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <SearchableSelect
                options={currencies.map((currency) => ({
                  value: currency.code,
                  label: `${currency.symbol} - ${currency.name} (${currency.code})`,
                  searchText: `${currency.name} ${currency.code} ${currency.symbol}`,
                }))}
                value={invoiceData.currency}
                onValueChange={(value) => setInvoiceData({ ...invoiceData, currency: value })}
                placeholder="Select currency..."
                searchPlaceholder="Search currencies..."
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={invoiceData.recipient}
                onChange={(e) => setInvoiceData({ ...invoiceData, recipient: e.target.value })}
                placeholder="Microsoft Corporation"
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={invoiceData.subject}
                onChange={(e) => setInvoiceData({ ...invoiceData, subject: e.target.value })}
                placeholder="Software Development Services"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={invoiceData.address}
                onChange={(e) => setInvoiceData({ ...invoiceData, address: e.target.value })}
                placeholder="Recipient's address"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={invoiceData.date}
                onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
              />
            </div>

            {/* Show totals toggle for quotations */}
            {currentDocType === "quotation" && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-totals"
                  checked={invoiceData.showTotals}
                  onCheckedChange={(checked) => setInvoiceData({ ...invoiceData, showTotals: checked })}
                />
                <Label htmlFor="show-totals">Show subtotal and total amounts</Label>
              </div>
            )}

            {/* Advance payment field for invoices */}
            {currentDocType === "invoice" && (
              <div>
                <Label htmlFor="advance">Advance Payment</Label>
                <Input
                  id="advance"
                  type="number"
                  value={invoiceData.advance || ""}
                  onChange={(e) => updateAdvance(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          {/* Signature Section */}
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="include-signature"
                checked={invoiceData.signatureInfo.includeSignature}
                onCheckedChange={(checked) =>
                  setInvoiceData({
                    ...invoiceData,
                    signatureInfo: { ...invoiceData.signatureInfo, includeSignature: !!checked },
                  })
                }
              />
              <Label htmlFor="include-signature">Include Signature</Label>
            </div>

            {invoiceData.signatureInfo.includeSignature && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="signature-name">Name</Label>
                  <Input
                    id="signature-name"
                    value={invoiceData.signatureInfo.name}
                    onChange={(e) =>
                      setInvoiceData({
                        ...invoiceData,
                        signatureInfo: { ...invoiceData.signatureInfo, name: e.target.value },
                      })
                    }
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <Label htmlFor="signature-designation">Designation</Label>
                  <Input
                    id="signature-designation"
                    value={invoiceData.signatureInfo.designation}
                    onChange={(e) =>
                      setInvoiceData({
                        ...invoiceData,
                        signatureInfo: { ...invoiceData.signatureInfo, designation: e.target.value },
                      })
                    }
                    placeholder="Job Title"
                  />
                </div>
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold mb-4">
            Line Items{" "}
            <span className="text-sm font-normal text-gray-500">(For best results, limit to 5 items per page)</span>
          </h3>

          {invoiceData.lineItems.map((item, index) => (
            <div key={item.id} className="mb-6 border-b pb-4">
              {/* First row: Product and Description */}
              <div className="grid grid-cols-12 gap-2 mb-3">
                <div className="col-span-12 sm:col-span-5">
                  <Label htmlFor={`product-${item.id}`}>Product</Label>
                  <Input
                    id={`product-${item.id}`}
                    value={item.product}
                    onChange={(e) => updateLineItem(index, "product", e.target.value)}
                    placeholder="Product name"
                  />
                </div>
                <div className="col-span-12 sm:col-span-7">
                  <Label htmlFor={`description-${item.id}`}>Description</Label>
                  <Textarea
                    id={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) => updateLineItem(index, "description", e.target.value)}
                    placeholder="Product description"
                    rows={2}
                  />
                </div>
              </div>

              {/* Second row: Quantity, Rate, Amount, and Remove button */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4 sm:col-span-3">
                  <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    value={item.quantity || ""}
                    onChange={(e) => updateLineItem(index, "quantity", e.target.value)}
                    placeholder="0"
                  />
                </div>

                {currentDocType !== "delivery-challan" && (
                  <>
                    <div className="col-span-4 sm:col-span-3">
                      <Label htmlFor={`rate-${item.id}`}>Rate</Label>
                      <Input
                        id={`rate-${item.id}`}
                        type="number"
                        value={item.rate || ""}
                        onChange={(e) => updateLineItem(index, "rate", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-3">
                      <Label>Amount</Label>
                      <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
                        {getCurrencySymbol()}
                        {item.amount.toFixed(2)}
                      </div>
                    </div>
                  </>
                )}

                <div
                  className={`col-span-12 sm:col-span-${currentDocType === "delivery-challan" ? "6" : "3"} flex items-end justify-end`}
                >
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => removeLineItem(item.id)}
                    disabled={invoiceData.lineItems.length <= 1}
                  >
                    ×
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {currentDocType !== "delivery-challan" && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="delivery-cost">Delivery Cost</Label>
                <Input
                  id="delivery-cost"
                  type="number"
                  value={invoiceData.deliveryCost || ""}
                  onChange={(e) => updateDeliveryCost(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount</Label>
                <Input
                  id="discount"
                  type="number"
                  value={invoiceData.discount || ""}
                  onChange={(e) => updateDiscount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {/* Draft management buttons */}
          <div className="flex flex-wrap gap-2 justify-between mt-6">
            <div className="flex flex-wrap gap-2">
              <Button onClick={addLineItem}>Add Item</Button>
              <Button variant="outline" onClick={saveAsDraft}>
                Save as Draft
              </Button>
              {hasDrafts && (
                <Button variant="outline" onClick={loadDraft}>
                  Load Draft
                </Button>
              )}
              {isLoadedFromDraft && (
                <Button variant="destructive" onClick={resetData}>
                  Reset Data
                </Button>
              )}
            </div>
            <Button onClick={handlePrint}>
              Generate{" "}
              {currentDocType === "invoice"
                ? "Invoice"
                : currentDocType === "delivery-challan"
                  ? "Challan"
                  : "Quotation"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="hidden lg:block print:block">
        <div ref={invoiceRef}>
          <InvoicePreview data={invoiceData} />
        </div>
      </div>
    </div>
  )
}
