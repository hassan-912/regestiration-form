// XLSX types declaration
declare const XLSX: {
    utils: {
        book_new(): any;
        json_to_sheet(data: any[]): any;
    };
    book_append_sheet(workbook: any, worksheet: any, name: string): void;
    writeFile(workbook: any, filename: string): void;
}; 