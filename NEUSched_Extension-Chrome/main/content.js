function generateCSVFile(selectedStartDate, selectedEndDate) {
    if (!selectedStartDate || !selectedEndDate) {
        alert("Please select a start and end date.");
        return;
      }
    
      let xpath =
      "/html/body/table[3]";

    // Select the table with the border attribute set to "1"
    let root = document.querySelector('table[border="1"]');

    // Get all the rows except the header row
    let rows = Array.from(root.querySelectorAll('tr')).slice(1);

    // Map over the rows to extract the course details
    let data = rows.map(function (row) {
        // Use nth-child CSS pseudo-class to select the appropriate columns
        let subjectCode = row.querySelector("td:nth-child(1)").innerText.trim();
        let subjectName = row.querySelector("td:nth-child(2)").innerText.trim();
        let schedule = row.querySelector("td:nth-child(3)").innerText.trim();
        let sectionRoom = row.querySelector("td:nth-child(4)").innerText.trim();
        let lecLabUnits = row.querySelector("td:nth-child(5)").innerText.trim();
        let totalUnits = row.querySelector("td:nth-child(6)").innerText.trim();

        // Log the extracted data
        console.log("Course Details:", { subjectCode, subjectName, schedule, sectionRoom, lecLabUnits, totalUnits });

        // Return the data as an object
        return { subjectCode, subjectName, schedule, sectionRoom, lecLabUnits, totalUnits };
    });

    // Now 'data' contains an array of objects with the course details
    console.log(data);
    
      // Get current date with day of week
      const days = ["SUN", "M", "T", "W", "TH", "F", "SAT"];
      const currentDate = new Date();
      const currentDay = days[currentDate.getDay()];
      const newStartDate = new Date(selectedStartDate);
      const newEndDate = new Date(selectedEndDate);
      const result = [];
    
      // Since we know the currents and we have the selected start and end dates, we can fill in the missing days
      /* For example: selectedStartDate is 2023-09-01 and selectedEndDate is 2023-09-30, according to current, the date today is 2023-09-04 and its Monday. So we know that 2023-09-01 is Thursday, 2023-09-02 is Friday, 2023-09-03 is Saturday, and 2023-09-04 is Sunday. So we can fill in the missing days with the correct dates.
        [
          {
            date: 2023-09-01,
            day: Th
          },
          {
            date: 2023-09-02,
            day: F
          },
          ... up to 2023-09-30
          }
        ]*/
    
      while (newStartDate <= newEndDate) {
        result.push({
          date: newStartDate.toISOString().slice(0, 10),
          day: days[newStartDate.getDay()],
        });
        newStartDate.setDate(newStartDate.getDate() + 1);
      }
    
      // If the start date is in the future, add missing days with the correct dates
      if (selectedStartDate > currentDate) {
        const missingDays = days
          .slice(days.indexOf(currentDay))
          .concat(days.slice(0, days.indexOf(currentDay)));
        const missingDates = missingDays.map((day, index) => {
          const date = new Date(currentDate);
          date.setDate(date.getDate() + index + 1);
          return { date: date, day: day };
        });
        result.unshift(...missingDates);
      }
    
      // If the end date is in the future, add missing days with the correct dates
      if (selectedEndDate > currentDate) {
        const missingDays = days
          .slice(days.indexOf(currentDay) + 1)
          .concat(days.slice(0, days.indexOf(currentDay) + 1));
        const missingDates = missingDays.map((day, index) => {
          const date = new Date(selectedEndDate);
          date.setDate(date.getDate() + index + 1);
          return { date: date, day: day };
        });
        result.push(...missingDates);
      }
    
      let csvContent = "Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private\r\n";

        // Assuming 'data' is an array of objects containing course details
        data.forEach((course) => {
        let description = course.subjectName; // Use the subject name from the HTML structure
        let schedule = course.schedule; // Use the schedule from the HTML structure
        let sectionRoom = course.sectionRoom; // Use the section and room from the HTML structure
        let lecLabUnits = course.lecLabUnits; // Use the lecture/lab units from the HTML structure
        let totalUnits = course.totalUnits; // Use the total units from the HTML structure

        // Convert the schedule string into an array of schedules
        let classSchedules = schedule.split(',').map(s => s.trim());

        // Iterate over each schedule
        classSchedules.forEach(function (cs) {
            // Extract the day, start time, and end time from the schedule string
            let [day, timeRange] = cs.split(' ');
            let [startTime, endTime] = timeRange.split('-');

            // Convert the start and end times to  24-hour format
            let start = convertTo24HourFormat(startTime);
            let startAMPM = start.replace("AM", " AM").replace("PM", " PM");
            let end = convertTo24HourFormat(endTime);
            let endAMPM = end.replace("AM", " AM").replace("PM", " PM");

            // Two-digit hours and minutes
            let startDate = new Date().toISOString().slice(0, 10);
            let endDate = new Date().toISOString().slice(0, 10);

            // Join the remaining details as the location
            let location = sectionRoom;

            result.forEach((r) => {
                if (r.day === day) {
                  csvContent += `${description},${r.date},${startAMPM},${r.date},${endAMPM},FALSE,${description},${location},TRUE\r\n`;
                }
            });
        });
    });

        // Function to convert time to  24-hour format
        function convertTo24HourFormat(time) {
        let [hours, minutes, period] = time.split(/[:]/);
        if (period === 'PM' || period === 'pm') {
            hours = (parseInt(hours,  10) %  12) +  12;
        } else if (period === 'AM' || period === 'am') {
            hours = parseInt(hours,  10) %  12;
        }
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
        }

        // Now 'csvContent' contains the CSV data
        console.log(csvContent);

    
      var hiddenElement = document.createElement("a");
      hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csvContent);
      hiddenElement.target = "_blank";
      hiddenElement.download = "neuschedule.csv";
      hiddenElement.click();
    }
    
    

  
  


  
  