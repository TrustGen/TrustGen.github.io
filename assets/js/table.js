// Function to load a single CSV file
async function loadCSV(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch CSV file from ${url}`);
    return await response.text();
}



// Function to process each table with colored headers
const processModelTable = (data, tableId, headerClass) => {
    const table = document.getElementById(tableId);
    const tableHead = table.querySelector('thead');
    const tableBody = table.querySelector('tbody');

    if (!tableBody || !tableHead)
        throw new Error(`Table elements not found for ${tableId}`);

    // Clear existing contents
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    // Parse CSV data
    const rows = data.trim().split('\n');
    const headers = rows[0].split(',').map(h => h.trim());

    // Populate table header with the specified color class
    const headerRow = document.createElement('tr');
    headerRow.className = headerClass;  // Add custom class for header row styling
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Populate table body rows
    rows.slice(1).forEach(row => {
        const columns = row.split(',').map(col => col.trim());
        const tr = document.createElement('tr');

        columns.forEach((col, index) => {
            const td = document.createElement('td');

            if (headers[index] === 'Open-Weight') {
                const badge = document.createElement('span');
                badge.className = col === "Yes" ? 'badge badge-yes' : 'badge badge-no text-dark';
                badge.textContent = col || 'No';
                td.appendChild(badge);
            } else if (headers[index] === 'Link') {
                if (col) {
                    const link = document.createElement('a');
                    link.href = col;
                    link.target = '_blank';
                    link.className = 'btn btn-link';
                    link.textContent = 'Visit';
                    td.appendChild(link);
                } else {
                    td.textContent = 'N/A';
                }
            } else {
                td.textContent = col || 'N/A';
            }
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });
};



function calculateModelColumnWidth(modelNames) {
    // Create a temporary element to measure text width
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.whiteSpace = 'nowrap';
    document.body.appendChild(tempDiv);

    // Calculate the width for each model name
    let maxWidth = 0;
    modelNames.forEach(name => {
        tempDiv.textContent = name;
        maxWidth = Math.max(maxWidth, tempDiv.offsetWidth);
    });

    document.body.removeChild(tempDiv); // Clean up the temporary element
    return maxWidth + 20; // Add padding/margin (adjust as needed)
}



// Function to process and render each table with data bars and consistent dimensions
const processResultsTable = (data, tableId, headerClass) => {
    const table = document.getElementById(tableId);
    const tableHead = table.querySelector('thead');
    const tableBody = table.querySelector('tbody');

    if (!tableBody || !tableHead)
        throw new Error(`Table elements not found for ${tableId}`);

    // Clear existing contents
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    // Parse CSV data
    const rows = data.trim().split('\n');
    const headers = rows[0].split(',').map(h => h.trim());

    // Get all model names (first column in each row) to calculate the optimal Model column width
    const modelNames = rows.slice(1).map(row => row.split(',')[0].trim());
    const modelColumnWidth = calculateModelColumnWidth(modelNames); // Dynamically calculate Model column width

    // Calculate the width for other columns
    const tableWidth = table.clientWidth;
    const remainingWidth = tableWidth - modelColumnWidth;
    const otherColumnCount = headers.length - 1;
    const otherColumnWidth = Math.floor(remainingWidth / otherColumnCount); // Width for other columns

    // Populate table header with the specified color class
    const headerRow = document.createElement('tr');
    headerRow.className = headerClass;
    headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header;

        // Set width based on column type
        th.style.width = index === 0 ? `${modelColumnWidth}px` : `${otherColumnWidth}px`;
        th.style.height = '50px'; // Set consistent height for header cells
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Populate table body rows with bar effect for numeric values
    rows.slice(1).forEach(row => {
        const columns = row.split(',').map(col => col.trim());
        const tr = document.createElement('tr');

        columns.forEach((col, index) => {
            const td = document.createElement('td');

            if (headers[index] === 'Model') {
                // Model column without bar effect
                td.textContent = col || 'N/A';
            } else if (!isNaN(col) && col !== '') {
                // Numeric columns with data bar effect
                const value = parseFloat(col).toFixed(2);
                td.classList.add('data-bar-cell'); // Add a class for styling
                td.textContent = value;
                // Create a data bar div
                const dataBar = document.createElement('div');
                dataBar.classList.add('data-bar');
                dataBar.style.width = `${value}%`; // Set width based on value
                td.appendChild(dataBar);
            } else {
                td.textContent = col || 'N/A';
            }
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });
};

// Main function to load and render all tables
async function loadTableData() {
    try {
        // Load CSV data for each table
        const [llmModels, lvmModels, t2iModels] = await Promise.all([
            loadCSV('assets/data/llm.csv'),
            loadCSV('assets/data/lvm.csv'),
            loadCSV('assets/data/t2i.csv'),

        ]);
        const [llmResults, lvmResults, t2iResults] = await Promise.all([
            loadCSV('assets/data/llm-res.csv'),
            loadCSV('assets/data/lvm-res.csv'),
            loadCSV('assets/data/t2i-res.csv'),
        ]);


        // Process and render each table with the loaded data
        processModelTable(llmModels, 'llm-table', 'table-primary');
        processModelTable(lvmModels, 'lvm-table', 'table-primary');
        processModelTable(t2iModels, 't2i-table', 'table-primary');

        processResultsTable(llmResults, 'llm-res-table', 'table-secondary');

    } catch (error) {
        console.error('Error loading table data:', error);
    }
}

// Run the function when DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadTableData);

//
// async function loadTableData() {
//     try {
//         // Load all three CSV files
//         const [llmResponse, lvmResponse, t2iResponse] = await Promise.all([
//             fetch('assets/data/llm.csv'),
//             fetch('assets/data/lvm.csv'),
//             fetch('assets/data/t2i.csv')
//         ]);
//
//         if (!llmResponse.ok || !lvmResponse.ok || !t2iResponse.ok)
//             throw new Error('Failed to fetch CSV files');
//
//         const [llmData, lvmData, t2iData] = await Promise.all([
//             llmResponse.text(),
//             lvmResponse.text(),
//             t2iResponse.text()
//         ]);
//
//         // Function to process each table with colored headers
//         const processTable = (data, tableId, headerClass) => {
//             const table = document.getElementById(tableId);
//             const tableHead = table.querySelector('thead');
//             const tableBody = table.querySelector('tbody');
//
//             if (!tableBody || !tableHead)
//                 throw new Error(`Table elements not found for ${tableId}`);
//
//             // Clear existing contents
//             tableHead.innerHTML = '';
//             tableBody.innerHTML = '';
//
//             // Parse CSV data
//             const rows = data.trim().split('\n');
//             const headers = rows[0].split(',').map(h => h.trim());
//
//             // Populate table header with the specified color class
//             const headerRow = document.createElement('tr');
//             headerRow.className = headerClass;  // Add custom class for header row styling
//             headers.forEach(header => {
//                 const th = document.createElement('th');
//                 th.textContent = header;
//                 headerRow.appendChild(th);
//             });
//             tableHead.appendChild(headerRow);
//
//             // Populate table body rows
//             rows.slice(1).forEach(row => {
//                 const columns = row.split(',').map(col => col.trim());
//                 const tr = document.createElement('tr');
//
//                 columns.forEach((col, index) => {
//                     const td = document.createElement('td');
//
//                     if (headers[index] === 'Open-Weight') {
//                         const badge = document.createElement('span');
//                         badge.className = col === "Yes" ? 'badge badge-yes' : 'badge badge-no text-dark';
//                         badge.textContent = col || 'No';
//                         td.appendChild(badge);
//                     } else if (headers[index] === 'Link') {
//                         if (col) {
//                             const link = document.createElement('a');
//                             link.href = col;
//                             link.target = '_blank';
//                             link.className = 'btn btn-link';
//                             link.textContent = 'Visit';
//                             td.appendChild(link);
//                         } else {
//                             td.textContent = 'N/A';
//                         }
//                     } else {
//                         td.textContent = col || 'N/A';
//                     }
//                     tr.appendChild(td);
//                 });
//
//                 tableBody.appendChild(tr);
//             });
//         };
//
//         // Process all three tables with color classes
//         processTable(llmData, 'llm-table', 'table-primary');
//         processTable(lvmData, 'lvm-table', 'table-primary');
//         processTable(t2iData, 't2i-table', 'table-primary');
//     } catch (error) {
//         console.error('Error loading table data:', error);
//     }
// }
//
// // Run the function when DOM is fully loaded
// document.addEventListener('DOMContentLoaded', loadTableData);
//
//
//
// // Function to load all CSV files and render tables
// async function loadTableData() {
//     try {
//         // Load all three CSV files
//         const [llmResponse, lvmResponse, t2iResponse] = await Promise.all([
//             fetch('assets/data/llm-res.csv'),
//         ]);
//
//         // Check if all responses are OK
//         if (!llmResponse.ok || !lvmResponse.ok || !t2iResponse.ok) {
//             throw new Error('Failed to fetch CSV files');
//         }
//
//         // Read the text content from each response
//         const [llmData, lvmData, t2iData] = await Promise.all([
//             llmResponse.text(),
//             lvmResponse.text(),
//             t2iResponse.text()
//         ]);
//
//         // Function to process each table with colored headers
//         const processTable = (data, tableId, headerClass) => {
//             const table = document.getElementById(tableId);
//             const tableHead = table.querySelector('thead');
//             const tableBody = table.querySelector('tbody');
//
//             if (!tableBody || !tableHead) {
//                 throw new Error(`Table elements not found for ${tableId}`);
//             }
//
//             // Clear existing contents
//             tableHead.innerHTML = '';
//             tableBody.innerHTML = '';
//
//             // Parse CSV data
//             const rows = data.trim().split('\n');
//             const headers = rows[0].split(',').map(h => h.trim());
//
//             // Populate table header with the specified color class
//             const headerRow = document.createElement('tr');
//             headerRow.className = headerClass;  // Add custom class for header row styling
//             headers.forEach(header => {
//                 const th = document.createElement('th');
//                 th.textContent = header;
//                 headerRow.appendChild(th);
//             });
//             tableHead.appendChild(headerRow);
//
//             // Populate table body rows
//             rows.slice(1).forEach(row => {
//                 const columns = row.split(',').map(col => col.trim());
//                 const tr = document.createElement('tr');
//
//                 columns.forEach((col, index) => {
//                     const td = document.createElement('td');
//
//
//
//                     td.textContent = col || 'N/A';
//
//                     tr.appendChild(td);
//                 });
//
//                 tableBody.appendChild(tr);
//             });
//         };
//
//         // Process all three tables with color classes
//         processTable(llmData, 'llm-table', 'table-primary');
//         processTable(lvmData, 'lvm-table', 'table-primary');
//         processTable(t2iData, 't2i-table', 'table-primary');
//     } catch (error) {
//         console.error('Error loading table data:', error);
//     }
// }
//
// // Run the function when DOM is fully loaded
// document.addEventListener('DOMContentLoaded', loadTableData);
//
//
//
// // Function to fetch and parse CSV data
// async function loadAndRenderCSV() {
//     try {
//         // Load the CSV file
//         const response = await fetch('assets/data/llm-res.csv');
//         if (!response.ok) throw new Error('Failed to fetch CSV file');
//         const csvData = await response.text();
//
//         // Parse the CSV data
//         const rows = csvData.trim().split('\n');
//         const headers = rows[0].split(',').map(header => header.trim());
//
//         // Convert CSV rows into data objects
//         const data = rows.slice(1).map(row => {
//             const values = row.split(',').map(value => value.trim());
//             return headers.reduce((obj, header, index) => {
//                 obj[header] = values[index];
//                 return obj;
//             }, {});
//         });
//
//         // Render the table with bar effect
//         renderTable(headers, data);
//     } catch (error) {
//         console.error('Error loading CSV data:', error);
//     }
// }
//
// // Function to render the table with header and bar effect
// function renderTable(headers, data) {
//     const table = document.querySelector('#llm-res-table');
//     const tableHead = table.querySelector('thead');
//     const tableBody = table.querySelector('tbody');
//
//     // Clear any existing content
//     tableHead.innerHTML = '';
//     tableBody.innerHTML = '';
//
//     // Create header row
//     const headerRow = document.createElement('tr');
//     headers.forEach(header => {
//         const th = document.createElement('th');
//         th.textContent = header;
//         headerRow.appendChild(th);
//     });
//     tableHead.appendChild(headerRow);
//
//     // Create data rows
//     data.forEach(item => {  // Corrected here to use `data` instead of `rows.slice(1)`
//         const row = document.createElement('tr');
//
//         headers.forEach(key => {
//             const cell = document.createElement('td');
//             cell.className = 'bar-cell';
//
//             if (key === 'Model') {
//                 // If it's the Model column, just add the text
//                 cell.textContent = item[key];
//             } else {
//                 // For score columns, add bar effect and set text
//                 const value = parseFloat(item[key]).toFixed(2);
//                 cell.textContent = value;
//                 cell.style.backgroundSize = `${value}% 100%`; // Adjust background fill based on score
//             }
//
//             row.appendChild(cell);
//         });
//
//         tableBody.appendChild(row);
//     });
// }
//
// // Call the function to load CSV and render table on DOMContentLoaded
// document.addEventListener('DOMContentLoaded', loadAndRenderCSV);
//
//
