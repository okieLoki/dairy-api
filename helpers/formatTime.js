const { utcToZonedTime, format } = require('date-fns-tz');

function convertToUserTimeZone(date, userTimeZone) {
    try {
        // Convert the input date to UTC format
        const utcDate = new Date(date.toISOString());

        // Get the user's local time zone
        const userLocalTimeZone = userTimeZone || 'Asia/Kathmandu';

        // Convert the UTC date to the user's local time zone
        const userLocalDate = utcToZonedTime(utcDate, userLocalTimeZone);

        return userLocalDate;
    } catch (error) {
        console.log('Error converting date to user time zone:', error);
        // Return the original date in case of an error
        return date;
    }
}

module.exports = convertToUserTimeZone;