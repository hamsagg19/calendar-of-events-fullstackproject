document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dateSelection = document.getElementById('date-selection');
    const calendarManagement = document.getElementById('calendar-management');
    const generateBtn = document.getElementById('generate-calendar');
    const downloadBtn = document.getElementById('download-pdf');
    const eventDescInput = document.getElementById('event-desc');
    const eventTypeBtns = document.querySelectorAll('.event-type-btn');
    const semesterSelect = document.getElementById('semester');
    const calendarTitle = document.getElementById('calendar-title');
    const pdfTitle = document.getElementById('pdf-title');
    const navDates = document.getElementById('nav-dates');
    const navCalendar = document.getElementById('nav-calendar');
    const titleColorPicker = document.getElementById('title-color');
    
    // Initialize calendar data
    let calendarData = {
        semester: null,
        startDate: null,
        endDate: null,
        weeks: [],
        events: {},
        selectedEventType: 'event'
    };
    
    // Navigation handling
    navDates.addEventListener('click', function(e) {
        e.preventDefault();
        dateSelection.classList.add('active');
        calendarManagement.classList.remove('active');
        navDates.classList.add('active');
        navCalendar.classList.remove('active');
    });
    
    navCalendar.addEventListener('click', function(e) {
        e.preventDefault();
        if (!calendarData.semester) {
            alert('Please generate a calendar first');
            return;
        }
        dateSelection.classList.remove('active');
        calendarManagement.classList.add('active');
        navDates.classList.remove('active');
        navCalendar.classList.add('active');
    });
    
    // Set up event type selection
    eventTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            eventTypeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calendarData.selectedEventType = this.dataset.type;
        });
    });
    
    // Set default active button
    document.querySelector('.event-type-btn[data-type="event"]').classList.add('active');
    
    // Generate calendar when dates are set
    generateBtn.addEventListener('click', function() {
        const semester = semesterSelect.value;
        const startDate = new Date(document.getElementById('start-date').value);
        const endDate = new Date(document.getElementById('end-date').value);
        
        if (!semester) {
            alert('Please select a semester');
            return;
        }
        
        if (!startDate || !endDate || startDate >= endDate) {
            alert('Please select valid start and end dates');
            return;
        }
        
        calendarData.semester = semester;
        calendarData.startDate = startDate;
        calendarData.endDate = endDate;
        
        // Import holidays for the selected date range
        importHolidays(startDate, endDate);
        
        generateCalendar();
        dateSelection.classList.remove('active');
        calendarManagement.classList.add('active');
        navDates.classList.remove('active');
        navCalendar.classList.add('active');
    });
    
    // Import holidays from the holidays.js file and add 1st/3rd Saturdays
    function importHolidays(startDate, endDate) {
        // Get holidays from the imported holidays.js file
        const holidays = getHolidays(startDate, endDate);
        
        // Get 1st and 3rd Saturdays
        const saturdays = getFirstAndThirdSaturdays(startDate, endDate);
        
        // Combine all holidays
        const allHolidays = {...holidays, ...saturdays};
        
        // Add holidays to the calendar events
        Object.keys(allHolidays).forEach(dateKey => {
            if (!calendarData.events[dateKey]) {
                calendarData.events[dateKey] = [];
            }
            calendarData.events[dateKey].push(allHolidays[dateKey]);
        });
    }
    
    // Function to get 1st and 3rd Saturdays
    function getFirstAndThirdSaturdays(startDate, endDate) {
        const saturdays = {};
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay(); // 0 (Sun) to 6 (Sat)
            const dateOfMonth = currentDate.getDate();
            
            if (dayOfWeek === 6) { // Saturday
                const weekOfMonth = Math.ceil(dateOfMonth / 7);
                if (weekOfMonth === 1 || weekOfMonth === 3) {
                    const dateKey = currentDate.toISOString().split('T')[0];
                    saturdays[dateKey] = {
                        type: 'holiday',
                        description: weekOfMonth === 1 ? 'First Saturday' : 'Third Saturday'
                    };
                }
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return saturdays;
    }
    
    // Download as PDF
    downloadBtn.addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '190mm';
        
        // Add title with selected color
        const title = document.createElement('h1');
        title.className = 'pdf-title';
        title.textContent = `${calendarData.semester} SEM UG CALENDAR OF EVENTS`;
        title.style.color = titleColorPicker.value;
        tempContainer.appendChild(title);
        
        // Clone calendar
        const calendarClone = document.getElementById('calendar-container').cloneNode(true);
        calendarClone.style.width = '100%';
        tempContainer.appendChild(calendarClone);
        document.body.appendChild(tempContainer);
        
        // Generate PDF
        html2canvas(tempContainer, {
            scale: 2,
            logging: false,
            useCORS: true,
            width: 190 * 3.78,
            windowWidth: 190 * 3.78
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            const xOffset = (210 - imgWidth) / 2;
            doc.addImage(imgData, 'PNG', xOffset, 15, imgWidth, imgHeight);
            doc.save(`${calendarData.semester}-semester-calendar.pdf`);
            
            document.body.removeChild(tempContainer);
        });
    });
    
    // Generate the calendar based on dates
    function generateCalendar() {
        const semester = calendarData.semester;
        const startDate = calendarData.startDate;
        const endDate = calendarData.endDate;
        const calendarBody = document.getElementById('calendar-body');
        calendarBody.innerHTML = '';
        
        // Set calendar title
        const titleText = `${semester} SEM UG CALENDAR OF EVENTS (${formatDate(startDate)} to ${formatDate(endDate)})`;
        calendarTitle.textContent = titleText;
        
        let currentDate = new Date(startDate);
        let weekCount = 1;
        
        // Adjust to start from Monday of the week
        while (currentDate.getDay() !== 1) {
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        // Generate weeks
        while (currentDate <= endDate) {
            const weekStart = new Date(currentDate);
            const weekDays = [];
            let workingDays = 0;
            let remarks = [];
            let dateRanges = [];
            
            // Process each day of the week (Mon-Sun)
            for (let i = 0; i < 7; i++) {
                if (currentDate > endDate) {
                    weekDays.push('');
                    continue;
                }
                
                const dateKey = currentDate.toISOString().split('T')[0];
                const dayOfMonth = currentDate.getDate();
                weekDays.push(dayOfMonth.toString());
                
                // Check for events/holidays
                if (calendarData.events[dateKey]) {
                    const events = calendarData.events[dateKey];
                    
                    // Check if any event is a holiday
                    const hasHoliday = events.some(e => e.type === 'holiday');
                    const hasExam = events.some(e => e.type === 'exam');
                    const hasEvent = events.some(e => e.type === 'event');
                    
                    // Count working days (Mon-Sat) - exclude holidays and Sundays
                    if (i < 6 && !hasHoliday) {
                        workingDays++;
                    }
                    
                    // Add to date ranges for remarks
                    events.forEach(event => {
                        const prevDate = new Date(currentDate);
                        prevDate.setDate(prevDate.getDate() - 1);
                        const prevKey = prevDate.toISOString().split('T')[0];
                        
                        if (dateRanges.length > 0 && 
                            calendarData.events[prevKey] && 
                            calendarData.events[prevKey].some(e => e.description === event.description)) {
                            // Extend existing range
                            const existingRange = dateRanges.find(r => r.description === event.description);
                            if (existingRange) {
                                existingRange.end = currentDate.getDate();
                            }
                        } else {
                            // Start new range
                            dateRanges.push({
                                start: currentDate.getDate(),
                                end: currentDate.getDate(),
                                description: event.description
                            });
                        }
                    });
                } else {
                    // Count as working day if Mon-Sat and not Sunday
                    if (i < 6) {
                        workingDays++;
                    }
                } 
                
                // Move to next day
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            // Get month(s) for the week
            const monthStart = formatMonth(weekStart);
            let monthEnd = '';
            if (weekStart.getMonth() !== new Date(currentDate).getMonth()) {
                monthEnd = formatMonth(new Date(currentDate));
            }
            const monthDisplay = monthEnd ? `${monthStart}/${monthEnd}` : monthStart;
            
            // Create week row
            const row = document.createElement('tr');
            
            // Week number
            const weekCell = document.createElement('td');
            weekCell.textContent = weekCount++;
            row.appendChild(weekCell);
            
            // Month
            const monthCell = document.createElement('td');
            monthCell.textContent = monthDisplay;
            row.appendChild(monthCell);
            
            // Days (Mon-Sun)
            const tempDate = new Date(weekStart);
            
            weekDays.forEach((day, index) => {
                const dayCell = document.createElement('td');
                dayCell.textContent = day;
                
                if (day) {
                    const dayDate = new Date(tempDate);
                    dayDate.setDate(parseInt(day));
                    const dateKey = dayDate.toISOString().split('T')[0];
                    
                    // Sunday is always a holiday
                    if (index === 6) {
                        dayCell.className = 'holiday calendar-day';
                        dayCell.title = 'Sunday (Default Holiday)';
                        dayCell.innerHTML = `${day} <small> </small>`;
                    } 
                    // Check for other events
                    else if (calendarData.events[dateKey]) {
                        const events = calendarData.events[dateKey];
                        
                        // Determine primary class (holiday takes precedence)
                        const hasHoliday = events.some(e => e.type === 'holiday');
                        const hasExam = events.some(e => e.type === 'exam');
                        const hasEvent = events.some(e => e.type === 'event');
                        
                        if (hasHoliday) {
                            dayCell.className = 'holiday calendar-day';
                        } else if (hasExam) {
                            dayCell.className = 'exam calendar-day';
                        } else if (hasEvent) {
                            dayCell.className = 'event calendar-day';
                        }
                        
                        // Build tooltip with all events
                        const tooltip = events.map(e => {
                            const icon = e.type === 'holiday' ? ' ' : 
                                        e.type === 'exam' ? '📝' : '📌';
                            return `${icon} ${e.description}`;
                        }).join('\n');
                        
                        dayCell.title = tooltip;
                        
                        // Add icons (show holiday first if exists)
                        const icons = [];
                        if (hasHoliday) icons.push(' ');
                        if (hasExam) icons.push('📝');
                        if (hasEvent && !hasHoliday && !hasExam) icons.push('*');
                        
                        dayCell.innerHTML = `${day} <small>${icons.join(' ')}</small>`;
                    } else {
                        dayCell.className = 'calendar-day';
                    }
                    
                    // Add click handler (except for Sundays)
                    if (index !== 6) {
                        dayCell.addEventListener('click', function() {
                            handleDateClick(dayDate, dateKey);
                        });
                    }
                }
                
                row.appendChild(dayCell);
                tempDate.setDate(tempDate.getDate() + 1);
            });
            
            // Format the remarks
            dateRanges.forEach(range => {
                const startSuffix = getDaySuffix(range.start);
                if (range.start === range.end) {
                    remarks.push(`${range.start}${startSuffix} - ${range.description}`);
                } else {
                    const endSuffix = getDaySuffix(range.end);
                    remarks.push(`${range.start}${startSuffix} to ${range.end}${endSuffix} - ${range.description}`);
                }
            });
            
            // Working days
            const workingDaysCell = document.createElement('td');
            workingDaysCell.textContent = workingDays;
            row.appendChild(workingDaysCell);
            
            // Remarks
            const remarkCell = document.createElement('td');
            remarkCell.textContent = remarks.join(', ');
            row.appendChild(remarkCell);
            
            calendarBody.appendChild(row);
        }
    }
    
    // Handle date clicks
    function handleDateClick(date, dateKey) {
        const description = eventDescInput.value.trim();
        
        if (calendarData.selectedEventType === 'remove') {
            // Remove all events for this date
            if (calendarData.events[dateKey]) {
                delete calendarData.events[dateKey];
                generateCalendar();
            }
        } else {
            // Add/update event
            if (!description) {
                alert('Please enter an event description');
                return;
            }
            
            // Initialize events array if it doesn't exist
            if (!calendarData.events[dateKey]) {
                calendarData.events[dateKey] = [];
            }
            
            // Check if this exact event already exists
            const existingIndex = calendarData.events[dateKey].findIndex(
                e => e.type === calendarData.selectedEventType && 
                     e.description === description
            );
            
            if (existingIndex === -1) {
                // Add new event
                calendarData.events[dateKey].push({
                    type: calendarData.selectedEventType,
                    description: description
                });
            } else {
                // Remove existing event if clicked again (toggle)
                calendarData.events[dateKey].splice(existingIndex, 1);
                
                // If no events left, remove the date key
                if (calendarData.events[dateKey].length === 0) {
                    delete calendarData.events[dateKey];
                }
            }
            
            generateCalendar();
        }
    }
    
    // Helper function to get day suffix (st, nd, rd, th)
    function getDaySuffix(day) {
        if (day >= 11 && day <= 13) {
            return 'th';
        }
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }
    
    // Helper function to format date as "Month Day, Year"
    function formatDate(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    // Helper function to get month abbreviation
    function formatMonth(date) {
        return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    }
});