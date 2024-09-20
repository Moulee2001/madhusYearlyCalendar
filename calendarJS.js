function createCalendar(year, selectBookingVal) {
  DataVal = FinalBookinglist;

  if (selectBookingVal != null && selectBookingVal != "") {
    function searchByBookingStatusID(id) {
      return FinalBookinglist.filter(item => item.Booking_Status.ID === id);
    }
    var result = searchByBookingStatusID(selectBookingVal);
    DataVal = result;
  }

  calendarBody.innerHTML = '';
  const tbody = document.getElementById('calendar-body');

  monthNames.forEach((month, index) => {
    const firstDay = new Date(year, index, 1).getDay();
    const getFirstDayOfMonthName = (year, monthIndex) => new Date(year, monthIndex, 1).toLocaleString('en-US', { weekday: 'short' });
    var DayofDate = getFirstDayOfMonthName(year, index);
    const totalDays = new Date(year, index + 1, 0).getDate();
    const row = document.createElement('tr');

    // Adding month name in the first column
    const monthCell = document.createElement('td');
    monthCell.classList.add('month-name');
    monthCell.textContent = month;
    row.appendChild(monthCell);

    const findFirstIndex = day => daysOfWeek.indexOf(day);
    // console.log('First Sunday Index:', findFirstIndex(DayofDate)); // Output: 1
    var spvar = findFirstIndex(DayofDate);

    let cells = Array(37).fill(''); // Creates an array for 37 cells filled with empty string after the month name

    // Adjusting the first day to align with the fixed daysOfWeek array
    for (let day = 1, cellIndex = spvar; day <= totalDays; day++, cellIndex++) {
      cells[cellIndex] = day; // Place the day in the correct column
    }
    var rowcount = 1;
    cells.forEach((cellContent, i) => {
      const cell = document.createElement('td');
      cell.textContent = cellContent;
      cell.className = "cell_values";
      if (cellContent) {
        // console.log("rowcount:",rowcount)
        const dateObject = new Date(year, index, cellContent);
        var dateval = formatDate(dateObject);
        let outputDate = convertDateFormat(dateval);
        cell.setAttribute("dateval", outputDate);
        cell.setAttribute("isEmpty", "false");

        function searchByDateOfBooking(date) {
          return DataVal.filter(item => item.Date_of_Booking === date);
        }
        const result = searchByDateOfBooking(outputDate);

        // console.log("result test", result[0]);

        if (result.length > 0) {
          if (result[0].Notes) {
            const markSpan = document.createElement("span");
            markSpan.classList.add("note-mark");
            cell.appendChild(markSpan);
            cell.setAttribute('data-tip', result[0].Notes);
            cell.addEventListener('mouseenter', function (event) { showTooltip(event, result[0]); });
            cell.addEventListener('mouseleave', hideTooltip);
          }

          if (VenueIDData == "") {
            VenueIDData = result[0].Venue.ID;
            VenueNameData = result[0].Venue.display_value;
            SuiteIDData = result[0].Suite.ID;
            SuiteNameData = result[0].Suite.display_value;
          }
          cell.setAttribute("isdataexist", "true");
          // cell.setAttribute("rowcount",month+"-"+i);
          cell.style.backgroundColor = result[0]["Booking_Status.Color"];

          for (let i = 1; i < result.length; i++) {
            if (result[i - 1].Booking_Status.display_value === "Cancelled" || result[i - 1].Booking_Status.display_value === "Released") {
              cell.style.backgroundColor = result[i]["Booking_Status.Color"];
            }
          }

          for (let i = 0; i < result.length; i++) {

          }

          if (result.length >= 2 && result[1].Notes) {
            const markSpan1 = document.createElement("span");
            markSpan1.classList.add("note-mark-bottom-right");
            cell.appendChild(markSpan1);
          }

          if (result.length >= 3 && result[2].Notes) {
            const markSpan2 = document.createElement("span");
            markSpan2.classList.add("note-mark-bottom-left");
            cell.appendChild(markSpan2);
          }

          if (result.length >= 4 && result[3].Notes) {
            const markSpan3 = document.createElement("span");
            markSpan3.classList.add("note-mark-top-left");
            cell.appendChild(markSpan3);
          }

          cell.id = "cell_id";
        }
        else {
          cell.setAttribute("isdataexist", "false");
        }

        cell.setAttribute("rowcount", month + "_" + rowcount);
        rowcount += 1;
      }
      else {
        cell.setAttribute("dateval", "NaN-Values");
        cell.setAttribute("isEmpty", "true");
      }

      // Apply weekend style if column index corresponds to Saturday or Sunday
      if ([0, 1, 7, 8, 14, 15, 21, 22, 28, 29, 35, 36].includes(i)) {
        cell.classList.add('weekend');
      }
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });

  document.querySelectorAll('.cell_values').forEach(cell => {
    cell.addEventListener('click', function () {
      if (bulkSelectEnabled) {
        const dateval = cell.getAttribute('dateval');
        if (dateval !== "NaN-Values") {
          if (!selectedDates.includes(dateval)) {
            selectedDates.push(dateval);
            cell.classList.add('selected');
          } else {
            const index = selectedDates.indexOf(dateval);
            selectedDates.splice(index, 1);
            cell.classList.remove('selected');
          }
          // Log the updated selectedDates array
          // console.log('Selected Dates:', selectedDates);
        }
      } else {
        bulkSelectEnabled = false;
        selectedDates.length = 0;
        // Popup logic can be added here if bulkSelectEnabled is false
      }
    });
  });

  // Listener for double-click event to handle popup
  document.querySelectorAll('.cell_values').forEach(cell => {
    cell.addEventListener('dblclick', function () {
      if (!bulkSelectEnabled && !cell.classList.contains('selected')) {
        const dateval = cell.getAttribute('dateval');
        if (dateval !== "NaN-Values") {
        }
      }
    });
  });
}

function showTooltip(event, result) {
  const $element = $(event.currentTarget);
  const tooltipSalesPerson = result['Sales_person'];
  const tooltipEnquiryReferenceNumber = result['Enquiry_Reference'];
  const tooltipContactName = result['Contact'].display_value;
  const tooltipSuite = result['Suite'].display_value;
  const tooltipText = result['Notes'];
  const tooltipStatus = result['Booking_Status'].display_value;

  if (!tooltipSalesPerson && !tooltipEnquiryReferenceNumber && !tooltipContactName && !tooltipText) return;

  const tooltipNotes = `<div class="tooltip-content">
<div class="tooltip-item"><strong>Sales Person:</strong> ${tooltipSalesPerson}</div>
<div class="tooltip-item"><strong>Enquiry Reference Number:</strong> ${tooltipEnquiryReferenceNumber}</div>
<div class="tooltip-item"><strong>Client Name:</strong> ${tooltipContactName}</div>
<div class="tooltip-item"><strong>Suite Name:</strong> ${tooltipSuite}</div>
<div class="tooltip-item"><strong>Status:</strong> ${tooltipStatus}</div>
<div class="tooltip-item"><strong>Notes:</strong> ${tooltipText}</div>
</div>`;

  $element.tooltip('dispose');
  $element.attr('data-bs-toggle', 'tooltip');
  $element.attr('data-bs-html', 'true');
  $element.attr('title', tooltipNotes);

  $element.tooltip('show');
}

function hideTooltip(event) {
  const $element = $(event.currentTarget);
  $element.tooltip('dispose');
}

