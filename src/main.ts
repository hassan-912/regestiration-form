// Configuration - Replace with your actual Power Automate webhook URL
const POWER_AUTOMATE_WEBHOOK_URL = 'https://prod-240.westeurope.logic.azure.com:443/workflows/766d9c7e49914017b7161ddc5685c241/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=vIl6iohFFT8Pgp97lhofp5KUyPXKhNPHWOiZ8LNQtrY';

// Types
interface StudentData {
    studentName: string;
    studentNumber: string;
    parentPhone: string;
    gradeLevel: string;
    center: string;
    timestamp: string;
}

interface GradeCenterMapping {
    [key: string]: string[];
}

// Grade to Center mapping
const gradeCenterMapping: GradeCenterMapping = {
    '1st prep': ['cambridge'],
    '2nd prep': ['cambridge', 'heights'],
    '3rd prep': ['heights', '60'],
    '1st sec': ['heights', '60', 'top academy'],
    '2nd sec': ['heights', '60']
};

// DOM Elements
const form = document.getElementById('studentForm') as HTMLFormElement;
const gradeSelect = document.getElementById('gradeLevel') as HTMLSelectElement;
const centerSelect = document.getElementById('center') as HTMLSelectElement;
const successMessage = document.getElementById('successMessage') as HTMLDivElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;
const errorText = document.getElementById('errorText') as HTMLSpanElement;

// Input field elements for real-time validation
const studentNameInput = document.getElementById('studentName') as HTMLInputElement;
const studentNumberInput = document.getElementById('studentNumber') as HTMLInputElement;
const parentPhoneInput = document.getElementById('parentPhone') as HTMLInputElement;

// Initialize the application
function init() {
    setupEventListeners();
    validateWebhookUrl();
}

// Setup event listeners
function setupEventListeners() {
    // Grade level change handler
    gradeSelect.addEventListener('change', handleGradeChange);
    
    // Form submission handler
    form.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation event listeners
    studentNameInput.addEventListener('input', () => validateStudentName());
    studentNameInput.addEventListener('blur', () => validateStudentName());
    
    studentNumberInput.addEventListener('input', () => validateStudentNumber());
    studentNumberInput.addEventListener('blur', () => validateStudentNumber());
    
    parentPhoneInput.addEventListener('input', () => validateParentPhone());
    parentPhoneInput.addEventListener('blur', () => validateParentPhone());
    
    gradeSelect.addEventListener('change', () => validateGradeLevel());
    centerSelect.addEventListener('change', () => validateCenter());
}

// Validate webhook URL configuration
function validateWebhookUrl() {
    if (!POWER_AUTOMATE_WEBHOOK_URL || POWER_AUTOMATE_WEBHOOK_URL.includes('YOUR_POWER_AUTOMATE_WEBHOOK_URL_HERE')) {
        console.error('Power Automate webhook URL not configured. Please update the POWER_AUTOMATE_WEBHOOK_URL constant.');
        showErrorMessage('System configuration error. Please contact administrator.');
    }
}

// Handle grade level selection
function handleGradeChange() {
    const selectedGrade = gradeSelect.value;
    
    // Clear center options
    centerSelect.innerHTML = '<option value="">Select center</option>';
    
    if (selectedGrade && gradeCenterMapping[selectedGrade]) {
        // Enable center select
        centerSelect.disabled = false;
        
        // Add available centers for the selected grade
        gradeCenterMapping[selectedGrade].forEach(center => {
            const option = document.createElement('option');
            option.value = center;
            option.textContent = center.charAt(0).toUpperCase() + center.slice(1);
            centerSelect.appendChild(option);
        });
    } else {
        // Disable center select
        centerSelect.disabled = true;
        centerSelect.innerHTML = '<option value="">Please select grade level first</option>';
    }
    
    // Validate grade level after change
    validateGradeLevel();
}

// Real-time validation functions
function validateStudentName(): boolean {
    const value = studentNameInput.value.trim();
    const nameRegex = /^[A-Za-z\s]+$/;
    
    if (!value) {
        clearFieldError(studentNameInput);
        return false;
    }
    
    if (!nameRegex.test(value)) {
        showFieldError(studentNameInput, 'Student name should contain only letters and spaces.');
        return false;
    }
    
    if (value.length < 2 || value.length > 50) {
        showFieldError(studentNameInput, 'Student name should be between 2 and 50 characters.');
        return false;
    }
    
    clearFieldError(studentNameInput);
    return true;
}

function validateStudentNumber(): boolean {
    const value = studentNumberInput.value.trim();
    const studentNumberRegex = /^[A-Za-z0-9]+$/;
    
    if (!value) {
        clearFieldError(studentNumberInput);
        return false;
    }
    
    if (!studentNumberRegex.test(value)) {
        showFieldError(studentNumberInput, 'Student number should contain only letters and numbers.');
        return false;
    }
    
    if (value.length < 3 || value.length > 20) {
        showFieldError(studentNumberInput, 'Student number should be between 3 and 20 characters.');
        return false;
    }
    
    // Check if student number and parent phone are the same
    if (parentPhoneInput.value && value === parentPhoneInput.value) {
        showFieldError(studentNumberInput, 'Student number and parent phone number cannot be the same.');
        return false;
    }
    
    clearFieldError(studentNumberInput);
    return true;
}

