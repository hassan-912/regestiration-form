# Power Automate Setup Guide for Student Registration Form

This guide will walk you through setting up Power Automate to receive form submissions and automatically add them to Excel Online using Office Scripts.

## Prerequisites

- Microsoft 365 account with Power Automate access
- Excel Online workbook stored in OneDrive or SharePoint
- Office Scripts enabled in your Excel Online environment

## Step 1: Create the Excel Workbook Structure

1. **Open Excel Online** and create a new workbook or use an existing one
2. **Name the first worksheet** "Sheet1" (or your preferred name)
3. **Set up column headers** in row 1:
   - Column A: Student Name
   - Column B: Student Number
   - Column C: Parent Phone
   - Column D: Grade Level
   - Column E: Center
   - Column F: Timestamp
4. **Save the workbook** to OneDrive or SharePoint
5. **Note the workbook location** for later use

## Step 2: Create the Office Script

1. **Open your Excel workbook** in Excel Online
2. **Go to Automate tab** → **Office Scripts**
3. **Click "New Script"**
4. **Copy and paste** the code from `office-script.ts`
5. **Save the script** with a descriptive name (e.g., "AddStudentRegistration")
6. **Test the script** by running it manually to ensure no syntax errors
7. **Note the script ID** from the URL (you'll need this for Power Automate)

## Step 3: Create Power Automate Flow

### 3.1 Create New Flow
1. **Go to [Power Automate](https://flow.microsoft.com)**
2. **Click "Create"** → **"Scheduled cloud flow"**
3. **Name your flow**: "Student Registration Form Handler"
4. **Set trigger**: Choose "When a HTTP request is received"

### 3.2 Configure HTTP Trigger
1. **In the HTTP trigger**, you'll see a **webhook URL** - **copy this URL**
2. **Set the request body JSON schema** to:
```json
{
    "type": "object",
    "properties": {
        "studentName": {
            "type": "string"
        },
        "studentNumber": {
            "type": "string"
        },
        "parentPhone": {
            "type": "string"
        },
        "gradeLevel": {
            "type": "string"
        },
        "center": {
            "type": "string"
        },
        "timestamp": {
            "type": "string"
        }
    }
}
```

### 3.3 Add Office Script Action
1. **Click "+ Add an action"**
2. **Search for "Office Scripts"**
3. **Select "Run Office Script"**
4. **Configure the action**:
   - **Location**: Choose your OneDrive/SharePoint location
   - **Document Library**: Select your document library
   - **File**: Choose your Excel workbook
   - **Script**: Select your "AddStudentRegistration" script
   - **Request**: Set to `@triggerBody()` (this passes the form data)

### 3.4 Add Response Action
1. **Click "+ Add an action"**
2. **Search for "Response"**
3. **Select "Response"**
4. **Configure the response**:
   - **Status Code**: 200
   - **Body**: Set to `@body('Run_Office_Script')`

### 3.5 Add Error Handling (Optional but Recommended)
1. **Click the three dots** on the Office Script action
2. **Select "Configure run after"**
3. **Check "is successful"** and **"has failed"**
4. **Add a "Response" action** for the failure path:
   - **Status Code**: 500
   - **Body**: Set to `@body('Run_Office_Script')`

## Step 4: Update Your HTML Form

1. **Open your `src/main.ts` file**
2. **Replace the placeholder URL**:
   ```typescript
   const POWER_AUTOMATE_WEBHOOK_URL = 'YOUR_ACTUAL_WEBHOOK_URL_HERE';
   ```
3. **Paste your actual webhook URL** from Step 3.2

## Step 5: Test the Integration

### 5.1 Test the Form
1. **Open your HTML form** in a browser
2. **Fill out the form** with test data
3. **Submit the form**
4. **Check the browser console** for any errors

### 5.2 Monitor Power Automate
1. **Go to Power Automate** → **My flows**
2. **Open your flow** and check the **Run history**
3. **Verify the flow executed** successfully

### 5.3 Check Excel
1. **Open your Excel workbook**
2. **Verify the new row** was added with your test data
3. **Check that headers** were created if it was the first submission

## Step 6: Security and Production Considerations

### 6.1 Data Validation
- The Office Script includes comprehensive validation
- Power Automate can add additional validation layers
- Consider adding rate limiting to prevent spam

### 6.2 Error Handling
- Monitor Power Automate run history for failures
- Set up alerts for failed executions
- Log errors for debugging

### 6.3 Access Control
- Ensure only authorized users can access the form
- Consider adding authentication to the form
- Restrict Power Automate access to necessary users only

## Troubleshooting

### Common Issues

1. **"Script not found" error**:
   - Ensure the Office Script is saved and published
   - Check that you're selecting the correct script in Power Automate

2. **"File not found" error**:
   - Verify the workbook path in Power Automate
   - Ensure the workbook is accessible from your account

3. **Form submission fails**:
   - Check the webhook URL is correct
   - Verify Power Automate flow is enabled
   - Check browser console for CORS errors

4. **Data not appearing in Excel**:
   - Check Power Automate run history
   - Verify the Office Script executed successfully
   - Check Excel permissions and sharing settings

### Debugging Steps

1. **Enable Power Automate logging**:
   - Go to Power Automate settings
   - Enable detailed logging
   - Check run history for detailed error messages

2. **Test Office Script manually**:
   - Run the script directly in Excel Online
   - Check for any runtime errors

3. **Verify data format**:
   - Ensure form data matches the expected JSON schema
   - Check that all required fields are present

## Performance Optimization

1. **Batch processing**: Consider batching multiple submissions
2. **Caching**: Cache frequently accessed data
3. **Async processing**: Use asynchronous operations for better performance

## Monitoring and Maintenance

1. **Regular monitoring** of Power Automate execution
2. **Performance metrics** tracking
3. **Error rate monitoring**
4. **Data validation** checks
5. **Backup procedures** for your Excel data

## Support Resources

- [Power Automate Documentation](https://docs.microsoft.com/en-us/power-automate/)
- [Office Scripts Documentation](https://docs.microsoft.com/en-us/office/dev/scripts/)
- [Excel Online Help](https://support.microsoft.com/en-us/excel)
- [Microsoft 365 Community](https://techcommunity.microsoft.com/t5/microsoft-365/ct-p/Microsoft365)

---

**Note**: This setup creates a production-ready solution with proper error handling, validation, and security considerations. Make sure to test thoroughly in a development environment before deploying to production.
