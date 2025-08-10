/**
 * Office Script: Add Student Registration to Excel
 * This script receives student registration data from Power Automate
 * and adds it as a new row to Sheet1 of the Excel workbook.
 */

// Explicit type definitions for all parameters
interface StudentRegistrationData {
    studentName: string;
    studentNumber: string;
    parentPhone: string;
    gradeLevel: string;
    center: string;
    timestamp: string;
}

interface PowerAutomateRequest {
    body: StudentRegistrationData;
}

interface PowerAutomateResponse {
    status: number;
    body: {
        success: boolean;
        message: string;
        rowNumber?: number;
    };
}

/**
 * Main function called by Power Automate
 * @param request - The HTTP request from Power Automate containing student data
 * @returns Response object with success status and message
 */
function main(request: PowerAutomateRequest): PowerAutomateResponse {
    try {
        // Validate request data
        if (!request || !request.body) {
            return createErrorResponse(400, "Invalid request data");
        }

        const studentData: StudentRegistrationData = request.body;
        
        // Validate required fields
        if (!isValidStudentData(studentData)) {
            return createErrorResponse(400, "Missing or invalid required fields");
        }

        // Get the active worksheet
        const worksheet: ExcelScript.Worksheet = getActiveWorksheet();
        
        // Get the data range
        const dataRange: ExcelScript.Range = worksheet.getUsedRange();
        
        // Find the next empty row
        const nextRow: number = findNextEmptyRow(dataRange);
        
        // Add the new student data
        const success: boolean = addStudentRow(worksheet, studentData, nextRow);
        
        if (success) {
            return createSuccessResponse(`Student registration added successfully to row ${nextRow}`);
        } else {
            return createErrorResponse(500, "Failed to add student data to Excel");
        }

    } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Office Script Error:", errorMessage);
        return createErrorResponse(500, `Internal server error: ${errorMessage}`);
    }
}

/**
 * Validates that all required student data fields are present and valid
 * @param data - The student registration data to validate
 * @returns True if data is valid, false otherwise
 */
function isValidStudentData(data: StudentRegistrationData): boolean {
    // Check if all required fields exist and are not empty
    const requiredFields: (keyof StudentRegistrationData)[] = [
        'studentName', 'studentNumber', 'parentPhone', 'gradeLevel', 'center'
    ];
    
    for (const field of requiredFields) {
        if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
            return false;
        }
    }
    
    // Validate phone number format (numbers only, 10-12 digits)
    const phoneRegex: RegExp = /^\d{10,12}$/;
    if (!phoneRegex.test(data.parentPhone)) {
        return false;
    }
    
    // Validate student number format (alphanumeric, 3-20 characters)
    const studentNumberRegex: RegExp = /^[A-Za-z0-9]{3,20}$/;
    if (!studentNumberRegex.test(data.studentNumber)) {
        return false;
    }
    
    // Validate student name format (letters and spaces only, 2-50 characters)
    const nameRegex: RegExp = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(data.studentName)) {
        return false;
    }
    
    return true;
}

/**
 * Gets the active worksheet from the workbook
 * @returns The active worksheet
 */
function getActiveWorksheet(): ExcelScript.Worksheet {
    const workbook: ExcelScript.Workbook = context.workbook;
    const worksheet: ExcelScript.Worksheet = workbook.getActiveWorksheet();
    
    if (!worksheet) {
        throw new Error("No active worksheet found");
    }
    
    return worksheet;
}

/**
 * Finds the next empty row in the worksheet
 * @param dataRange - The current data range in the worksheet
 * @returns The row number of the next empty row
 */
function findNextEmptyRow(dataRange: ExcelScript.Range): number {
    if (!dataRange) {
        return 1; // If no data exists, start at row 1
    }
    
    const rowCount: number = dataRange.getRowCount();
    return rowCount + 1;
}

/**
 * Adds a new student registration row to the worksheet
 * @param worksheet - The worksheet to add data to
 * @param studentData - The student registration data
 * @param rowNumber - The row number to add the data to
 * @returns True if successful, false otherwise
 */
function addStudentRow(
    worksheet: ExcelScript.Worksheet, 
    studentData: StudentRegistrationData, 
    rowNumber: number
): boolean {
    try {
        // Define column headers (adjust these to match your Excel sheet structure)
        const headers: string[] = [
            'Student Name',
            'Student Number', 
            'Parent Phone',
            'Grade Level',
            'Center',
            'Timestamp'
        ];
        
        // If this is the first row, add headers
        if (rowNumber === 1) {
            const headerRange: ExcelScript.Range = worksheet.getRange("A1:F1");
            headerRange.setValues([headers]);
            headerRange.getFormat().getFill().setColor("4472C4");
            headerRange.getFormat().getFont().setColor("FFFFFF");
            headerRange.getFormat().getFont().setBold(true);
        }
        
        // Prepare the data row
        const dataRow: (string | number)[][] = [[
            studentData.studentName.trim(),
            studentData.studentNumber.trim(),
            studentData.parentPhone.trim(),
            studentData.gradeLevel.trim(),
            studentData.center.trim(),
            studentData.timestamp
        ]];
        
        // Add the data to the worksheet
        const targetRange: ExcelScript.Range = worksheet.getRange(`A${rowNumber}:F${rowNumber}`);
        targetRange.setValues(dataRow);
        
        // Apply basic formatting
        targetRange.getFormat().getFill().setColor("F0F0F0");
        targetRange.getFormat().getFont().setColor("000000");
        
        // Auto-fit columns
        worksheet.getRange("A:F").getFormat().autofitColumns();
        
        return true;
        
    } catch (error: unknown) {
        console.error("Error adding student row:", error);
        return false;
    }
}

/**
 * Creates a success response object
 * @param message - Success message
 * @param rowNumber - Optional row number where data was added
 * @returns Response object
 */
function createSuccessResponse(message: string, rowNumber?: number): PowerAutomateResponse {
    return {
        status: 200,
        body: {
            success: true,
            message: message,
            rowNumber: rowNumber
        }
    };
}

/**
 * Creates an error response object
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @returns Response object
 */
function createErrorResponse(statusCode: number, message: string): PowerAutomateResponse {
    return {
        status: statusCode,
        body: {
            success: false,
            message: message
        }
    };
}
