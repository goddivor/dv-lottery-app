// src/lib/pdfExport.ts

// src/lib/pdfExport.ts
import type { DVFormData } from '@/hooks/useDVForm'

export const generatePDFData = (formData: DVFormData) => {
  // Format data for PDF generation
  const pdfData = {
    title: 'DV Lottery Application - DV-2026',
    applicant: {
      fullName: `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      birthPlace: `${formData.cityOfBirth}, ${formData.countryOfBirth}`,
      eligibilityCountry: formData.eligibilityCountry,
    },
    contact: {
      email: formData.email,
      phone: formData.phoneNumber || 'Not provided',
      address: [
        formData.addressLine1,
        formData.addressLine2,
        `${formData.city}, ${formData.stateProvince} ${formData.postalCode}`,
        formData.country
      ].filter(Boolean).join('\n'),
    },
    details: {
      educationLevel: formData.educationLevel,
      maritalStatus: formData.maritalStatus,
      numberOfChildren: formData.numberOfChildren,
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      completionPercentage: formData.completionPercentage,
      lastSaved: formData.lastSaved,
    }
  }

  return pdfData
}

export const exportToPDF = async (formData: DVFormData): Promise<void> => {
  const data = generatePDFData(formData)
  
  // Pour l'instant, on génère un HTML simple qu'on peut imprimer
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>DV Lottery Application</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .section {
          margin-bottom: 25px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .section h2 {
          color: #333;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          margin-top: 0;
        }
        .field {
          margin-bottom: 10px;
        }
        .label {
          font-weight: bold;
          color: #555;
        }
        .value {
          margin-left: 20px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>DV LOTTERY APPLICATION</h1>
        <h2>Diversity Visa Program 2026</h2>
        <p><strong>Application Preview</strong></p>
      </div>

      <div class="section">
        <h2>Personal Information</h2>
        <div class="field">
          <span class="label">Full Name:</span>
          <span class="value">${data.applicant.fullName}</span>
        </div>
        <div class="field">
          <span class="label">Gender:</span>
          <span class="value">${data.applicant.gender}</span>
        </div>
        <div class="field">
          <span class="label">Date of Birth:</span>
          <span class="value">${data.applicant.dateOfBirth}</span>
        </div>
        <div class="field">
          <span class="label">Place of Birth:</span>
          <span class="value">${data.applicant.birthPlace}</span>
        </div>
        <div class="field">
          <span class="label">Country of Eligibility:</span>
          <span class="value">${data.applicant.eligibilityCountry}</span>
        </div>
      </div>

      <div class="section">
        <h2>Contact Information</h2>
        <div class="field">
          <span class="label">Email:</span>
          <span class="value">${data.contact.email}</span>
        </div>
        <div class="field">
          <span class="label">Phone:</span>
          <span class="value">${data.contact.phone}</span>
        </div>
        <div class="field">
          <span class="label">Address:</span>
          <div class="value" style="white-space: pre-line;">${data.contact.address}</div>
        </div>
      </div>

      <div class="section">
        <h2>Additional Details</h2>
        <div class="field">
          <span class="label">Education Level:</span>
          <span class="value">${data.details.educationLevel}</span>
        </div>
        <div class="field">
          <span class="label">Marital Status:</span>
          <span class="value">${data.details.maritalStatus}</span>
        </div>
        <div class="field">
          <span class="label">Number of Children:</span>
          <span class="value">${data.details.numberOfChildren}</span>
        </div>
      </div>

      <div class="footer">
        <p><strong>⚠️ IMPORTANT NOTICE</strong></p>
        <p>This is a practice application preview only.</p>
        <p>Submit your official application at <strong>dvprogram.state.gov</strong></p>
        <p>Generated on: ${new Date(data.metadata.generatedAt).toLocaleString()}</p>
        <p>Application Completion: ${data.metadata.completionPercentage}%</p>
      </div>

      <script>
        // Auto-print when opening
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `

  // Ouvrir dans une nouvelle fenêtre pour impression
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  } else {
    // Fallback: créer un blob et télécharger
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dv-lottery-application-${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

// Fonction pour valider avant export
export const validateForPDF = (formData: DVFormData): { isValid: boolean; missingFields: string[] } => {
  const requiredFields = [
    { key: 'lastName', label: 'Last Name' },
    { key: 'firstName', label: 'First Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'cityOfBirth', label: 'City of Birth' },
    { key: 'countryOfBirth', label: 'Country of Birth' },
    { key: 'eligibilityCountry', label: 'Eligibility Country' },
    { key: 'email', label: 'Email' },
    { key: 'educationLevel', label: 'Education Level' },
    { key: 'maritalStatus', label: 'Marital Status' }
  ]

  const missingFields = requiredFields
    .filter(field => !formData[field.key as keyof DVFormData] || formData[field.key as keyof DVFormData] === '')
    .map(field => field.label)

  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}