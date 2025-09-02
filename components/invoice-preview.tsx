"use client"

import type { InvoiceData } from "@/types/invoice"
import { formatDate } from "@/lib/utils"
import Image from "next/image"

interface InvoicePreviewProps {
  data: InvoiceData
}

// Currency symbols mapping - comprehensive list
const currencySymbols: { [key: string]: string } = {
  AED: "د.إ",
  AFN: "؋",
  ALL: "L",
  AMD: "֏",
  ANG: "ƒ",
  AOA: "Kz",
  ARS: "$",
  AUD: "A$",
  AWG: "ƒ",
  AZN: "₼",
  BAM: "KM",
  BBD: "$",
  BDT: "৳",
  BGN: "лв",
  BHD: ".د.ب",
  BIF: "FBu",
  BMD: "$",
  BND: "$",
  BOB: "$b",
  BRL: "R$",
  BSD: "$",
  BTN: "Nu.",
  BWP: "P",
  BYN: "Br",
  BZD: "BZ$",
  CAD: "C$",
  CDF: "FC",
  CHF: "CHF",
  CLP: "$",
  CNY: "¥",
  COP: "$",
  CRC: "₡",
  CUC: "$",
  CUP: "₱",
  CVE: "$",
  CZK: "Kč",
  DJF: "Fdj",
  DKK: "kr",
  DOP: "RD$",
  DZD: "دج",
  EGP: "£",
  ERN: "Nfk",
  ETB: "Br",
  EUR: "€",
  FJD: "$",
  FKP: "£",
  GBP: "£",
  GEL: "₾",
  GGP: "£",
  GHS: "¢",
  GIP: "£",
  GMD: "D",
  GNF: "FG",
  GTQ: "Q",
  GYD: "$",
  HKD: "HK$",
  HNL: "L",
  HRK: "kn",
  HTG: "G",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  IMP: "£",
  INR: "₹",
  IQD: "ع.د",
  IRR: "﷼",
  ISK: "kr",
  JEP: "£",
  JMD: "J$",
  JOD: "JD",
  JPY: "¥",
  KES: "KSh",
  KGS: "лв",
  KHR: "៛",
  KMF: "CF",
  KPW: "₩",
  KRW: "₩",
  KWD: "KD",
  KYD: "$",
  KZT: "лв",
  LAK: "₭",
  LBP: "£",
  LKR: "₨",
  LRD: "$",
  LSL: "M",
  LYD: "LD",
  MAD: "MAD",
  MDL: "lei",
  MGA: "Ar",
  MKD: "ден",
  MMK: "K",
  MNT: "₮",
  MOP: "MOP$",
  MRU: "UM",
  MUR: "₨",
  MVR: "Rf",
  MWK: "MK",
  MXN: "$",
  MYR: "RM",
  MZN: "MT",
  NAD: "$",
  NGN: "₦",
  NIO: "C$",
  NOK: "kr",
  NPR: "₨",
  NZD: "NZ$",
  OMR: "﷼",
  PAB: "B/.",
  PEN: "S/.",
  PGK: "K",
  PHP: "₱",
  PKR: "₨",
  PLN: "zł",
  PYG: "Gs",
  QAR: "﷼",
  RON: "lei",
  RSD: "Дин.",
  RUB: "₽",
  RWF: "R₣",
  SAR: "﷼",
  SBD: "$",
  SCR: "₨",
  SDG: "ج.س.",
  SEK: "kr",
  SGD: "S$",
  SHP: "£",
  SLE: "Le",
  SLL: "Le",
  SOS: "S",
  SRD: "$",
  SSP: "£",
  STD: "Db",
  STN: "Db",
  SVC: "$",
  SYP: "£",
  SZL: "E",
  THB: "฿",
  TJS: "SM",
  TMT: "T",
  TND: "د.ت",
  TOP: "T$",
  TRY: "₺",
  TTD: "TT$",
  TVD: "$",
  TWD: "NT$",
  TZS: "TSh",
  UAH: "₴",
  UGX: "USh",
  USD: "$",
  UYU: "$U",
  UYW: "UYW",
  UZS: "лв",
  VED: "Bs.D",
  VES: "Bs.S",
  VND: "₫",
  VUV: "VT",
  WST: "WS$",
  XAF: "FCFA",
  XCD: "$",
  XDR: "SDR",
  XOF: "CFA",
  XPF: "₣",
  YER: "﷼",
  ZAR: "R",
  ZMW: "ZK",
  ZWL: "Z$",
}

