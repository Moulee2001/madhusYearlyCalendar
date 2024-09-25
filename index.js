const daysOfWeek = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const calendarBody = document.getElementById('calendar-body');
const yearSelect = document.getElementById('year-select');
const daysOfWeekHeader = document.getElementById('days-of-week-header');
const currentYear = new Date().getFullYear();

var VenueNameData = "";
var VenueIDData = "";
var SuiteNameData = "";
var SuiteIDData = "";

var BookingDataExist = false;
var BookingDataExistList = [];
UpdateSectionList=[];

var FinalBookinglist = [];

var EmailTemplate_List = [];
$(document).ready(function () {

  ZOHO.CREATOR.init().then(function (data) {
    console.log("Zoho Page loaded");

    const queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
    // console.log("queryParams",queryParams);
    BookingRecords_Func();
    EmailTemplate_List_Func();
    SalesOppRecords_Func();
    fetchRagamamaDates();
    fetchMadhuDates();
    if (FinalBookinglist.length == 0) {
      fetchRecordsFunc("").then(ReturnVal => {
        // console.log("ReturnVal New:", ReturnVal);

        FinalBookinglist = ReturnVal;
        // console.log("FinalBookinglist:", FinalBookinglist);
        // console.log(firstSuiteAndVenue);
        var venueHeader = "test Suite";
        var suiteHeader ="BEAUMONT ESTATE";
        $(".venueheader p").text(venueHeader);
        $(".suiteheader p").text(suiteHeader);


        // console.log("venueHeader:", venueHeader, " suiteHeader: ", suiteHeader);
        createCalendar(currentYear, "");
      });
    }
    else {
      createCalendar(currentYear, "");
    }

  });

  daysOfWeekHeader.innerHTML = '<th class="label" >Month</th>';
  daysOfWeek.forEach(day => {
    const th = document.createElement('th');
    th.textContent = day;
    th.className = "week-header";
    daysOfWeekHeader.appendChild(th);
  });

  // Generate year options from 5 years before current year to 10 years after
  const startYear = currentYear - 5;
  const endYear = currentYear + 10;

  // Append the year options to the select element
  for (let year = startYear; year <= endYear; year++) {
    const option = $('<option></option>').val(year).text(year);
    // Set the current year as the default selected option
    if (year === currentYear) {
      option.attr('selected', 'selected');
    }
    $('#year-select').append(option);
  }

  // Initialize the calendar with the default year (2024)
  // createCalendar(currentYear,"");



  $('#newBtn').on('click', function () {

    $("#booking-price-per-bedroom_new").prop("disabled", true);
    $("#booking-mandatory-bedrooms_new").prop("disabled", true);
    $("#booking-status_new").empty();
    function searchTableCells(rowCount) {
      return $(`td[rowcount="${rowCount}"]`).first();
    }
    // console.log("BookingDataExistList:", BookingDataExistList);
    $("#newBtn").css("display", "none");
    $('.custom-indicator-container').css('display', 'none')
    $('#formContainer').addClass('active-container');
    $('#carouselContainer').removeClass('active-container');
    $('#newBtn').addClass('btn-info').removeClass('btn-primary');
    $('#existBtn').addClass('btn-secondary').removeClass('btn-info');

    const matchingCells = searchTableCells($("#cellDataID").val());
    // console.log("matchingCells:", matchingCells.attr("dateval"));

    $('#venue_new').append($('<option>', {
      value: VenueIDData,
      text: VenueNameData
    }));

    $('#suite_new').append($('<option>', {
      value: SuiteIDData,
      text: SuiteNameData
    }));

    $("#booking-date_new").val(matchingCells.attr("dateval"));

    var selectoption = "<option value='0' selected disabled>Select</option>";
    // var SalesOppOptions="<option value='0' selected disabled>Select</option>";
    $("#booking-status_new").append(selectoption);
    BookingStatusList.forEach(bookingelement => {
      $('#booking-status_new').append($('<option>', {
        value: bookingelement.recID,
        text: bookingelement.bookingName
      }));
    });
    // var SalesOppOptions = "<option value='0' selected disabled>Select</option>";
    // $('#booking-sales-opportunity_new').append(SalesOppOptions);
    // SalesOppList.forEach(salesOppelement => {
    //   $('#booking-sales-opportunity_new').append($('<option>', {
    //     value: salesOppelement.CRM_ID,
    //     text: salesOppelement.Sales_Opportunity
    //   }));
    // });

    function initializeDropdown() {
      // Clear existing options
      $("#booking-sales-opportunity_new").empty();

      // Add the default option
      var SalesOppOptions = "<option value='0' selected disabled>Select</option>";
      $("#booking-sales-opportunity_new").append(SalesOppOptions);

      // Populate the dropdown with options
      SalesOppList.forEach(salesOppelement => {
        $('#booking-sales-opportunity_new').append($('<option>', {
          value: salesOppelement.CRM_ID,
          text: salesOppelement.Sales_Opportunity
        }));
      });

      // Handle search input manually (optional if using Select2)
      $('#dropdownSearch').on('keyup', function () {
        var searchTerm = $(this).val().toLowerCase();
        $('#booking-sales-opportunity_new option').each(function () {
          var optionText = $(this).text().toLowerCase();
          if (optionText.includes(searchTerm)) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      });

      // Initialize Select2 on the sales opportunity dropdown
      $('#booking-sales-opportunity_new').select2({
        placeholder: 'Select',
        allowClear: false,
        dropdownParent: $('#booking-sales-opportunity_new').parent() // Ensures dropdown appears in the correct place
      });
    }

    // Call the function to initialize
    initializeDropdown();


    if (BookingDataExistList.length > 0) {
      $(".bedroom_section").removeClass("d-none");
      $(".bedroomprice_section").removeClass("d-none");

      $("#booking-mandatory-bedrooms_new").val(BookingDataExistList[0].Mandatory_Bedrooms || "");
      $("#booking-price-per-bedroom_new").val(BookingDataExistList[0].Price_Per_Bedroom || "");
    }
    else {
      $(".bedroom_section").addClass("d-none");
      $(".bedroomprice_section").addClass("d-none");
    }
  });

  $('#existBtn').on('click', function () {
    $('.custom-indicator-container').css('display', 'block');
    $('.custom-indicator-container').css('display', 'flex');
    $('#formContainer').removeClass('active-container');
    $('#carouselContainer').addClass('active-container');
    $('#newBtn').addClass('btn-secondary').removeClass('btn-info');
    $('#existBtn').addClass('btn-info').removeClass('btn-primary');
  });

  // $('#carouselExample').on('slid.bs.carousel', function () {
  //   var totalSlides2 = $('#carouselExample .carousel-item').length;
  //   var currentSlide = $('#carouselExample .carousel-item.active').index() + 1;
  //   $indicator.text(currentSlide + ' of ' + totalSlides2);
  //   console.log(totalSlides2,currentSlide);
  // });
  

  // Set initial indicator
  // $indicator.text('1 of ' + totalSlides);

  // $('#prevBtn').on('click', function () {
  //   $('#carouselExample').carousel('prev');
  // });

  // // Custom Next Button
  // $('#nextBtn').on('click', function () {
  //   $('#carouselExample').carousel('next');
  // });

  $(document).on('change', "#year-select,#filter-dropdown ", function () {

    const selectedYear = parseInt($("#year-select").val());
    var statusrecord = $("#filter-dropdown option:selected").val();
    var StatusOptions = $(".filter-status-select").select2('data');
    // console.log("StatusOptions:",StatusOptions)
    var OptionValues = StatusOptions.map(function (option) {
      return { bookingstatus: option.element.value };
    });

    // console.log("statusrecord:", OptionValues);
    if (statusrecord == 0) {
      statusrecord = null;
    }
    createCalendar(selectedYear, OptionValues);
  });

  $(document).on('click', ".cell_values", function () {
    // console.log("cell values clicked");
    UpdateSectionList = [];
    BookingDataExistList.length = 0;
    $(".carousel-indicators").empty();
    $("#suite_new,#venue_new").empty();
    $("#email_template_new").val(0);
    $('#flexCheckDefault').prop('checked', false);
    $("#emailtemplatesection,#emailtemplatesection1").removeClass("d-block").addClass("d-none");

    // $("#booking-status_new").find('option').not(':first').remove();
    // $("#booking-sales-opportunity_new").find('option').not(':first').remove();
    $("#booking-status_new").empty();
    $("#booking-sales-opportunity_new").empty();
    $(".carousel-inner").empty();
    var cellDataID = $(this).attr("rowcount");
    var isdataexistData = $(this).attr("isdataexist");
    var isEmpty = $(this).attr("isempty");
    var dateVal = $(this).attr("dateval");
    // console.log("isdataexistData", isdataexistData);
    $("#cellDataID").val(cellDataID);
    if (isEmpty != "true") {
      if (isdataexistData == "true") {
        const searchByCriteria = (bookingStatusID, venueID, suiteID, Date_of_Booking) => FinalBookinglist.filter(item => item.Booking_Status.display_value === bookingStatusID && item.Venue.ID === venueID && item.Date_of_Booking === Date_of_Booking && item.Suite.ID === suiteID);


        $("#existBtn").css("display", "none");
        $("#newBtn").css("display", "block");
        $('.custom-indicator-container').css('display', 'block');
        $('.custom-indicator-container').css('display', 'flex');

        $('#formContainer').removeClass('active-container');
        $('#carouselContainer').addClass('active-container');
        $('#newBtn').addClass('btn-secondary').removeClass('btn-info');
        $('#existBtn').addClass('btn-info').removeClass('btn-primary');

        // Record exist
        function searchByDateOfBooking(date) {
          return FinalBookinglist.filter(item => item.Date_of_Booking === date);
        }
        const result = searchByDateOfBooking(dateVal);
        // console.log("resulttest:", result);
        for (let k = 0; k < result.length; k++) {

          var Enquiry_Reference = result[k].Enquiry_Reference || "";
          var total_Number = result[k].Number_of_Guests || "";
          var contact = result[k].Contact;
          if (contact) {
            contact = contact.display_value;
          }
          var SuiteTemp = result[k].Suite;
          var SuiteName = SuiteTemp.display_value;
          var SuiteID = SuiteTemp.ID;

          var VenueTemp = result[k].Venue;
          var VenueName = VenueTemp.display_value;
          var VenueID = VenueTemp.ID;

          const results = searchByCriteria('Madhus Provisional', VenueID, SuiteID, dateVal);
          // console.log("results-for-sp:", results)
          if (results.length > 0 && BookingDataExistList.length == 0) {
            BookingDataExistList = BookingDataExistList.concat(results);
          }

          var bookingTemp = result[k].Booking_Status;
          var bookingStatusName = bookingTemp.display_value;
          var bookingStatusID = bookingTemp.ID;

          var Sales_person = result[k].Sales_person;
          var salesOpp = result[k].Sales_Opportunities;
          var salesOppName = "";
          var salesOppID = "";

          var contactAttrID = "";

          if (salesOpp) {
            salesOppName = salesOpp.display_value;
            salesOppID = salesOpp.ID;
            // console.log("salesOppID:", salesOppID)

            const result = searchBySalesOpp(salesOppID);
            // console.log("resultData", result);
            var resultData = result[0];
            var total_Number = resultData.Number_of || "";
            var Sales_person = resultData.Sales_Person_Name || resultData.Sales_Person || "";
            // console.log("sales : ",resultData.Sales_person)


          }
          // console.log("salesOppID:", salesOppID)
          var RecordID = result[k].ID || "";
          var mandatoryBedRoom = result[k].Mandatory_Bedrooms || "";
          var priceperBedroom = result[k].Price_Per_Bedroom || "";
          var notes = result[k].Notes || "";
          var Date_of_Booking = result[k].Date_of_Booking || "";
          var selectoption = "<option value='0' selected disabled>Select</option>";
          // var SalesOppOptions="<option value='0' selected disabled>Select</option>";
          // $("#booking-sales-opportunity_new").append(SalesOppOptions);
          BookingStatusList.forEach(bookingelement => {
            if (bookingelement.recID == bookingStatusID) {
              selectoption += '<option value="' + bookingelement.recID + '" selected>' + bookingelement.bookingName + '</option>';
            }
            else {
              selectoption += '<option value="' + bookingelement.recID + '">' + bookingelement.bookingName + '</option>';
            }
          });

          var SalesOppOptions = "<option value='0' selected disabled>Select</option>";
          // $("#booking-sales-opportunity_new").append(SalesOppOptions);
          SalesOppList.forEach(salesOppelement => {
            // console.log("salesOppelement:",salesOppelement.CRM_ID)
            if (salesOppelement.CRM_ID == salesOppID) {
              SalesOppOptions += '<option value="' + salesOppelement.CRM_ID + '" selected>' + salesOppelement.Sales_Opportunity + '</option>';
            }
            else {
              SalesOppOptions += '<option value="' + salesOppelement.CRM_ID + '">' + salesOppelement.Sales_Opportunity + '</option>';
            }
          });

          var inform_to_hotel = "";
          var displayproperty_email = "d-none";
          if (result[k].Inform_to_Hotel == "true") {
            displayproperty_email = "d-block";
            inform_to_hotel = "checked";
          }

          var Email_Template = result[k].Email_Template;
          var TemplateOptions = "<option value='0' selected disabled>Select</option>";
          if (Email_Template) {
            EmailTemplate_List.forEach(tempelement => {
              if (tempelement.recid == Email_Template.ID) {
                TemplateOptions += '<option value="' + tempelement.recid + '" selected>' + tempelement.Template_Name + '</option>';
              }
              else {
                TemplateOptions += '<option value="' + tempelement.recid + '">' + tempelement.Template_Name + '</option>';
              }
            });
          }
          else {
            // console.log("*******", EmailTemplate_List)
            EmailTemplate_List.forEach(tempelement => {
              TemplateOptions += '<option value="' + tempelement.recid + '">' + tempelement.Template_Name + '</option>';
            });
          }

          UpdateSectionList.push({
            "SuiteID":SuiteID,
            "VenueID":VenueID,
            "Date_of_Booking":Date_of_Booking,
            "bookingStatusID":bookingStatusID,
            "RecordID":RecordID
          });

          var carouselClass = k === 0 ? 'active' : '';
          // var carouselClass ='active' ;
          var carouselDom = `<div class="carousel-item ${carouselClass}"><div class="row mb-2">
            <div class="col-4" style="font-size: 15px;">
              Venue:
            </div>
            <div class="col-8">
              <select id="venue-1" name="venue-1" class="form-control form-control-sm" disabled>
                <option value="${VenueID}">${VenueName}</option>
              </select>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4" style="font-size: 15px;">
              Suites:
            </div>
            <div class="col-8">
              <select id="suites-1" name="suites-1" class="form-control form-control-sm" disabled>
                <option value="${SuiteID}">${SuiteName}</option>
              </select>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4" style="font-size: 15px;">
              Booking Date:
            </div>
            <div class="col-8">
              <input type="text" class="form-control form-control-sm" id="booking-date-1" name="booking-date-1" value="${Date_of_Booking}" disabled>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4" style="font-size: 15px;">
              Booking Status:
            </div>
            <div class="col-8">
              <select id="booking-status-1" class="form-control form-control-sm" name="booking-status-1">
                ${selectoption}
            </select>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4" style="font-size: 15px;">
              Sales Opportunity:
            </div>
            <div class="col-8">
              <select id="booking-sales-opportunity-1" class="form-control form-control-sm" name="booking-sales-opportunity-1">
                ${SalesOppOptions}
              </select>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4" style="font-size: 15px;">
              Sales Person:
            </div>
            <div class="col-8">
              <input type="text" class="form-control form-control-sm" id="booking-sales-person-1" name="booking-sales-person-1" value="${Sales_person}" disabled>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4" style="font-size: 15px;">
              Enquiry Reference:
            </div>
            <div class="col-8">
              <input type="text" class="form-control form-control-sm" id="booking-Enquiry-Reference-1" name="booking-Enquiry-Reference-1" value="${Enquiry_Reference}" disabled>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4" style="font-size: 15px;">
              Total Number of Guests:
            </div>
            <div class="col-8">
              <input type="text" class="form-control form-control-sm" id="booking-total-number-of-guests-1" name="booking-total-number-of-guests-1" value="${total_Number}" disabled>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4" style="font-size: 15px;">
              Contact:
            </div>
            <div class="col-8">
              <input type="text" id="booking-contact-1" class="form-control form-control-sm" name="booking-contact-1" value="${contact}" contact_id='${contactAttrID}' disabled>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4" style="font-size: 15px;">
              Mandatory Bedrooms:
            </div>
            <div class="col-8">
              <input type="number" class="form-control form-control-sm" id="booking-mandatory-bedrooms-1" name="booking-mandatory-bedrooms-1" value="${mandatoryBedRoom}">
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4" style="font-size: 15px;">
              Price Per Bedroom:
            </div>
            <div class="col-8">
              <input id="booking-price-per-bedroom-1" class="form-control form-control-sm" type="text" value="${priceperBedroom}">
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-5" style="font-size: 15px;">
                <!-- Inform Hotel (Email): -->
            </div>
            <div class="col-7">
                <div class="form-check" style="padding-left: 0;">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" ${inform_to_hotel}>
                    <label class="form-check-label" for="flexCheckDefault" >
                      Inform to Hotel
                    </label>
                </div>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-4 ${displayproperty_email}" style="font-size: 15px;" id="emailtemplatesection">
              Email Template:
            </div>
            <div class="col-8 ${displayproperty_email}" id="emailtemplatesection1">
              <select id="email_template-1" class="form-control form-control-sm"
                name="email_template-1" >
                ${TemplateOptions}
              </select>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-4" style="font-size: 15px;">
              Notes:
            </div>
            <div class="col-8">
              <textarea id="booking-notes-1" class="form-control booking-notes" id="exampleFormControlTextarea1" rows="3" style="border: 1px solid #ced4da;">${notes}</textarea>
            </div>
          </div>
          <div class="row mb-2" hidden>
            <div class="col-4" style="font-size: 15px;">
              RecordID:
            </div>
            <div class="col-8" disabled>
              <input id="existing_recordID" class="form-control form-control-sm" type="text" value="${RecordID}" disabled> 
            </div>
          </div>
          </div>`;

          $(".carousel-inner").append(carouselDom);


          let activeClass = k === 0 ? ' class="active"' : '';
          $(".carousel-indicators").append('<li data-target="#carouselExample" data-slide-to="' + k + '" ' + activeClass + '></li>');

        }

        $(document).on('change', '.carousel-inner .carousel-item select[id^="booking-status-"]', function () {
          var activeSlide = $(this).closest('.carousel-item');
          var selectedStatusText = $(this).find("option:selected").text().trim();

          if (selectedStatusText === 'Madhus Provisional') {
            activeSlide.find("input[id^='booking-mandatory-bedrooms-']").prop("disabled", false);
            activeSlide.find("input[id^='booking-price-per-bedroom-']").prop("disabled", false);
          } else {
            activeSlide.find("input[id^='booking-mandatory-bedrooms-']").prop("disabled", true);
            activeSlide.find("input[id^='booking-price-per-bedroom-']").prop("disabled", true);
          }
        });

        $(document).ready(function () {
          $(document).find('.carousel-inner .carousel-item select[id^="booking-status-"]').trigger('change');
        });

        $(document).ready(function () {

          function initializeSelect2(element) {
            if (!element.hasClass('select2-hidden-accessible')) {
              element.select2({
                placeholder: 'Select',
                allowClear: false,
                dropdownParent: element.closest('.carousel-item').parent()
              });
              // console.log('Select2 initialized for:', element.attr('id'));
            }
          }


          $(document).on('click', '.carousel-inner .carousel-item select[id^="booking-sales-opportunity-"]', function (e) {
            e.preventDefault();
            var $this = $(this);

            if (!$this.hasClass('select2-hidden-accessible')) {
              initializeSelect2($this);
            }

            // Open the Select2 dropdown
            $this.select2('open');
          });

          // Handle search functionality for dropdowns
          $(document).on('keyup', 'input[id^="dropdownSearch-"]', function () {
            var searchTerm = $(this).val().toLowerCase();
            var relatedSelect = $(this).next('select');

            relatedSelect.find('option').each(function () {
              var optionText = $(this).text().toLowerCase();
              if (optionText.includes(searchTerm)) {
                $(this).show();
              } else {
                $(this).hide();
              }
            });

            relatedSelect.select2('destroy').select2({
              placeholder: 'Select',
              allowClear: true,
              dropdownParent: relatedSelect.closest('.carousel-item').parent()
            }).select2('open');
          });
        });

      }
      else {
        // No Record Exists
        $("#existBtn").css("display", "none");
        $("#newBtn").css("display", "none");
        $('.custom-indicator-container').css('display', 'none');
        $('#formContainer').addClass('active-container');
        $('#carouselContainer').removeClass('active-container');
        $('#newBtn').addClass('btn-info').removeClass('btn-primary');
        $('#existBtn').addClass('btn-secondary').removeClass('btn-info');

        // console.log("VenueNameData: " + VenueNameData + " VenueIDData: " + VenueIDData + " SuiteNameDate: " + SuiteNameData + " SuiteIDDate:" + SuiteIDData)

        $('#venue_new').append($('<option>', {
          value: VenueIDData,
          text: VenueNameData
        }));

        $('#suite_new').append($('<option>', {
          value: SuiteIDData,
          text: SuiteNameData
        }));

        $("#booking-date_new").val(dateVal);
        var BookingStatus = "<option value='0' selected disabled>Select</option>";
        $("#booking-status_new").append(BookingStatus);
        BookingStatusList.forEach(bookingelement => {
          $('#booking-status_new').append($('<option>', {
            value: bookingelement.recID,
            text: bookingelement.bookingName
          }));
        });

        $(document).ready(function () {
          function initializeDropdown() {
            // Clear existing options
            $("#booking-sales-opportunity_new").empty();

            // Add the default option
            var SalesOppOptions = "<option value='0' selected disabled>Select</option>";
            $("#booking-sales-opportunity_new").append(SalesOppOptions);

            // Populate the dropdown with options
            SalesOppList.forEach(salesOppelement => {
              $('#booking-sales-opportunity_new').append($('<option>', {
                value: salesOppelement.CRM_ID,
                text: salesOppelement.Sales_Opportunity
              }));
            });

            // Handle search input manually (optional if using Select2)
            $('#dropdownSearch').on('keyup', function () {
              var searchTerm = $(this).val().toLowerCase();
              $('#booking-sales-opportunity_new option').each(function () {
                var optionText = $(this).text().toLowerCase();
                if (optionText.includes(searchTerm)) {
                  $(this).show();
                } else {
                  $(this).hide();
                }
              });
            });

            // Initialize Select2 on the sales opportunity dropdown
            $('#booking-sales-opportunity_new').select2({
              placeholder: 'Select',
              allowClear: false,
              dropdownParent: $('#booking-sales-opportunity_new').parent() // Ensures dropdown appears in the correct place
            });
          }

          // Call the function to initialize
          initializeDropdown();
        });


        // var SalesOppOptions = "<option value='0' selected disabled>Select</option>";
        // $("#booking-sales-opportunity_new").append(SalesOppOptions);
        // SalesOppList.forEach(salesOppelement => {
        //   $('#booking-sales-opportunity_new').append($('<option>', {
        //     value: salesOppelement.CRM_ID,
        //     text: salesOppelement.Sales_Opportunity
        //   }));
        // });
      }
      var $carousel = $('#carouselExample');
      var $indicator = $('#carouselIndicator');
      var totalSlides = $('#carouselExample .carousel-item').length;
      const liElements = document.querySelectorAll('.carousel-indicators li');
      var currentSlide = $('#carouselExample .carousel-item.active').index() + 1;
      $indicator.text(1 + ' of ' + totalSlides);

  // Add click event listeners to each <li> element
    liElements.forEach((li, index) => {
      li.addEventListener('click', () => {
        // console.log(`Clicked on slide ${index + 1}`);
        $indicator.text(index+1 + ' of ' + totalSlides);
        // console.log(index,totalSlides);
        // You can add any logic here, like switching the carousel slide
      });
    });
      // $('#carouselModal').modal('show');
      if (bulkSelectEnabled) {
        $('#carouselModal').modal('hide');
        $('.cell_values').on('dblclick', function () {
          $("#booking-status_new option").filter(function () {
            return $(this).text() === "Madhus Provisional"; // Replace "Option Text" with the text you want to match
          }).prop('selected', true).parent().trigger('change');
          $('#carouselModal').modal('show');
        });
      }
      else {
        $('#carouselModal').modal('show');
      }
    }
  });

  $(document).on("change", "#booking-status_new", function () {
    // console.log("BookingDataExist:", BookingDataExist);
    var bookingStatusval = $("#booking-status_new option:selected").val();
    var bookingStatusText = $("#booking-status_new option:selected").text();
    // console.log("bookingStatusval: " + bookingStatusval + " bookingStatusText: " + bookingStatusText)
    if (BookingDataExistList.length == 0) {
      if (bookingStatusText == "Madhus Provisional") {
        $("#booking-price-per-bedroom_new").prop("disabled", false);
        $("#booking-mandatory-bedrooms_new").prop("disabled", false);
        $(".bedroom_section").removeClass("d-none");
        $(".bedroomprice_section").removeClass("d-none");
      }
      else {
        $("#booking-price-per-bedroom_new").prop("disabled", true);
        $("#booking-mandatory-bedrooms_new").prop("disabled", true);
        $(".bedroom_section").addClass("d-none");
        $(".bedroomprice_section").addClass("d-none");
      }
    }
    else {
      if (bookingStatusText == "Madhus Provisional") {
        $("#booking-price-per-bedroom_new").prop("disabled", false);
        $("#booking-mandatory-bedrooms_new").prop("disabled", false);
      }
      else {
        $("#booking-price-per-bedroom_new").prop("disabled", true);
        $("#booking-mandatory-bedrooms_new").prop("disabled", true);
      }
    }
  });

  $(document).on('change', "#booking-sales-opportunity_new", function () {
    var selectedval = $(this).val();
    // console.log("selectedval:", selectedval)
    if (selectedval != 0) {
      const result = searchBySalesOpp(selectedval);
      // console.log("result00", result);
      var resultData = result[0];
      var Sales_Person = resultData.Sales_Person || "";
      var Contact = resultData.Contact || "";
      var Enquiry_Reference = resultData.Enquiry_Reference || "";
      var total_Number = resultData.Number_of || "";
      var contactID = resultData.Contact_ID || "";

      $("#booking-sales-person_new").val(Sales_Person);
      $("#booking-Enquiry-Reference_new").val(Enquiry_Reference);
      $("#booking-total-number-of-guests_new").val(total_Number);
      $("#booking-contact_new").val(Contact);
      $("#booking-contact_new").attr("contact_id", contactID);

    }
  });

  $(document).on('change', "#booking-sales-opportunity-1", function () {
    // console.log("***** carousel", SalesOppList);
    // var selectedval=$(this).find("option:selected").val();
    var activeSlide = $('.carousel-inner .carousel-item.active');
    var selectedval = activeSlide.find('#booking-sales-opportunity-1 option:selected').val();
    var selectedtext = activeSlide.find('#booking-sales-opportunity-1 option:selected').text();
    // console.log("selectedval:", selectedval);
    if (selectedval != 0) {
      function searchBySalesOpp(value) {
        return SalesOppList.filter(item => item.CRM_ID === value);
      }
      const result = searchBySalesOpp(selectedval);
      // console.log("result", result);
      var resultData = result[0];
      var Sales_Person = resultData.Sales_Person || "";
      var Contact = resultData.Contact || "";
      var Enquiry_Reference = resultData.Enquiry_Reference || "";
      var total_Number = resultData.Number_of || "";
      var contactID = resultData.Contact_ID || "";

      activeSlide.find("#booking-sales-person-1").val(Sales_Person);
      activeSlide.find("#booking-Enquiry-Reference-1").val(Enquiry_Reference);
      activeSlide.find("#booking-total-number-of-guests-1").val(total_Number);
      activeSlide.find("#booking-contact-1").val(Contact);
      activeSlide.find("#booking-contact-1").attr("contact_id", contactID);
    }
  });

  $(document).on("change", "#flexCheckDefault", function () {
    if ($(this).prop("checked")) {
      $("#emailtemplatesection,#emailtemplatesection1").removeClass("d-none").addClass("d-block");
    }
    else {
      $("#emailtemplatesection,#emailtemplatesection1").removeClass("d-block").addClass("d-none");
      // $(".emailtemplatesection").hide();
    }
  });

  $(document).on("change", ".flexCheckDefault-1", function () {
    var activeSlide = $('.carousel-inner .carousel-item.active');
    var selectedval = activeSlide.find('#booking-sales-opportunity-1 option:selected').val();
    if (activeSlide.find("#flexCheckDefault").prop("checked")) {
      activeSlide.find("#emailtemplatesection,#emailtemplatesection1").removeClass("d-none").addClass("d-block");
    }
    else {
      activeSlide.find("#emailtemplatesection,#emailtemplatesection1").removeClass("d-block").addClass("d-none");
      // $(".emailtemplatesection").hide();
    }
  });

  // Create Records Function
  $(document).on("click", ".addrec", function () {

    var initparams = ZOHO.CREATOR.UTIL.getInitParams();
    console.log("initparams:", initparams);

    var LoginEmail = initparams.loginUser;
    // LoginEmail ="arjun@madhus.co.uk";

    $(".addrec").prop("disabled", true).text("Saving...");





    var checkboxdata = $("#flexCheckDefault").prop("checked");
    var venueIDValue = $('#venue_new option:selected').val();
    var suiteIDValue = $('#suite_new option:selected').val();
    var templateValue = $('#email_template_new option:selected').val();
    if (templateValue == "0") {
      templateValue = "";
    }
    var bookingStatusID = $('#booking-status_new option:selected').val();
    var bookingStatusName = $('#booking-status_new option:selected').text();
    var notesval = $('#booking-notes_new').val();
    var dateval = $('#booking-date_new').val();
    var bookingSalesOpportunityID = $('#booking-sales-opportunity_new option:selected').val();
    var bookingSalesPerson = $('#booking-sales-person_new').val();
    var bookingEnquiryReferrence = $('#booking-Enquiry-Reference_new').val();
    var bookingTotalNumberofGuests = $('#booking-total-number-of-guests_new').val();
    var bookingContact = $('#booking-contact_new').attr('contact_id') || "";
    var bookingmandatoryBedroom = $('#booking-mandatory-bedrooms_new').val();
    var bookingpricePerBedroom = $('#booking-price-per-bedroom_new').val();
    // console.log("Records Adding section", bookingSalesPerson);

    if (bulkSelectEnabled === false && selectedDates.length === 0) {
      var formData = {
        "data": {
          "Venue": venueIDValue,
          "Inform_to_Hotel": checkboxdata,
          "Email_Template": templateValue,
          "Suite": suiteIDValue,
          "Date_of_Booking": dateval,
          "Booking_Status": bookingStatusID,
          "Sales_Opportunities": bookingSalesOpportunityID,
          "Sales_person": bookingSalesPerson,
          "Enquiry_Reference": bookingEnquiryReferrence,
          "Number_of_Guests": bookingTotalNumberofGuests,
          "Contact": bookingContact,
          "Mandatory_Bedrooms": bookingmandatoryBedroom,
          "Price_Per_Bedroom": bookingpricePerBedroom,
          "Notes": notesval
        },
      }

      if (bookingStatusName == "Confirmed" || bookingStatusName == "3rd Option" || bookingStatusName == "2nd Option with hotel" || bookingStatusName == "Provisional" || bookingStatusID == "0") {
        // console.log("Venue: ", venueIDValue, " Suite: ", suiteIDValue, " Date_of_Booking: ", dateval)
        SearchBookingRecords_Func(suiteIDValue, dateval, "196576000000012027").then(respdata => {
          // console.log("respdata:", respdata);

          if (respdata == "true" && LoginEmail == "arjun@madhus.co.uk") {

            Swal.fire({
              title: "Are you sure?",
              text: "There is a confirmed booking for this date. Should you wish to continue?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, Proceed"
            }).then((result) => {
              if (result.isConfirmed) {

                CreateRecord_Func(formData).then(ResponseData => {
                  // console.log("ResponseData:", ResponseData);
                  if (ResponseData === "true") {
                    Swal.fire({
                      position: "middle",
                      icon: "success",
                      title: "Record Added Successfully!!",
                      showConfirmButton: false,
                      timer: 2500
                    });
                    $(".addrec").prop("disabled", false).text("Save");
                    $('#carouselModal').modal('hide');
                    $("#booking-sales-person_new , #booking-Enquiry-Reference_new,#booking-total-number-of-guests_new,#booking-contact_new,#booking-mandatory-bedrooms_new,#booking-price-per-bedroom_new,#booking-notes_new").val("");
                    $('#bulk-select').prop('checked', false);
                    bulkSelectEnabled = false;
                    fetchRecordsFunc("").then(ReturnVal => {
                      FinalBookinglist.length = 0;
                      // console.log("ReturnVal New:", ReturnVal);
                      FinalBookinglist = ReturnVal;
                      var selectedYearval = parseInt($("#year-select option:selected").val());
                      var StatusOptions = $(".filter-status-select").select2('data');
                      // console.log("StatusOptions:", StatusOptions)
                      var OptionValues = StatusOptions.map(function (option) {
                        return { bookingstatus: option.element.value };
                      });
                      var suiteRecord = $("#filter-suite-dropdown option:selected").val();
                      // console.log("statusrecord:", statusrecord);
                      if (suiteRecord == 0) {
                        suiteRecord = null;
                      }
                      var venuerecord = $("#filter-venue-dropdown option:selected").val();
                      if (venuerecord == 0) {
                        venuerecord = null;
                      }
                      createCalendar(selectedYearval, OptionValues, suiteRecord, venuerecord);
                    });
                  }
                });

              }
              else {
                $('#booking-status_new').val("0");
              }
            });
          }
          else if (respdata == "true" && LoginEmail != "arjun@madhus.co.uk") {
            Swal.fire({
              position: "middle",
              icon: "error",
              title: "Existing record found for the same day",
              showConfirmButton: false,
              timer: 3500
            }).then((result) => {
              $('#booking-status_new').val("0");
              $(".addrec").prop("disabled", false).text("Save");
              // $(".addrec").hide();
            });
          }
          else if (respdata == "false") {
            CreateRecord_Func(formData).then(ResponseData => {
              // console.log("ResponseData:", ResponseData);
              if (ResponseData === "true") {
                Swal.fire({
                  position: "middle",
                  icon: "success",
                  title: "Record Added Successfully!!",
                  showConfirmButton: false,
                  timer: 2500
                });
                $(".addrec").prop("disabled", false).text("Save");
                $('#carouselModal').modal('hide');
                $("#booking-sales-person_new , #booking-Enquiry-Reference_new,#booking-total-number-of-guests_new,#booking-contact_new,#booking-mandatory-bedrooms_new,#booking-price-per-bedroom_new,#booking-notes_new").val("");
                $('#bulk-select').prop('checked', false);
                bulkSelectEnabled = false;
                fetchRecordsFunc("").then(ReturnVal => {
                  FinalBookinglist.length = 0;
                  // console.log("ReturnVal New:", ReturnVal);
                  FinalBookinglist = ReturnVal;
                  var selectedYearval = parseInt($("#year-select option:selected").val());
                  var StatusOptions = $(".filter-status-select").select2('data');
                  // console.log("StatusOptions:", StatusOptions)
                  var OptionValues = StatusOptions.map(function (option) {
                    return { bookingstatus: option.element.value };
                  });
                  // var suiteRecord = $("#filter-suite-dropdown option:selected").val();
                  // // console.log("statusrecord:", statusrecord);
                  // if (suiteRecord == 0) {
                  //   suiteRecord = null;
                  // }
                  // var venuerecord = $("#filter-venue-dropdown option:selected").val();
                  // if (venuerecord == 0) {
                  //   venuerecord = null;
                  // }
                  const queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
                  console.log("queryParams",queryParams);
                  suiteRecord = queryParams.suiteID;
                  venuerecord = queryParams.venueID;
                  createCalendar(selectedYearval, OptionValues, suiteRecord, venuerecord);
                });
              }
            });
          }
        });
      }
      else {
        CreateRecord_Func(formData).then(ResponseData => {
          // console.log("ResponseData:", ResponseData);
          if (ResponseData === "true") {
            Swal.fire({
              position: "middle",
              icon: "success",
              title: "Record Added Successfully!!",
              showConfirmButton: false,
              timer: 2500
            });
            $(".addrec").prop("disabled", false).text("Save");
            $('#carouselModal').modal('hide');
            $("#booking-sales-person_new , #booking-Enquiry-Reference_new,#booking-total-number-of-guests_new,#booking-contact_new,#booking-mandatory-bedrooms_new,#booking-price-per-bedroom_new,#booking-notes_new").val("");
            $('#bulk-select').prop('checked', false);
            bulkSelectEnabled = false;
            fetchRecordsFunc("").then(ReturnVal => {
              FinalBookinglist.length = 0;
              // console.log("ReturnVal New:", ReturnVal);
              FinalBookinglist = ReturnVal;
              var selectedYearval = parseInt($("#year-select option:selected").val());
              var StatusOptions = $(".filter-status-select").select2('data');
              // console.log("StatusOptions:", StatusOptions)
              var OptionValues = StatusOptions.map(function (option) {
                return { bookingstatus: option.element.value };
              });
              var suiteRecord = $("#filter-suite-dropdown option:selected").val();
              // console.log("statusrecord:", statusrecord);
              if (suiteRecord == 0) {
                suiteRecord = null;
              }
              var venuerecord = $("#filter-venue-dropdown option:selected").val();
              if (venuerecord == 0) {
                venuerecord = null;
              }
              createCalendar(selectedYearval, OptionValues, suiteRecord, venuerecord);
            });
          }
        });
      }
      // console.log("formData:", formData);
      // CreateRecord_Func(formData).then(ResponseData => {
      //   // console.log("ResponseData:", ResponseData);
      //   if (ResponseData === "true") {
      //     Swal.fire({
      //       position: "middle",
      //       icon: "success",
      //       title: "Record Added Successfully!!",
      //       showConfirmButton: false,
      //       timer: 2500
      //     });
      //     $('#carouselModal').modal('hide');
      //     $("#booking-sales-person_new , #booking-Enquiry-Reference_new,#booking-total-number-of-guests_new,#booking-contact_new,#booking-mandatory-bedrooms_new,#booking-price-per-bedroom_new,#booking-notes_new").val("");
      //     $('#bulk-select').prop('checked', false);
      //     bulkSelectEnabled = false;
      //     fetchRecordsFunc("").then(ReturnVal => {
      //       FinalBookinglist.length = 0;
      //       // console.log("ReturnVal New:", ReturnVal);
      //       FinalBookinglist = ReturnVal;
      //       var selectedYearval = parseInt($("#year-select option:selected").val());
      //       var statusrecord = $("#filter-dropdown option:selected").val();
      //       // console.log("statusrecord:", statusrecord);
      //       if (statusrecord == 0) {
      //         statusrecord = null;
      //       }
      //       createCalendar(selectedYearval, statusrecord, []);
      //     });
      //   }
      // });
    } else {
      // console.log("selectedDates:", selectedDates)

      // Handle the case where bulkSelectEnabled is true and there are selected dates
      const datePromises = selectedDates.map(dateval => {
        var formData = {
          "data": {
            "Inform_to_Hotel": checkboxdata,
            "Email_Template": templateValue,
            "Venue": venueIDValue,
            "Suite": suiteIDValue,
            "Date_of_Booking": dateval,
            "Booking_Status": bookingStatusID,
            "Sales_Opportunities": bookingSalesOpportunityID,
            "Sales_person": bookingSalesPerson,
            "Enquiry_Reference": bookingEnquiryReferrence,
            "Number_of_Guests": bookingTotalNumberofGuests,
            "Contact": bookingContact,
            "Mandatory_Bedrooms": bookingmandatoryBedroom,
            "Price_Per_Bedroom": bookingpricePerBedroom,
            "Notes": notesval
          },
        };
        var conditiontext = "false";
        const isFirstIteration = index => index === 0;
        if (isFirstIteration(index)) {
          formData = {
            "data": {
              "Inform_to_Hotel": checkboxdata,
              "Email_Template": templateValue,
              "Venue": venueIDValue,
              "Suite": suiteIDValue,
              "Date_of_Booking": dateval,
              "Booking_Status": bookingStatusID,
              "Sales_Opportunities": bookingSalesOpportunityID,
              "Sales_person": bookingSalesPerson,
              "Enquiry_Reference": bookingEnquiryReferrence,
              "Number_of_Guests": bookingTotalNumberofGuests,
              "Contact": bookingContact,
              "Mandatory_Bedrooms": bookingmandatoryBedroom,
              "Price_Per_Bedroom": bookingpricePerBedroom,
              "Notes": notesval,
              "Record_IDs": "Start"
            },
          };
        }
        if (index === selectedDates.length - 1) {
          conditiontext = "true";
          const IDs_List1 = IDs_List.join(',');
          console.log("IDs_List1", IDs_List)
          formData = {
            "data": {
              "Inform_to_Hotel": checkboxdata,
              "Email_Template": templateValue,
              "Venue": venueIDValue,
              "Suite": suiteIDValue,
              "Date_of_Booking": dateval,
              "Booking_Status": bookingStatusID,
              "Sales_Opportunities": bookingSalesOpportunityID,
              "Sales_person": bookingSalesPerson,
              "Enquiry_Reference": bookingEnquiryReferrence,
              "Number_of_Guests": bookingTotalNumberofGuests,
              "Contact": bookingContact,
              "Mandatory_Bedrooms": bookingmandatoryBedroom,
              "Price_Per_Bedroom": bookingpricePerBedroom,
              "Notes": notesval,
              "Record_IDs": "End",
              "Is_Bulk_Select": true
            },
          };
        }

        // console.log("formData for date:", dateval, formData);
        [];
        return CreateRecord_Func(formData);
      });

      Promise.all(datePromises).then(responses => {
        // console.log("Responses:", responses);
        if (responses.every(response => response === "true")) {
          Swal.fire({
            position: "middle",
            icon: "success",
            title: "Records Added Successfully!!",
            showConfirmButton: false,
            timer: 2500
          });
          $('#carouselModal').modal('hide');
          $("#booking-sales-person_new , #booking-Enquiry-Reference_new,#booking-total-number-of-guests_new,#booking-contact_new,#booking-mandatory-bedrooms_new,#booking-price-per-bedroom_new,#booking-notes_new").val("");
          $('#bulk-select').prop('checked', false);
          bulkSelectEnabled = false;

          fetchRecordsFunc("").then(ReturnVal => {
            FinalBookinglist.length = 0;
            // console.log("ReturnVal New:", ReturnVal);
            FinalBookinglist = ReturnVal;
            var selectedYearval = parseInt($("#year-select option:selected").val());

            var StatusOptions = $(".filter-status-select").select2('data');
            // console.log("StatusOptions:", StatusOptions)
            var OptionValues = StatusOptions.map(function (option) {
              return { bookingstatus: option.element.value };
            });
            fetchRagamamaDates();
            fetchMadhuDates();
            createCalendar(selectedYearval, OptionValues, []);
          });
        } else {
          Swal.fire({
            position: "middle",
            icon: "error",
            title: "Some records were not added.",
            showConfirmButton: true
          });
        }
      }).catch(error => {
        console.error("Error in adding records:", error);
        Swal.fire({
          position: "middle",
          icon: "error",
          title: "An error occurred while adding records.",
          showConfirmButton: true
        });
      });
    }
    
  });

  // Update Records function
  $(document).on('click', ".updaterec", function () {
    var activeSlide = $('.carousel-inner .carousel-item.active');
    var checkboxdata = activeSlide.find("#flexCheckDefault").prop("checked");

    var EmailTemplateValue = activeSlide.find('#email_template-1 option:selected').val();
    if (EmailTemplateValue == "0") {
      EmailTemplateValue = "";
    }
    var venueIDValue = activeSlide.find('#venue-1 option:selected').val();
    var suiteIDValue = activeSlide.find('#suites-1 option:selected').val();
    var bookingStatusID = activeSlide.find('#booking-status-1 option:selected').val();
    var bookingStatusName = activeSlide.find('#booking-status-1 option:selected').text();
    var notesval = activeSlide.find('#booking-notes-1').val();
    var dateval = activeSlide.find('#booking-date-1').val();
    var bookingSalesOpportunityID = activeSlide.find('#booking-sales-opportunity-1 option:selected').val();
    var bookingSalesPerson = activeSlide.find('#booking-sales-person-1').val();
    var bookingEnquiryReferrence = activeSlide.find('#booking-Enquiry-Reference-1').val();
    var bookingTotalNumberofGuests = $('#booking-total-number-of-guests-1').val();
    var bookingContact = activeSlide.find('#booking-contact-1').attr('contact_id') || "";

    var bookingmandatoryBedroom = activeSlide.find('#booking-mandatory-bedrooms-1').val();
    var bookingpricePerBedroom = activeSlide.find('#booking-price-per-bedroom-1').val();
    var Record_ID = activeSlide.find("#existing_recordID").val();
    // console.log("Records Adding section", bookingContact);
    formData = {
      "data": {
        "Venue": venueIDValue,
        "Suite": suiteIDValue,
        "Email_Template": EmailTemplateValue,
        "Inform_to_Hotel": checkboxdata,
        "Date_of_Booking": dateval,
        "Booking_Status": bookingStatusID,
        "Sales_Opportunities": bookingSalesOpportunityID,
        "Sales_person": bookingSalesPerson,
        "Enquiry_Reference": bookingEnquiryReferrence,
        "Number_of_Guests": bookingTotalNumberofGuests,
        "Contact": bookingContact,
        "Mandatory_Bedrooms": bookingmandatoryBedroom,
        "Price_Per_Bedroom": bookingpricePerBedroom,
        "Notes": notesval
      },
    }

    const searchCriteria = {
      RecordID: Record_ID,
      VenueID: venueIDValue,
      SuiteID:suiteIDValue,
      bookingStatusID: bookingStatusID,
      Date_of_Booking:dateval
    };
    console.log('searchCriteria:'+searchCriteria);
    const exists = UpdateSectionList.some(booking => 
      booking.RecordID === searchCriteria.RecordID &&
      booking.VenueID === searchCriteria.VenueID &&
      booking.bookingStatusID === searchCriteria.bookingStatusID &&
      booking.Date_of_Booking === searchCriteria.Date_of_Booking
    );

    console.log("exists:",exists)

    var initparams = ZOHO.CREATOR.UTIL.getInitParams();
    console.log("initparams:",initparams);

    var LoginEmail=initparams.loginUser;
    // LoginEmail ="arjun@madhus.co.uk"
    // console.log("exists:",exists);
    console.log("bookingStatusName:",bookingStatusName)


    if (exists == false)
    {
      if (bookingStatusName == "Confirmed" || bookingStatusName =="3rd Option" || bookingStatusName =="2nd Option with hotel" || bookingStatusName =="Provisional" || bookingStatusID =="0")
      {
        SearchBookingRecords_Update_Func(suiteIDValue,dateval,"196576000000012027",Record_ID).then(respdata=>{
          console.log("respdata:",respdata);
          if (respdata=="true" && LoginEmail =="arjun@madhus.co.uk")
          {

            Swal.fire({
              title: "Are you sure?",
              text: "There is a confirmed booking for this date. Should you wish to continue?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, Proceed"
            }).then((result) => {
              if (result.isConfirmed) {
                ZOHO.CREATOR.API.updateRecord({
                  appName: "bookings",
                  reportName: "Booking_Report",
                  id: Record_ID,
                  data: formData
                }).then(function (response) {
                  if (response.code == 3000) {
                    console.log("Record updated successfully");
                    Swal.fire({
                      position: "middle",
                      icon: "success",
                      title: "<span class='sweet-box-title'>Record Updated Successfully !!</span>",
                      showConfirmButton: false,
                      timer: 1500
                    });
                    $('#carouselModal').modal('hide');
            
                    fetchRecordsFunc("").then(ReturnVal => {
                      // FinalBookinglist = [];
                      FinalBookinglist.length = 0;
                      // console.log("ReturnVal New:", ReturnVal);
            
                      FinalBookinglist = ReturnVal;
                      var selectedYearval = parseInt($("#year-select option:selected").val());
                      var StatusOptions = $(".filter-status-select").select2('data');
                      console.log("StatusOptions:",StatusOptions)
                      var OptionValues = StatusOptions.map(function (option) {
                        return { bookingstatus: option.element.value };
                      });
                      var suiteRecord = $("#filter-suite-dropdown option:selected").val();
                      // console.log("statusrecord:", statusrecord);
                      if (suiteRecord == 0) {
                        suiteRecord = null;
                      }
                      var venuerecord = $("#filter-venue-dropdown option:selected").val();
                      if (venuerecord == 0) {
                        venuerecord = null;
                      }
                      createCalendar(selectedYearval, OptionValues, suiteRecord, venuerecord);
                    });
                  }
                });

              }
            });
          }
          else if (respdata=="true" && LoginEmail !="arjun@madhus.co.uk")
          {
            Swal.fire({
              position: "middle",
              icon: "error",
              title: "Existing record found for the same day",
              showConfirmButton: false,
              timer: 3500
            }).then((result)=>{
              // $('#booking-status_new').val("0");
              // // $(".addrec").hide();
            });
          }
          else if (respdata=="false")
          {
            ZOHO.CREATOR.API.updateRecord({
              appName: "bookings",
              reportName: "Booking_Report",
              id: Record_ID,
              data: formData
            }).then(function (response) {
              if (response.code == 3000) {
                console.log("Record updated successfully");
                Swal.fire({
                  position: "middle",
                  icon: "success",
                  title: "<span class='sweet-box-title'>Record Updated Successfully !!</span>",
                  showConfirmButton: false,
                  timer: 1500
                });
                $('#carouselModal').modal('hide');
        
                fetchRecordsFunc("").then(ReturnVal => {
                  // FinalBookinglist = [];
                  FinalBookinglist.length = 0;
                  // console.log("ReturnVal New:", ReturnVal);
        
                  FinalBookinglist = ReturnVal;
                  var selectedYearval = parseInt($("#year-select option:selected").val());
                  var StatusOptions = $(".filter-status-select").select2('data');
                  console.log("StatusOptions:",StatusOptions)
                  var OptionValues = StatusOptions.map(function (option) {
                    return { bookingstatus: option.element.value };
                  });
                  var suiteRecord = $("#filter-suite-dropdown option:selected").val();
                  // console.log("statusrecord:", statusrecord);
                  if (suiteRecord == 0) {
                    suiteRecord = null;
                  }
                  var venuerecord = $("#filter-venue-dropdown option:selected").val();
                  if (venuerecord == 0) {
                    venuerecord = null;
                  }
                  createCalendar(selectedYearval, OptionValues, suiteRecord, venuerecord);
                });
              }
            });

          }
        });
      }
    }
    else
    {
      ZOHO.CREATOR.API.updateRecord({
          appName: "bookings",
          reportName: "Booking_Report",
          id: Record_ID,
          data: formData
        }).then(function (response) {
          if (response.code == 3000) {
            console.log("Record updated successfully");
            Swal.fire({
              position: "middle",
              icon: "success",
              title: "<span class='sweet-box-title'>Record Updated Successfully !!</span>",
              showConfirmButton: false,
              timer: 1500
            });
            $('#carouselModal').modal('hide');
    
            fetchRecordsFunc("").then(ReturnVal => {
              // FinalBookinglist = [];
              FinalBookinglist.length = 0;
              // console.log("ReturnVal New:", ReturnVal);
    
              FinalBookinglist = ReturnVal;
              var selectedYearval = parseInt($("#year-select option:selected").val());
              var statusrecord = $("#filter-dropdown option:selected").val();
              // console.log("statusrecord:", statusrecord)
    
              var StatusOptions = $(".filter-status-select").select2('data');
              console.log("StatusOptions:",StatusOptions)
              var OptionValues = StatusOptions.map(function (option) {
                return { bookingstatus: option.element.value };
              });
              if (statusrecord == 0) {
                statusrecord = null;
              }
    
              fetchRagamamaDates();
              fetchMadhuDates();
              createCalendar(selectedYearval, OptionValues);
            });
          }
        });
    }
    
  });
  // Delete Records function
  $(document).on("click", ".deleterec", function () {
    var activeSlide = $('.carousel-inner .carousel-item.active');
    var Existing_RecValue = activeSlide.find('#existing_recordID').val();
    // console.log("Existing_RecValue:", Existing_RecValue);
    var config = {
      reportName: "Booking_Report",
      criteria: "(ID==\"" + Existing_RecValue + "\")"
    };
    ZOHO.CREATOR.API.deleteRecord(config).then(function (response) {
      recordArr = response.code;
      // console.log("response:", response);
      if (recordArr == 3000) {
        Swal.fire({
          position: "middle",
          icon: "success",
          title: "Record Deleted Successfully!!",
          showConfirmButton: false,
          timer: 2500
        })
        $('#carouselModal').modal('hide');

        fetchRecordsFunc("").then(ReturnVal => {
          // FinalBookinglist = [];
          FinalBookinglist.length = 0;
          // console.log("ReturnVal New:", ReturnVal);

          FinalBookinglist = ReturnVal;
          var selectedYearval = parseInt($("#year-select option:selected").val());
          var statusrecord = $("#filter-dropdown option:selected").val();
          // console.log("statusrecord:", statusrecord)
          if (statusrecord == 0) {
            statusrecord = null;
          }
          fetchRagamamaDates();
          fetchMadhuDates();
          createCalendar(selectedYearval, statusrecord);
        });
      }
    });
  });

});
async function fetchRagamamaDates() {
  try {
    let criteria = `Booking_Status.ID == 196576000000012035`;
    var config = { 
        appName: "bookings",
        reportName: "Booking_Report", 
        criteria: criteria,
        page: 1,
        pageSize: 10
    };

    const response = await ZOHO.CREATOR.API.getAllRecords(config);
    var ragamamaDropdown = document.getElementById('ragamama-date');
    ragamamaDropdown.innerHTML = ''; // Clear existing options

    // Add default "Select Date" option and set it as selected
    var defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Select Date";
    defaultOption.selected = true; // Set as default selected
    ragamamaDropdown.appendChild(defaultOption);

    var recordArr = response.data;
    if (recordArr && recordArr.length > 0) {
        recordArr.forEach(function(record) {
            var option = document.createElement('option');
            option.value = record.Date_of_Booking; // Assuming 'Date' is the field name
            option.textContent = record.Date_of_Booking;
            ragamamaDropdown.appendChild(option);
        });
        ragamamaDropdown.disabled = false; // Enable the dropdown if options are added
        ragamamaDropdown.title = ""; // Clear tooltip
    } else {
        ragamamaDropdown.disabled = true; // Disable if no options are available
        ragamamaDropdown.title = "No dates available"; // Set tooltip for disabled state
    }
  } catch (error) {
    console.error('Error fetching Ragamama dates');
    document.getElementById('ragamama-date').disabled = true; // Disable on error
    document.getElementById('ragamama-date').title = "Failed to fetch dates"; // Set tooltip on error
  }
}

// Fetch Madhu's dates
async function fetchMadhuDates() {
  try {
    let criteria2 = `Booking_Status.ID == 196576000000012039`;
    var config = { 
        appName: "bookings",
        reportName: "Booking_Report", 
        criteria: criteria2,
        page: 1,
        pageSize: 10
    };

    const response = await ZOHO.CREATOR.API.getAllRecords(config);
    var madhuDropdown = document.getElementById('madhu-date');
    madhuDropdown.innerHTML = ''; // Clear existing options

    // Add default "Select Date" option and set it as selected
    var defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Select Date";
    defaultOption.selected = true; // Set as default selected
    madhuDropdown.appendChild(defaultOption);

    var recordArr = response.data;
    if (recordArr && recordArr.length > 0) {
        recordArr.forEach(function(record) {
            var option = document.createElement('option');
            option.value = record.Date_of_Booking; // Assuming 'Date' is the field name
            option.textContent = record.Date_of_Booking;
            madhuDropdown.appendChild(option);
        });
        madhuDropdown.disabled = false; // Enable the dropdown if options are added
        madhuDropdown.title = ""; // Clear tooltip
    } else {
        madhuDropdown.disabled = true; // Disable if no options are available
        madhuDropdown.title = "No dates available"; // Set tooltip for disabled state
    }
  } catch (error) {
    console.error('Error fetching Madhu dates');
    document.getElementById('madhu-date').disabled = true; // Disable on error
    document.getElementById('madhu-date').title = "Failed to fetch dates"; // Set tooltip on error
  }
}




$(document).ready(function() {
  let isLoading = false;

  $('#confirm-swap').on('click', async function(event) {
      event.preventDefault();

      if (isLoading) return; // Prevent multiple clicks while loading
      isLoading = true;

      // Show loading indicator
      // Swal.fire({
      //     title: 'Processing...',
      //     text: 'Please wait.',
      //     allowEscapeKey: false,
      //     allowOutsideClick: false,
      //     onBeforeOpen: () => {
      //         Swal.showLoading();
      //     }
      // });
       

      const ragamamaDate = $('#ragamama-date').val();
      const madhuDate = $('#madhu-date').val();

      if (!ragamamaDate || !madhuDate) {
          Swal.fire({
              title: 'Error!',
              text: 'Please select both dates before confirming the swap.',
              icon: 'error',
              showConfirmButton: false,
              timer: 2500
          });
          isLoading = false;
          return;
      }

      const ragamamaCriteria = `Date_of_Booking == "${ragamamaDate}" && Booking_Status == 196576000000012035`;
      const madhuCriteria = `Date_of_Booking == "${madhuDate}" && Booking_Status == 196576000000012039`;

      const ragamamaConfig = { appName: "bookings", reportName: "Booking_Report", criteria: ragamamaCriteria, page: 1, pageSize: 10 };
      const ragamamaResponse = await ZOHO.CREATOR.API.getAllRecords(ragamamaConfig);
      const ragamamaId = ragamamaResponse.data.length > 0 ? ragamamaResponse.data[0].ID : null;

      const madhuConfig = { appName: "bookings", reportName: "Booking_Report", criteria: madhuCriteria, page: 1, pageSize: 10 };
      const madhuResponse = await ZOHO.CREATOR.API.getAllRecords(madhuConfig);
      const madhuId = madhuResponse.data.length > 0 ? madhuResponse.data[0].ID : null;

      if (!ragamamaId || !madhuId) {
          Swal.fire({
              title: 'Error!',
              text: 'Could not find records for the selected dates.',
              icon: 'error',
              showConfirmButton: false,
              timer: 2500
          });
          isLoading = false;
          return;
      }
      const Toast1 = Swal.mixin({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 4500,
        timerProgressBar: true,
        didOpen: (toast1) => {
          toast1.onmouseenter = Swal.stopTimer;
          toast1.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast1.fire({
        icon: "info",
        title: "Processing... Please wait."
      });

      const formDataR = { "data": { "Booking_Status": "196576000000012039" } };
      const configR = { appName: "bookings", reportName: "Booking_Report", id: ragamamaId, data: formDataR };

      await ZOHO.CREATOR.API.updateRecord(configR);

      const formDataM = { "data": { "Booking_Status": "196576000000012035" } };
      const configM = { appName: "bookings", reportName: "Booking_Report", id: madhuId, data: formDataM };
      
      
      const resp = await ZOHO.CREATOR.API.updateRecord(configM);
      console.log("resp:",resp);
      
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: false,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      if(resp.code == 3000){
        Toast.fire({
          icon: "success",
          title: "The booking swap has been confirmed."
        });
      }else{
        Toast.fire({
          icon: "error",
          title: resp.message
        });
      }
      
      isLoading = false; // Reset loading state
      

      fetchRecordsFunc("").then(ReturnVal => {
        // FinalBookinglist = [];
        FinalBookinglist.length = 0;
        // console.log("ReturnVal New:", ReturnVal);

        FinalBookinglist = ReturnVal;
        var selectedYearval = parseInt($("#year-select option:selected").val());
        var statusrecord = $("#filter-dropdown option:selected").val();
        // console.log("statusrecord:", statusrecord)
        if (statusrecord == 0) {
          statusrecord = null;
        }
        createCalendar(selectedYearval, statusrecord);
        fetchRagamamaDates();
        fetchMadhuDates();
        // document.getElementById('myModal').style.display='none';
        $('#myModal').hide();
      });
  });
});


