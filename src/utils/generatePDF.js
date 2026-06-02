import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const generatePDF = async (elementId, filename = 'report.pdf') => {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Element not found')
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 10

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    pdf.save(filename)
    
    return true
  } catch (error) {
    console.error('PDF generation failed:', error)
    throw error
  }
}

export const generateGSTInvoice = (site, payments, businessDetails) => {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.text(businessDetails.businessName || 'MarblePro Works', 105, 20, { align: 'center' })
  
  doc.setFontSize(10)
  doc.text(`GST: ${businessDetails.gstNumber || 'N/A'}`, 105, 28, { align: 'center' })
  doc.text(businessDetails.address || '', 105, 33, { align: 'center' })
  
  // Invoice details
  doc.setFontSize(14)
  doc.text('TAX INVOICE', 105, 45, { align: 'center' })
  
  doc.setFontSize(10)
  doc.text(`Invoice Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 55)
  doc.text(`Customer: ${site.customerName}`, 20, 62)
  doc.text(`Site Address: ${site.siteAddress}`, 20, 69)
  doc.text(`Work Type: ${site.workType}`, 20, 76)
  
  // Table
  doc.setFillColor(37, 99, 235)
  doc.rect(20, 85, 170, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text('Description', 25, 91)
  doc.text('Qty', 100, 91)
  doc.text('Rate', 130, 91)
  doc.text('Amount', 160, 91)
  
  doc.setTextColor(0, 0, 0)
  doc.text(`${site.workType}`, 25, 105)
  doc.text(`${site.squareFeet} sqft`, 100, 105)
  doc.text(`₹${site.ratePerSqft}/sqft`, 130, 105)
  doc.text(`₹${site.totalAmount}`, 160, 105)
  
  // Totals
  doc.line(20, 115, 190, 115)
  doc.text('Total Amount:', 130, 125)
  doc.text(`₹${site.totalAmount}`, 160, 125)
  
  doc.text('Advance Paid:', 130, 132)
  doc.text(`₹${site.advancePayment}`, 160, 132)
  
  doc.setFont(undefined, 'bold')
  doc.text('Balance Due:', 130, 142)
  doc.text(`₹${site.remainingPayment}`, 160, 142)
  
  // Footer
  doc.setFont(undefined, 'normal')
  doc.setFontSize(9)
  doc.text('Thank you for your business!', 105, 260, { align: 'center' })
  
  doc.save(`Invoice-${site.customerName}-${Date.now()}.pdf`)
}
