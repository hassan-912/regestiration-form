/**
 * Configuration Template for Student Registration Form
 * 
 * This file contains all the configuration settings you need to update
 * before deploying your student registration form.
 * 
 * IMPORTANT: Replace all placeholder values with your actual configuration.
 */

// ============================================================================
// POWER AUTOMATE CONFIGURATION
// ============================================================================

/**
 * Power Automate Webhook URL
 * 
 * This is the webhook URL you get when you create a Power Automate flow
 * with the "When a HTTP request is received" trigger.
 * 
 * Steps to get this URL:
 * 1. Go to Power Automate (https://flow.microsoft.com)
 * 2. Create a new flow with "When a HTTP request is received" trigger
 * 3. Copy the webhook URL from the trigger
 * 4. Paste it below
 */
export const POWER_AUTOMATE_WEBHOOK_URL = 'YOUR_POWER_AUTOMATE_WEBHOOK_URL_HERE';

// Example: 'https://prod-123.westus.logic.azure.com:443/workflows/abc123/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xyz789'

// ============================================================================
// FORM VALIDATION CONFIGURATION
// ============================================================================

/**
 * Form Validation Rules
 * 
 * These settings control the validation behavior of your form.
 * Adjust these values based on your business requirements.
 */
export const VALIDATION_CONFIG = {
    // Student Name validation
    studentName: {
        minLength: 2,
        maxLength: 50,
        pattern: /^[A-Za-z\s]+$/, // Letters and spaces only
        patternDescription: 'Letters and spaces only'
    },
    
    // Student Number validation
    studentNumber: {
        minLength: 3,
        maxLength: 20,
        pattern: /^[A-Za-z0-9]+$/, // Alphanumeric only
        patternDescription: 'Letters and numbers only'
    },
    
    // Parent Phone validation
    parentPhone: {
        minLength: 10,
        maxLength: 12,
        pattern: /^\d+$/, // Numbers only
        patternDescription: 'Numbers only (10-12 digits)'
    },
    
    // Grade Level options
    gradeLevels: [
        { value: '1st prep', label: '1st Preparatory' },
        { value: '2nd prep', label: '2nd Preparatory' },
        { value: '3rd prep', label: '3rd Preparatory' },
        { value: '1st sec', label: '1st Secondary' },
        { value: '2nd sec', label: '2nd Secondary' }
    ],
    
    // Study Centers mapping
    centers: {
        '1st prep': ['camprage'],
        '2nd prep': ['camprage', 'heights'],
        '3rd prep': ['heights', '60'],
        '1st sec': ['heights', '60'],
        '2nd sec': ['heights', '60']
    }
};

// ============================================================================
// EXCEL CONFIGURATION
// ============================================================================

/**
 * Excel Column Configuration
 * 
 * These settings define the structure of your Excel sheet.
 * Make sure these match exactly with your Excel workbook columns.
 */
export const EXCEL_CONFIG = {
    // Column headers (must match your Excel sheet exactly)
    headers: [
        'Student Name',      // Column A
        'Student Number',    // Column B
        'Parent Phone',      // Column C
        'Grade Level',       // Column D
        'Center',            // Column E
        'Timestamp'          // Column F
    ],
    
    // Column letters for Excel operations
    columns: {
        studentName: 'A',
        studentNumber: 'B',
        parentPhone: 'C',
        gradeLevel: 'D',
        center: 'E',
        timestamp: 'F'
    },
    
    // Starting row (usually 1 for headers, 2 for first data row)
    startRow: 1,
    
    // Worksheet name
    worksheetName: 'Sheet1'
};

// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================

/**
 * Security Settings
 * 
 * Configure these settings to enhance the security of your form.
 */
export const SECURITY_CONFIG = {
    // Rate limiting (requests per minute per IP)
    rateLimit: {
        enabled: true,
        maxRequests: 10,
        windowMs: 60000 // 1 minute
    },
    
    // CORS settings
    cors: {
        enabled: true,
        allowedOrigins: [
            'https://yourdomain.com',
            'https://www.yourdomain.com'
        ]
    },
    
    // Input sanitization
    sanitization: {
        enabled: true,
        removeScripts: true,
        removeHtmlTags: true
    }
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * Custom Error Messages
 * 
 * Customize these messages to match your application's tone and language.
 */
export const ERROR_MESSAGES = {
    // Form validation errors
    validation: {
        studentName: {
            required: 'Student name is required.',
            invalid: 'Student name should contain only letters and spaces.',
            length: 'Student name should be between 2 and 50 characters.'
        },
        studentNumber: {
            required: 'Student number is required.',
            invalid: 'Student number should contain only letters and numbers.',
            length: 'Student number should be between 3 and 20 characters.',
            duplicate: 'A student with this number has already been registered.'
        },
        parentPhone: {
            required: 'Parent phone number is required.',
            invalid: 'Phone number should contain only numbers.',
            length: 'Phone number should be between 10 and 12 digits.'
        },
        gradeLevel: {
            required: 'Please select a grade level.',
            invalid: 'Please select a valid grade level.'
        },
        center: {
            required: 'Please select a study center.',
            invalid: 'Please select a valid study center for the chosen grade level.'
        },
        duplicateNumbers: 'Student number and parent phone number cannot be the same.'
    },
    
    // System errors
    system: {
        webhookNotConfigured: 'System configuration error. Please contact administrator.',
        submissionFailed: 'Failed to submit registration. Please try again.',
        networkError: 'Network error. Please check your connection and try again.',
        serverError: 'Server error. Please try again later.'
    }
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

/**
 * Success Messages
 * 
 * Customize these messages for successful form submissions.
 */
export const SUCCESS_MESSAGES = {
    registration: {
        title: 'Registration Successful!',
        message: 'Welcome to our Mathematics Academy. We\'ll contact you soon!',
        details: 'Your registration has been submitted and will be processed shortly.'
    }
};

// ============================================================================
// DEPLOYMENT CHECKLIST
// ============================================================================

/**
 * DEPLOYMENT CHECKLIST
 * 
 * Before deploying your form, ensure you have completed all of the following:
 * 
 * ✅ [ ] Updated POWER_AUTOMATE_WEBHOOK_URL with your actual webhook URL
 * ✅ [ ] Created Power Automate flow with HTTP trigger
 * ✅ [ ] Created and tested Office Script in Excel Online
 * ✅ [ ] Configured Excel workbook with correct column structure
 * ✅ [ ] Tested form submission in development environment
 * ✅ [ ] Verified data appears correctly in Excel
 * ✅ [ ] Checked error handling and validation
 * ✅ [ ] Configured security settings
 * ✅ [ ] Set up monitoring and alerts
 * ✅ [ ] Created backup procedures
 * 
 * IMPORTANT: Never commit this file with actual URLs or sensitive information
 * to version control. Use environment variables or separate configuration files
 * for production deployments.
 */

export default {
    POWER_AUTOMATE_WEBHOOK_URL,
    VALIDATION_CONFIG,
    EXCEL_CONFIG,
    SECURITY_CONFIG,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
};
