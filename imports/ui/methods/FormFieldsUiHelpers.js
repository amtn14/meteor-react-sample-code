/*
    the phone input will take any valid US format such as: 1234567890,
    123-456-7890, 123.456.7890, 123 456 7890, (123) 456 7890, and all related
    combinations. If the phone number is valid, it will be converted to a
    standard format, (123) 456-7890 to maintain consistency
*/

export function formatPhoneNumber(userInput) {
    const phoneNumber = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    let convertedPhoneNumber = userInput.replace(phoneNumber, "($1) $2-$3");
    return convertedPhoneNumber;
}

//Takes the phone number (that is being visually displayed) and strips its clean of all symbols/non-numerical characters
export function unformatPhoneNumber(formattedNumber) {
    let cleanPhoneNumber = formattedNumber.replace(/\D+/g,'');
    return cleanPhoneNumber;
}