export default function InvoicePreview({ data }: InvoicePreviewProps) {
  // Format document type for display
  const getDocumentTypeDisplay = () => {
    switch (data.documentType) {
      case "invoice":
        return "INVOICE"
      case "delivery-challan":
        return "DELIVERY CHALLAN"
      case "quotation":
        return "QUOTATION"
      default:
        return "DOCUMENT"
    }
  }

  const documentTypeDisplay = getDocumentTypeDisplay()

  // Determine if totals should be shown
  const showTotals = data.documentType === "invoice" || (data.documentType === "quotation" && data.showTotals)

  // Determine if rate and amount columns should be shown
  const showRateAndAmount = data.documentType !== "delivery-challan"

  // Calculate due amount for invoices
  const dueAmount = data.documentType === "invoice" ? data.total - data.advance : 0

  // Determine if advance and due should be shown (only for invoices with advance > 0)
  const showAdvanceAndDue = data.documentType === "invoice" && data.advance > 0

  // Check if address should be displayed
  const showAddress = data.address && data.address.trim() !== ""

  // Get currency symbol
  const getCurrencySymbol = () => {
    return currencySymbols[data.currency] || "৳"
  }

  return (
    <div className="bg-white w-full max-w-[800px] mx-auto shadow-lg print:shadow-none print:w-full print:max-w-none print:mx-0 print:p-0 print:overflow-hidden relative">
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .invoice-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
          }
          .invoice-content {
            margin-bottom: 180px; /* Space for footer */
          }
        }
      `}</style>

      {/* HEADER SECTION */}
      <div className="relative h-[150px] w-full print:h-[100px]">
        {/* Logo and company name */}
        <div className="absolute top-8 left-8 flex items-center z-10">
          <div className="relative w-16 h-16 print:w-12 print:h-12 overflow-hidden">
            {data.companyInfo.logo ? (
              <img
                src={data.companyInfo.logo || "/placeholder.svg"}
                alt={`${data.companyInfo.name} Logo`}
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="ml-4">
            <h1 className="text-[#1e4e6c] text-3xl font-bold print:text-2xl leading-tight">
              {data.companyInfo.name.split(" ").map((word, index) => (
                <div key={index}>{word}</div>
              ))}
            </h1>
          </div>
        </div>

        {/* Orange triangle */}
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[150px] border-t-[#ff8c42] border-l-[150px] border-l-transparent z-0 print:border-t-[100px] print:border-l-[100px]"></div>

        {/* Blue triangle */}
        <div className="absolute top-0 right-0 w-0 h-0 border-b-[120px] border-b-[#1e4e6c] border-l-[120px] border-l-transparent z-0 print:border-b-[80px] print:border-l-[80px]"></div>
      </div>

      {/* CONTENT SECTION */}
      <div className="px-8 py-6 print:px-6 print:py-6 invoice-content">
        {/* Document Type and Number */}
        <div className="mb-8 print:mb-6">
          <h2 className="text-xl font-bold text-[#1e4e6c] uppercase">{documentTypeDisplay}</h2>
          {data.invoiceNumber && (
            <p className="text-gray-600 mt-1">
              {data.documentType === "invoice"
                ? "Invoice"
                : data.documentType === "delivery-challan"
                  ? "Challan"
                  : "Quotation"}{" "}
              #: {data.invoiceNumber}
            </p>
          )}
        </div>

        {/* Invoice details */}
        <div className="grid grid-cols-[120px_1fr] gap-y-4 mb-10 print:gap-y-3 print:mb-8">
          <div className="text-[#1e4e6c] font-medium">RECIPIENT</div>
          <div className="font-medium text-gray-800">{data.recipient || "Microsoft Corporation"}</div>

          <div className="text-[#1e4e6c] font-medium">SUBJECT</div>
          <div className="font-medium text-gray-800">{data.subject || "Software Development Services"}</div>

          {/* Only show address if it has content */}
          {showAddress && (
            <>
              <div className="text-[#1e4e6c] font-medium">ADDRESS</div>
              <div className="font-medium text-gray-800 whitespace-pre-line">{data.address}</div>
            </>
          )}

          <div className="text-[#1e4e6c] font-medium">DATE</div>
          <div className="font-medium text-gray-800">{formatDate(data.date) || "15 Mar, 2025"}</div>
        </div>

        {/* Table */}
        <div className="w-full">
          <div className="bg-[#1e4e6c] text-white grid grid-cols-12 py-2 px-2 text-sm">
            {showRateAndAmount ? (
              <>
                <div className="font-bold col-span-3">PRODUCT</div>
                <div className="font-bold col-span-4">DESCRIPTION</div>
                <div className="font-bold text-center col-span-2">QUANTITY</div>
                <div className="font-bold text-center col-span-1">RATE</div>
                <div className="font-bold text-right col-span-2">AMOUNT</div>
              </>
            ) : (
              <>
                <div className="font-bold col-span-5">PRODUCT</div>
                <div className="font-bold col-span-5">DESCRIPTION</div>
                <div className="font-bold text-center col-span-2">QUANTITY</div>
              </>
            )}
          </div>

          <div>
            {data.lineItems.length > 0 ? (
              data.lineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 py-3 px-2 border-b border-gray-200 print:text-xs print:py-2"
                >
                  {showRateAndAmount ? (
                    <>
                      <div className="col-span-3">{item.product || "Software License"}</div>
                      <div className="col-span-4">{item.description}</div>
                      <div className="text-center col-span-2">{item.quantity || 1}</div>
                      <div className="text-center col-span-1">
                        {getCurrencySymbol()}
                        {item.rate ? item.rate.toFixed(2) : "299.00"}
                      </div>
                      <div className="text-right col-span-2">
                        {getCurrencySymbol()}
                        {item.amount ? item.amount.toFixed(0) : "299"}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-5">{item.product || "Software License"}</div>
                      <div className="col-span-5">{item.description}</div>
                      <div className="text-center col-span-2">{item.quantity || 1}</div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="grid grid-cols-12 py-2 px-2 border-b border-gray-200">
                {showRateAndAmount ? (
                  <>
                    <div className="col-span-3">Software License</div>
                    <div className="col-span-4">Annual subscription</div>
                    <div className="text-center col-span-2">1</div>
                    <div className="text-center col-span-1">{getCurrencySymbol()}299.00</div>
                    <div className="text-right col-span-2">{getCurrencySymbol()}299</div>
                  </>
                ) : (
                  <>
                    <div className="col-span-5">Software License</div>
                    <div className="col-span-5">Annual subscription</div>
                    <div className="text-center col-span-2">1</div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Subtotal, Delivery, Discount, and Total - conditionally shown */}
          {showTotals && (
            <div className="flex flex-col items-end mt-6 border-t-2 border-[#1e4e6c] pt-4 pr-4">
              <div className="grid grid-cols-2 gap-x-12 text-right">
                <div className="text-[#1e4e6c] font-medium">Subtotal</div>
                <div className="font-medium">
                  {getCurrencySymbol()}
                  {data.subtotal ? data.subtotal.toFixed(0) : "0"}
                </div>

                {data.deliveryCost > 0 && (
                  <>
                    <div className="text-[#1e4e6c] font-medium">Delivery Cost</div>
                    <div className="font-medium">
                      {getCurrencySymbol()}
                      {data.deliveryCost.toFixed(0)}
                    </div>
                  </>
                )}

                {data.discount > 0 && (
                  <>
                    <div className="text-[#1e4e6c] font-medium">Discount</div>
                    <div className="font-medium text-red-600">
                      -{getCurrencySymbol()}
                      {data.discount.toFixed(0)}
                    </div>
                  </>
                )}

                <div className="text-[#1e4e6c] font-bold">Total</div>
                <div className="font-bold">
                  {getCurrencySymbol()}
                  {data.total ? data.total.toFixed(0) : "299"}
                </div>

                {/* Only show advance and due for invoices with advance > 0 */}
                {showAdvanceAndDue && (
                  <>
                    <div className="text-[#1e4e6c] font-medium">Advance</div>
                    <div className="font-medium">
                      -{getCurrencySymbol()}
                      {data.advance.toFixed(0)}
                    </div>

                    <div className="text-[#1e4e6c] font-bold">Due</div>
                    <div className="font-bold">
                      {getCurrencySymbol()}
                      {dueAmount.toFixed(0)}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Terms and conditions - only show for quotations */}
        {data.documentType === "quotation" && (
          <div className="mt-8 mb-6 print:mb-4">
            <h3 className="font-bold mb-1 print:text-xs">Terms & Conditions:</h3>
            <ul className="list-disc pl-4 space-y-0 print:text-xs text-sm">
              <li>A 50% advance payment is required. Remaining 50% due upon completion within 15 days of delivery.</li>
              <li>Valid for 15 days from issue date unless specified (*depends on raw materials price).</li>
              <li>Changes after confirmation may incur additional costs.</li>
              <li>Delivery dates agreed upon at order confirmation.</li>
              <li>Prices exclude Vat & Taxes. A carrying charge will be added.</li>
            </ul>
          </div>
        )}
      </div>

      {/* FOOTER SECTION - Fixed at bottom */}
      <div className="relative mt-auto invoice-footer bg-white pt-4">
        {/* Signature Section */}
        <div
          className={`flex ${data.documentType === "delivery-challan" ? "justify-between" : "justify-end"} px-8 print:px-4 mb-4`}
        >
          {/* Recipient Signature - Only for Delivery Challan */}
          {data.documentType === "delivery-challan" && (
            <div className="text-center w-40">
              <div className="h-12 flex items-end justify-center">
                <div className="border-b border-gray-400 w-full">&nbsp;</div>
              </div>
              <div className="mt-2">
                <div className="font-medium">Recipient's Signature</div>
                <div className="text-sm text-gray-600">I have received all items properly</div>
              </div>
            </div>
          )}

          {/* Company Signature - Show when signature is included */}
          {data.signatureInfo.includeSignature && (
            <div className="text-center w-40">
              <div className="flex flex-col items-center">
                <div className="h-12 flex items-end justify-center">
                  <div className="border-b border-gray-400 w-full">&nbsp;</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="font-medium">{data.signatureInfo.name || "Name"}</div>
                <div>{data.signatureInfo.designation || "Designation"}</div>
              </div>
            </div>
          )}
        </div>

        {/* Contact info */}
        <div className="flex flex-col md:flex-row justify-center md:space-x-8 space-y-1 md:space-y-0 text-gray-700 print:text-xs mb-4">
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 print:h-3 print:w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{data.companyInfo.email}</span>
          </div>
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 print:h-3 print:w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{data.companyInfo.phoneNumbers.join(", ")}</span>
          </div>
        </div>

        {/* Bottom triangular design */}
        <div className="relative h-[80px] w-full print:h-[60px]">
          {/* Orange triangle */}
          <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[80px] border-b-[#ff8c42] border-r-[80px] border-r-transparent z-0 print:border-b-[60px] print:border-r-[60px]"></div>

          {/* Blue triangle */}
          <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[80px] border-t-[#1e4e6c] border-l-[80px] border-l-transparent z-0 print:border-t-[60px] print:border-l-[60px]"></div>
        </div>
      </div>
    </div>
  )
}
