var BookingStatusList = [];
var SalesOppList = [];
var suiteList = [];


async function EmailTemplate_List_Func(){
  const venueResp = await ZOHO.CREATOR.API.getAllRecords({
    reportName: "All_Email_Templates",
    page: 1,
    pageSize: 200
  });
  const recordArr = await venueResp.data;
  console.log("recordArr Email Template", recordArr);
  for (var index in recordArr)
  {
    var rec_id = recordArr[index].ID;
    var Template_Name = recordArr[index].Subject_field;
    $('#email_template_new').append($('<option>', {
      value: rec_id,
      text: Template_Name,
    }));

    EmailTemplate_List.push({
      "recid":rec_id,
      "Template_Name":Template_Name
    });
  }
}

async function fetchRecordsFunc(selectedStatusID) {
  var WholeBookingData = [];
  try {
    const queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
    // console.log("queryParams:", queryParams);

    const venueID = queryParams.venueID;
    const suiteID = queryParams.suiteID;
    // const venueID = "196576000000069013";
    // const suiteID = "196576000000073003";
    if (!venueID || !suiteID) {
      console.log("Missing venueID or suiteID in query parameters");
      return false;
    }

    let criteria = `Suite.ID == ${suiteID} && Venue.ID == ${venueID}`;
    if (selectedStatusID) {
      criteria += ` && Booking_Status == ${selectedStatusID}`;
    }
    // console.log("criteria:", criteria);
    for (let j = 1; j <= 20; j++) {
      const BookingResult = await ZOHO.CREATOR.API.getAllRecords({
        reportName: "Booking_Report",
        criteria: criteria,
        page: j,
        pageSize: 200
      });
      const recordArr = await BookingResult.data;
      // console.log("recordArr",recordArr);
      WholeBookingData = WholeBookingData.concat(recordArr);
    }
  } catch (error) {
    console.log("error:", error);
    // console.log("WholeBookingData:",WholeBookingData);
    return WholeBookingData;
    return false;
  }
  return WholeBookingData;
}

async function BookingRecords_Func() {
  const legendContainer = document.querySelector('.legends-color-container');
  legendContainer.innerHTML = "";
  const BookingResp = await ZOHO.CREATOR.API.getAllRecords({
    reportName: "Booking_Status_Report",
    page: 1,
    pageSize: 200
  });
  const recordArr = await BookingResp.data;
  // console.log("recordArr Booking status",recordArr);
  for (var index in recordArr) {
    var rec_id = recordArr[index].ID;
    var statusName = recordArr[index].Status;
    var statusColor = recordArr[index].Color;
    BookingStatusList.push({ "bookingName": statusName, "recID": rec_id });

    // Append Booking Status Section
    $('#filter-dropdown').append($('<option>', {
      value: rec_id,
      text: statusName,
      'recid': rec_id  // Example additional attribute
    }));
    // Append Booking Status Section ends

    // legendContainer data append section 
    const colorDiv = document.createElement("div");
    colorDiv.classList.add("booking-colors");
    colorDiv.style.backgroundColor = statusColor;
    colorDiv.style.height = "14px";
    colorDiv.style.width = "14px";
    colorDiv.style.borderRadius = "50%";

    const textSpan = document.createElement("span");
    textSpan.classList.add("booking-text");
    textSpan.innerHTML = `&nbsp;-  ${statusName}&nbsp;`;
    textSpan.style.marginRight = "10px";

    legendContainer.appendChild(colorDiv);
    legendContainer.appendChild(textSpan);

  }
}
async function SalesOppRecords_Func() {
  const SalesOppResp = await ZOHO.CREATOR.API.getAllRecords({
    reportName: "Sales_Opportunity_Report",
    page: 1,
    pageSize: 200
  });
  const recordArr = await SalesOppResp.data;
  // console.log("recordArr SalesOppResp", recordArr);
  SalesOppList = SalesOppList.concat(recordArr);
}

async function CreateRecord_Func(formdata) {
  var returnvalue = "fasle";
  const CreateResp = await ZOHO.CREATOR.API.addRecord({
    formName: "Booking",
    data: formdata
  });
  // console.log("CreateResp", CreateResp);
  const datacode = await CreateResp.code;
  if (datacode == 3000) {
    returnvalue = "true";
  }
  return returnvalue;
}


async function SearchBookingRecords_Func(suiteIDValue,dateval,bookingStatusID)
{
  returnvalue="false";
  console.log("***********");
  let criteria = ` Enquiry_Reference != null && Suite.ID == ${suiteIDValue} && Date_of_Booking == "${dateval}"`;
  
  if (bookingStatusID !=null)
  {
    criteria+=`&& Booking_Status.ID == 196576000000410003 || Booking_Status.ID ==196576000000199435 || Booking_Status.ID ==196576000000199642 || Booking_Status.ID ==196576000000012027`;
  }
  console.log("criteria:",criteria);
  try {
  const BookingFilterResult = await ZOHO.CREATOR.API.getAllRecords({
    reportName: "Booking_Report",
    criteria: criteria,
    page: 1,
    pageSize: 200
  });
    const recordArr = await BookingFilterResult.data;
    console.log("recordArr:",recordArr);
    console.log(recordArr.length);
    if (recordArr.length >0) {
      returnvalue="true";
    }
    return returnvalue; 
  } catch (error) {
    return returnvalue;
  }

}


async function SearchBookingRecords_Update_Func(suiteIDValue,dateval,bookingStatusID,Record_ID)
{
  returnvalue="false";
  console.log("***********");
  let criteria = `Enquiry_Reference != null && Suite.ID == ${suiteIDValue} && Date_of_Booking == "${dateval}" && ID!=${Record_ID} && Booking_Status.ID ==196576000000012027 || Booking_Status.ID ==196576000000199435 || Booking_Status.ID ==196576000000199642 || Booking_Status.ID ==196576000000239003`;
  
  // if (bookingStatusID !=null)
  // {
  //   criteria+=`&& Booking_Status.ID == ${bookingStatusID}`;
  // }
  console.log("criteria:",criteria);
  try {
  const BookingFilterResult = await ZOHO.CREATOR.API.getAllRecords({
    reportName: "Booking_Report",
    criteria: criteria,
    page: 1,
    pageSize: 200
  });
    const recordArr = await BookingFilterResult.data;
    console.log("recordArr:",recordArr);
    console.log(recordArr.length);
    if (recordArr.length >0) {
      returnvalue="true";
    }
    return returnvalue; 
  } catch (error) {
    return returnvalue;
  }

}

