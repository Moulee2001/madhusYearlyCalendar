// Define a function to fetch records
function fetchRecords() {
    return ZOHO.CREATOR.init()
        .then(function (data) {
            var config = {
                appName: "madhus",
                reportName: "Booking_Report"
            };
            // Return the promise chain
            return ZOHO.CREATOR.API.getAllRecords(config);
        })
        .then(function (response) {
            var recordArr = response.data;
            return recordArr; // Return the record array
        })
        .catch(function (error) {
            console.error('Error fetching records:', error);
            return []; // Return an empty array if there's an error
        });
}
