// // var XLSX = require("xlsx");
// const multer = require("multer");

// const upload = multer();


// router.post("/file", upload.single("file"), (req, res) => {
//     const file = req.file; // Access the uploaded file
//     if (!file) {
//         return res.status(400).send("No file uploaded.");
//     }

//     try {
//         var workbook = XLSX.read(file.buffer, { type: "buffer" });
//         var worksheet = workbook.Sheets[workbook.SheetNames[0]]
//         console.log(workbook.SheetNames[0]); // Example: Log sheet names
//         const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Example: Log sheet names
//         // console.log(data)
//         const header = data[0];  // Extract the headers

//         // Convert to an object of objects
//         const result = data.slice(1).reduce((acc, row) => {
//             const obj = {};
//             header.forEach((header, index) => {
//                 obj[header] = row[index];
//             });
//             acc[row[0]] = obj; // Use the first column value as the key
//             return acc;
//         }, {});

//         const resultArray = Object.values(result);
//         var newWorksheet = XLSX.utils.json_to_sheet(resultArray);
//         var newWorkbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Dates");
//         const buffer = XLSX.write(newWorkbook, { type: "buffer", bookType: "xlsx" });



//         // Set headers for file download
//         res.setHeader("Content-Disposition", "attachment; filename=dates.xlsx");
//         res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");


//         // Send the buffer as a response
//         res.send(buffer);
//     } catch (error) {
//         console.error("Error reading the file:", error.message);
//         res.status(500).send("Failed to process the file.");
//     }
// });
// router.get("/file", (req, res) => {
//     const rows = [
//         { Date: "2024-01-01", Event: "New Year" },
//         { Date: "2024-12-25", Event: "Christmas" },
//     ];

//     const worksheet = XLSX.utils.json_to_sheet(rows);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
//     const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

//     // Set headers for file download
//     res.setHeader("Content-Disposition", "attachment; filename=dates.xlsx");
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

//     // Send the buffer as a response
//     res.send(buffer);


// })