function validateParentPhone(): boolean {
    const value = parentPhoneInput.value.trim();
    const phoneRegex = /^\d+$/;
    
    if (!value) {
        clearFieldError(parentPhoneInput);
        return false;
    }
    
    if (!phoneRegex.test(value)) {
        showFieldError(parentPhoneInput, 'Phone number should contain only numbers.');
        return false;
    }
    
    if (value.length < 10 || value.length > 12) {
        showFieldError(parentPhoneInput, 'Phone number should be between 10 and 12 digits.');
        return false;
    }
    
    // Check if student number and parent phone are the same
    if (studentNumberInput.value && value === studentNumberInput.value) {
        showFieldError(parentPhoneInput, 'Student number and parent phone number cannot be the same.');
        return false;
    }
    
    clearFieldError(parentPhoneInput);
    return true;
}

function validateGradeLevel(): boolean {
    const value = gradeSelect.value;
    
    if (!value || !gradeCenterMapping[value]) {
        showFieldError(gradeSelect, 'Please select a valid grade level.');
        return false;
    }
    
    clearFieldError(gradeSelect);
    return true;
}

function validateCenter(): boolean {
    const gradeValue = gradeSelect.value;
    const centerValue = centerSelect.value;
    
    if (!gradeValue) {
        clearFieldError(centerSelect);
        return false;
    }
    
    if (!centerValue || !gradeCenterMapping[gradeValue]?.includes(centerValue)) {
        showFieldError(centerSelect, 'Please select a valid study center for the chosen grade level.');
        return false;
    }
    
    clearFieldError(centerSelect);
    return true;
}

// Show field-specific error
function showFieldError(field: HTMLElement, message: string) {
    // Remove existing error styling
    field.classList.remove('border-red-500', 'border-green-500');
    field.classList.add('border-red-500');
    
    // Show error message below the field
    let errorDiv = field.parentElement?.querySelector('.field-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-red-600 text-sm mt-1 flex items-center';
        errorDiv.innerHTML = `
            <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            ${message}
        `;
        field.parentElement?.appendChild(errorDiv);
    } else {
        errorDiv.innerHTML = `
            <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            ${message}
        `;
    }
}

// Clear field-specific error
function clearFieldError(field: HTMLElement) {
    field.classList.remove('border-red-500');
    field.classList.add('border-green-500');
    
    // Remove error message
    const errorDiv = field.parentElement?.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    
    // Remove green border after a short delay
    setTimeout(() => {
        field.classList.remove('border-green-500');
    }, 1000);
}

// Handle form submission
async function handleFormSubmit(event: Event) {
    event.preventDefault();
    
    // Validate all fields before submission
    const isNameValid = validateStudentName();
    const isNumberValid = validateStudentNumber();
    const isPhoneValid = validateParentPhone();
    const isGradeValid = validateGradeLevel();
    const isCenterValid = validateCenter();
    
    if (!isNameValid || !isNumberValid || !isPhoneValid || !isGradeValid || !isCenterValid) {
        return;
    }
    
    const formData = new FormData(form);
    const studentData: StudentData = {
        studentName: formData.get('studentName') as string,
        studentNumber: formData.get('studentNumber') as string,
        parentPhone: formData.get('parentPhone') as string,
        gradeLevel: formData.get('gradeLevel') as string,
        center: formData.get('center') as string,
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitButton.innerHTML;
    
    try {
        submitButton.disabled = true;
        submitButton.innerHTML = '<svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Submitting...';
        
        const response = await fetch(POWER_AUTOMATE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData)
        });
        
        if (response.ok) {
            showSuccessMessage();
            form.reset();
            // Clear all field validations
            [studentNameInput, studentNumberInput, parentPhoneInput, gradeSelect, centerSelect].forEach(clearFieldError);
            centerSelect.disabled = true;
            centerSelect.innerHTML = '<option value="">Please select grade level first</option>';
        } else {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        showErrorMessage(`Error: ${error instanceof Error ? error.message : 'Failed to submit registration. Please try again.'}`);
    } finally {
        // Restore button state
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

// Validate student data (for backward compatibility)
function validateStudentData(data: StudentData): boolean {
    // Validate student name (letters and spaces only)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(data.studentName)) {
        showErrorMessage('Student name should contain only letters and spaces.');
        return false;
    }
    
    // Validate student name length
    if (data.studentName.trim().length < 2 || data.studentName.trim().length > 50) {
        showErrorMessage('Student name should be between 2 and 50 characters.');
        return false;
    }
    
    // Validate student number (alphanumeric)
    const studentNumberRegex = /^[A-Za-z0-9]+$/;
    if (!studentNumberRegex.test(data.studentNumber)) {
        showErrorMessage('Student number should contain only letters and numbers.');
        return false;
    }
    
    // Validate student number length
    if (data.studentNumber.length < 3 || data.studentNumber.length > 20) {
        showErrorMessage('Student number should be between 3 and 20 characters.');
        return false;
    }
    
    // Validate phone number (numbers only)
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(data.parentPhone)) {
        showErrorMessage('Phone number should contain only numbers.');
        return false;
    }
    
    // Validate phone number length
    if (data.parentPhone.length < 10 || data.parentPhone.length > 12) {
        showErrorMessage('Phone number should be between 10 and 12 digits.');
        return false;
    }
    
    // Check if student number and parent phone are the same
    if (data.studentNumber === data.parentPhone) {
        showErrorMessage('Student number and parent phone number cannot be the same.');
        return false;
    }
    
    // Validate grade level
    if (!data.gradeLevel || !gradeCenterMapping[data.gradeLevel]) {
        showErrorMessage('Please select a valid grade level.');
        return false;
    }
    
    // Validate center
    if (!data.center || !gradeCenterMapping[data.gradeLevel].includes(data.center)) {
        showErrorMessage('Please select a valid study center for the chosen grade level.');
        return false;
    }
    
    return true;
}

// Show error message
function showErrorMessage(message: string) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    // Hide error after 5 seconds
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

// Show success message
function showSuccessMessage() {
    successMessage.classList.remove('hidden');
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 5000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 