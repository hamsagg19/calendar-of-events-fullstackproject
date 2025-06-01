// holidays.js - Contains predefined holidays for different years
const holidaysData = {
    // 2024 Holidays
    "2024": [
        // National Holidays
        { date: "2024-01-01", description: "New Year's Day" },
        { date: "2024-01-26", description: "Republic Day" },
        { date: "2024-08-15", description: "Independence Day" },
        { date: "2024-10-02", description: "Gandhi Jayanti" },
        
        // Hindu Festivals
        { date: "2024-01-15", description: "Makar Sankranti" },
        { date: "2024-01-22", description: "Vasant Panchami" },
        { date: "2024-03-08", description: "Maha Shivaratri" },
        { date: "2024-03-25", description: "Holi" },
        { date: "2024-04-09", description: "Ugadi / Gudi Padwa" },
        { date: "2024-04-11", description: "Rama Navami" },
        { date: "2024-04-17", description: "Mahavir Jayanti" },
        { date: "2024-07-21", description: "Guru Purnima" },
        { date: "2024-08-19", description: "Raksha Bandhan" },
        { date: "2024-08-26", description: "Janmashtami" },
        { date: "2024-09-07", description: "Ganesh Chaturthi" },
        { date: "2024-10-12", description: "Navaratri Starts" },
        { date: "2024-10-31", description: "Diwali / Deepavali" },
        { date: "2024-11-01", description: "Kannada Rajyotsava" },
        { date: "2024-11-02", description: "Govardhan Puja" },
        { date: "2024-11-03", description: "Bhai Duj" },
        { date: "2024-11-15", description: "Chhath Puja" },
        
        // Muslim Festivals (approximate dates - may vary)
        { date: "2024-04-10", description: "Eid al-Fitr" },
        { date: "2024-06-17", description: "Eid al-Adha" },
        { date: "2024-07-17", description: "Muharram" },
        
        // Christian Festivals
        { date: "2024-03-29", description: "Good Friday" },
        { date: "2024-03-31", description: "Easter" },
        { date: "2024-12-25", description: "Christmas" },
        
        // Sikh Festivals
        { date: "2024-01-05", description: "Guru Gobind Singh Jayanti" },
        { date: "2024-04-13", description: "Baisakhi" },
        { date: "2024-11-15", description: "Guru Nanak Jayanti" },
        
        // Other Important Days
        { date: "2024-05-01", description: "Labour Day" },
        { date: "2024-06-05", description: "World Environment Day" },
        { date: "2024-06-21", description: "International Yoga Day" },
        { date: "2024-08-29", description: "National Sports Day" }
    ],
    
    // 2025 Holidays
    "2025": [
        // National Holidays
        { date: "2025-01-01", description: "New Year's Day" },
        { date: "2025-01-26", description: "Republic Day" },
        { date: "2025-08-15", description: "Independence Day" },
        { date: "2025-10-02", description: "Gandhi Jayanti" },
        
        // Hindu Festivals
        { date: "2025-01-14", description: "Makar Sankranti" },
        { date: "2025-02-11", description: "Vasant Panchami" },
        { date: "2025-02-26", description: "Maha Shivaratri" },
        { date: "2025-03-14", description: "Holi" },
        { date: "2025-03-30", description: "Ugadi / Gudi Padwa" },
        { date: "2025-04-07", description: "Rama Navami" },
        { date: "2025-04-06", description: "Mahavir Jayanti" },
        { date: "2025-07-10", description: "Guru Purnima" },
        { date: "2025-08-09", description: "Raksha Bandhan" },
        { date: "2025-08-15", description: "Janmashtami" },
        { date: "2025-08-28", description: "Ganesh Chaturthi" },
        { date: "2025-10-01", description: "Navaratri Starts" },
        { date: "2025-10-20", description: "Diwali / Deepavali" },
        { date: "2025-11-01", description: "Kannada Rajyotsava" },
        { date: "2025-10-23", description: "Govardhan Puja" },
        { date: "2025-10-24", description: "Bhai Duj" },
        { date: "2025-11-05", description: "Chhath Puja" },
        
        // Muslim Festivals (approximate dates - may vary)
        { date: "2025-03-31", description: "Eid al-Fitr" },
        { date: "2025-06-07", description: "Eid al-Adha" },
        { date: "2025-07-07", description: "Muharram" },
        
        // Christian Festivals
        { date: "2025-04-18", description: "Good Friday" },
        { date: "2025-04-20", description: "Easter" },
        { date: "2025-12-25", description: "Christmas" },
        
        // Sikh Festivals
        { date: "2025-01-16", description: "Guru Gobind Singh Jayanti" },
        { date: "2025-04-13", description: "Baisakhi" },
        { date: "2025-11-05", description: "Guru Nanak Jayanti" },
        
        // Other Important Days
        { date: "2025-05-01", description: "Labour Day" },
        { date: "2025-06-05", description: "World Environment Day" },
        { date: "2025-06-21", description: "International Yoga Day" },
        { date: "2025-08-29", description: "National Sports Day" }
    ]
};

// Function to get holidays for a specific year or range
function getHolidays(startDate, endDate) {
    const holidays = {};
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    // Get all the years in the range
    for (let year = startYear; year <= endYear; year++) {
        const yearStr = year.toString();
        if (holidaysData[yearStr]) {
            holidaysData[yearStr].forEach(holiday => {
                const holidayDate = new Date(holiday.date);
                // Only include holidays that are within the range
                if (holidayDate >= startDate && holidayDate <= endDate) {
                    const dateKey = holiday.date;
                    holidays[dateKey] = {
                        type: 'holiday',
                        description: holiday.description
                    };
                }
            });
        }
    }
    
    return holidays;
} 
// Add this function to holidays.js
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