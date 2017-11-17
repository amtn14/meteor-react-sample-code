export function getUserEmployeeDefaultValues() {
    const userEmployeeDefaultValues = {
        companyId: "",  
        userId: "",
        completedSignUpSteps: [],
        address: {
            timezoneId: ""
        },
        photos: {
            //coverPhoto: "",
            profilePhotos: [],
            mainProfilePhoto: ""
        },
        details: {
            jobTitle: "",
            phoneNumber: "",
            phoneNumberExt: "",
            phoneNumberType: [],
            hostgigHoursCompleted: 0,
            hostgigHoursUpcoming: 0,
        },
        emailAddress: "",
        firstName: "",
        fullName: "",
        lastName: "",
        middleName: "",
        roles: [],
        isDeactivated: false
    };
    return userEmployeeDefaultValues;
}
