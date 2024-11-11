// Function to load a single CSV file
async function loadCSV(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch CSV file from ${url}`);
    return await response.text();
}


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
            const div = document.createElement('div'); // Wrap content in a div

            if (headers[index] === 'Open-Weight') {
                const badge = document.createElement('span');
                badge.className = col === "Yes" ? 'badge badge-yes' : 'badge badge-no text-dark';
                badge.textContent = col || 'No';
                div.appendChild(badge);
            } else if (headers[index] === 'Link') {
                if (col) {
                    const link = document.createElement('a');
                    link.href = col;
                    link.target = '_blank';
                    link.className = 'btn btn-link';
                    link.textContent = 'Visit';
                    div.appendChild(link);
                } else {
                    div.textContent = 'N/A';
                }
            } else {
                div.textContent = col || 'N/A';
            }

            td.appendChild(div); // Add the div to td
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
    console.log(maxWidth)
    return maxWidth + 40; // Add padding/margin (adjust as needed)
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
        const minValues = {
            'llm-res-table': 50,  // Example minimum for t2i-res-table
            'vlm-res-table': 0, // Another example
            't2i-res-table': 10         // Default min if table ID is not in the list
        };
        const min = minValues[tableId] || 0; // Default to 0 if tableId is not found
        const max =  100; // Default max if tableId is not found

        columns.forEach((col, index) => {
            const td = document.createElement('td');

            if (headers[index] === 'Model') {
                // Model column with bold text
                const modelDiv = document.createElement('div');
                modelDiv.classList.add('data-bar-cell');
                modelDiv.style.fontWeight = 'bold'; // Make text bold
                modelDiv.textContent = col || 'N/A';
                td.appendChild(modelDiv);
            } else if (!isNaN(col) && col !== '') {
                // Numeric columns with data bar effect
                const value = parseFloat(col).toFixed(2);

                // Create a container div for the data bar and text
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('data-bar-cell');

                // Text div
                const textDiv = document.createElement('div');
                textDiv.textContent = value;

                // Data bar div
                const dataBar = document.createElement('div');
                dataBar.classList.add('data-bar');
                const widthPercentage = ((value - min) / (max - min)) * 100;
                dataBar.style.width = `${Math.max(0, Math.min(100, widthPercentage))}%`;

                // Append text and data bar to the cell div
                cellDiv.appendChild(textDiv);
                cellDiv.appendChild(dataBar);

                // Append cell div to td
                td.appendChild(cellDiv);
            } else {
                const defaultDiv = document.createElement('div');
                defaultDiv.classList.add('data-bar-cell');
                defaultDiv.textContent = col || 'N/A';
                td.appendChild(defaultDiv);
            }
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });
};

// Invalidate cache if data changes or window resizes
function invalidateModelColumnWidthCache() {
    cachedModelColumnWidth = null;
}

// Function to re-render tables on window resize
function handleResize() {
    invalidateModelColumnWidthCache(); // Reset cached width
    loadTableData(); // Re-render the tables with updated dimensions
}

// Add event listener for window resize
window.addEventListener('resize', handleResize);


// Main function to load and render all tables
async function loadTableData() {
    try {
        // Load CSV data for each table
        const [llmModels, vlmModels, t2iModels] = await Promise.all([
            loadCSV('assets/data/llm.csv'),
            loadCSV('assets/data/vlm.csv'),
            loadCSV('assets/data/t2i.csv'),

        ]);
        const [llmResults, vlmResults, t2iResults] = await Promise.all([
            loadCSV('assets/data/llm-res.csv'),
            loadCSV('assets/data/vlm-res.csv'),
            loadCSV('assets/data/t2i-res.csv'),
        ]);


        // Process and render each table with the loaded data
        processModelTable(llmModels, 'llm-table', 'table-primary');
        processModelTable(vlmModels, 'vlm-table', 'table-primary');
        processModelTable(t2iModels, 't2i-table', 'table-primary');

        processResultsTable(llmResults, 'llm-res-table', );
        processResultsTable(vlmResults, 'vlm-res-table', );
        processResultsTable(t2iResults, 't2i-res-table', );

    } catch (error) {
        console.error('Error loading table data:', error);
    }
}

// Run the function when DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadTableData);

