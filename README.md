# Student Registration Form

A modern, responsive web application for student registration with dynamic center selection based on grade levels and Excel Online integration via Power Automate.

## Features

- **Modern UI**: Beautiful, responsive design using Tailwind CSS
- **Dynamic Center Selection**: Centers are automatically filtered based on grade level:
  - 1st Prep → Camprage only
  - 2nd Prep → Camprage and Heights
  - 3rd Prep → Heights and 60
  - 1st Secondary → Heights and 60
  - 2nd Secondary → Heights and 60
- **Form Validation**: Real-time validation for all required fields
- **Duplicate Prevention**: Prevents duplicate student number registrations
- **Excel Online Integration**: Data is automatically stored in Excel Online via Power Automate
- **Office Scripts**: Automated data processing with TypeScript-based scripts

## Required Fields

- Student Name
- Student Number
- Parent Phone Number
- Grade Level
- Center (dynamically filtered)

## Technology Stack

- **HTML5**: Semantic markup
- **Tailwind CSS**: Modern styling framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Power Automate**: Cloud automation service
- **Excel Online**: Data storage and management
- **Office Scripts**: Excel automation with TypeScript

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Microsoft 365 account (for Excel Online and Power Automate)
- Power Automate access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd student-registration-form
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Power Automate Setup

This application uses Power Automate to connect the HTML form to Excel Online. See `POWER_AUTOMATE_SETUP.md` for detailed setup instructions.

### Key Components

1. **Power Automate Flow**: Receives HTTP POST requests from the form
2. **Office Script**: Processes data and writes to Excel Online
3. **Excel Online**: Stores all registration data in a structured format

## Usage

1. **Fill out the form**: Enter all required student information
2. **Select grade level**: Choose the appropriate grade level
3. **Choose center**: Available centers will be automatically filtered
4. **Submit**: Click the submit button to register the student
5. **Excel Storage**: All registrations are automatically saved to Excel Online

## Data Storage

- All registrations are stored in Excel Online (Sheet1)
- Data is automatically formatted and organized
- Real-time data processing via Office Scripts
- See `POWER_AUTOMATE_SETUP.md` for detailed setup instructions

## Configuration

Update the `POWER_AUTOMATE_WEBHOOK_URL` constant in `src/main.ts` with your actual Power Automate webhook URL. See `config-template.ts` for additional configuration options.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

If you encounter any issues or have questions, please open an issue on the repository. 