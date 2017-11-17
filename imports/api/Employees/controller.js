import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../modules/rate-limit';
import Employees from './Employees';
import sendHtmlEmail from '../../../server/email';
import { formatPhoneNumber } from '../../ui/methods/FormFieldsUiHelpers';
import UserEnums from '../Users/enums';

const userRoles = UserEnums.USER_ROLE_ENUM;
const _defaultEmployeePassword = Meteor.settings.private.NEW_EMPLOYEE.tempPassword;

Meteor.methods({
    //adds user + employee objects - sends out emails to companies + new employees
    'employeeController.addUserAndEmployee': function addUserAndEmployee(data){
        let ret = {
            'title': 'Success! ',
            'message': "You've created an employee record! ",
            'type': 'success',
            'userId': "",
            'employeeId': ""
        };
        try {
            let userData = {
                profile: {
                    name: {
                        first: s(data.user.firstName).trim().capitalize().value(),
                        middle: s(data.user.middleName).trim().capitalize().value(),
                        last: s(data.user.lastName).trim().capitalize().value()
                    }
                },
                password: _defaultEmployeePassword,
                email: data.user.email,
                roles: data.user.roles,
                agreements: data.user.agreements,
                createdByAdmin: data.user.createdByAdmin
            }

            //Make call to create the user object
            let meteorAddUserResult = Meteor.call('users.addUser', userData);

            if (meteorAddUserResult) {
                ret.userId = meteorAddUserResult;
                let employeeData = {
                    companyId: data.employee.companyId,
                    completedSignUpSteps: data.employee.completedSignUpSteps,
                    userId: ret.userId,
                    details: {
                        jobTitle: s(data.employee.details.jobTitle).trim().capitalize().value(),
                        phoneNumber: data.employee.details.phoneNumber,
                        phoneNumberExt: data.employee.details.phoneNumberExt,
                        phoneNumberType: data.employee.details.phoneNumberType
                    }
                };

                let meteorAddEmployeeResult = Meteor.call('employees.insert', employeeData);
                if (meteorAddEmployeeResult) {
                    ret.employeeId = meteorAddEmployeeResult;

                    const isEmployee = userData.roles.includes(userRoles.employee);
                    const isCompanyAdmin = userData.roles.includes(userRoles.companyAdmin);
                    const isInactive = userData.roles.includes(userRoles.inactive);
                    let adminOrEmployeeRole = (isCompanyAdmin) ? userRoles.companyAdmin : userRoles.employee;

                    let emailData = {
                        'subject': 'Your company has added you to their list of employees!',
                        'headerTitle': 'Your company has added you to their list of employees!',
                        'title': 'THIS IS A TEST',
                        'firstName': (userData.profile.name.first) ? userData.profile.name.first : 'N/A',
                        'middleName': (userData.profile.name.middle) ? userData.profile.name.middle : 'N/A',
                        'lastName': (userData.profile.name.last) ? userData.profile.name.last : 'N/A',
                        'email': userData.email,
                        'roles': s(adminOrEmployeeRole).trim().capitalize().value(),
                        'isActive': s(!isInactive).trim().capitalize().value(),
                        'password': _defaultEmployeePassword, //todo- userData.password, //need to unhash OR bring it from settings-development.json
                        'jobTitle': employeeData.details.jobTitle,
                        'phoneNum': (employeeData.details.phoneNumber) ? formatPhoneNumber(employeeData.details.phoneNumber) : 'N/A',
                        'phoneNumExt': (employeeData.details.phoneNumberExt) ? employeeData.details.phoneNumberExt : 'N/A',
                        'phoneNumType': (employeeData.details.phoneNumberType) ? employeeData.details.phoneNumberType : 'N/A',
                        'baseUrl': Meteor.absoluteUrl(),
                        'id': userData._id
                    };

                    // if( Meteor.isProduction ){
                        // #1 - on success of a company creating an employee - email employee to let them know - company has added you!
                        sendHtmlEmail(emailData.email, 'Welcome to Betagig!', emailData, 'base/employee', 'new_employee_added_employee');

                        // update emailData to prep email to send to company:
                        emailData.subject, emailData.headerTitle = 'You have added a new employee!';
                        delete emailData.password;

                        // #2 - email company to confirm they have added employee
                        sendHtmlEmail(Meteor.user().emails[0].address, 'Betagig Action: Added Employee ', emailData, 'base/company','new_employee_added_company');
                    //}
                }
            }
            return ret;

        } catch (exception) {
            throw new Meteor.Error(exception.error, exception.message);
        }
    },

    //edits user + employee objects - sends out emails to companies + new employees
    'employeeController.updateUserAndEmployee': function updateUserAndEmployee(data){
        let ret = {
            'title': 'Success! ',
            'message': "You've successfully updated an employee record! ",
            'type': 'success'
        };

        try {
            let userData = {
                profile: {
                    name: {
                        first: data.user.firstName,
                        middle: data.user.middleName,
                        last: data.user.lastName
                    }
                },
                emailAddress: data.user.email,
                roles: data.user.roles,
                agreements: data.user.agreements,
                _id: data.user._id
            };

            //Make call to create the user object
            let editProfileResult = Meteor.call('users.editProfile', userData);
            if (editProfileResult) {
                let employeeData = {
                    companyId: data.employee.companyId,
                    completedSignUpSteps: data.employee.completedSignUpSteps,
                    userId: userData._id,
                    _id: data.employee._id,
                    details: {
                        jobTitle: data.employee.details.jobTitle,
                        phoneNumber: data.employee.details.phoneNumber,
                        phoneNumberExt: data.employee.details.phoneNumberExt,
                        phoneNumberType: data.employee.details.phoneNumberType
                    }
                };

                const isEmployee = userData.roles.includes(userRoles.employee);
                const isCompanyAdmin = userData.roles.includes(userRoles.companyAdmin);
                const isInactive = userData.roles.includes(userRoles.inactive);
                let adminOrEmployeeRole = (isCompanyAdmin) ? userRoles.companyAdmin : userRoles.employee;

                let employeeUpdateResult = Meteor.call('employees.update', employeeData);

                if (employeeUpdateResult) {
                    let emailData = {
                        'subject': 'Your company has edited your employee profile!',
                        'headerTitle': 'Your company has edited your employee profile!',
                        'title': 'THIS IS A TEST',
                        'firstName': (userData.profile.name.first) ? userData.profile.name.first : 'N/A',
                        'middleName': (userData.profile.name.middle) ? userData.profile.name.middle : 'N/A',
                        'lastName': (userData.profile.name.last) ? userData.profile.name.last : 'N/A',
                        'email': userData.emailAddress,
                        'roles': s(adminOrEmployeeRole).trim().capitalize().value(),
                        'isActive': s(!isInactive).trim().capitalize().value(),
                        'jobTitle': employeeData.details.jobTitle,
                        'phoneNum': (employeeData.details.phoneNumber) ? formatPhoneNumber(employeeData.details.phoneNumber) : 'N/A',
                        'phoneNumExt': (employeeData.details.phoneNumberExt) ? employeeData.details.phoneNumberExt : 'N/A',
                        'phoneNumType': (employeeData.details.phoneNumberType) ? employeeData.details.phoneNumberType : 'N/A',
                        'baseUrl': Meteor.absoluteUrl(),
                        'id': userData._id
                    };

                    // if( Meteor.isProduction ){
                    // #1 - send out email to employee here (company has updated your profile)
                    sendHtmlEmail(emailData.email, 'Betagig Action: Employee Profile Changes', emailData, 'base/employee', 'existing_employee_updated_employee');

                    // then, update emailData to prep email to send to company:
                    emailData.subject, emailData.headerTitle = 'You have edited an employee profile!';

                    // #2 - send out email to company here (you have updated an employee record)
                    sendHtmlEmail(Meteor.user().emails[0].address, 'Betagig Action: Employee Profile Changes', emailData, 'base/company', 'existing_employee_updated_company');
                    // }
                }
            }
            return ret;
        } catch (exception) {
            let emailAlreadyExists = s.include(exception.reason, "E11000");
            let clientSideMessage = exception.message;
            //error code E11000 - is a dupe key code - create a more user friendly error message to send back
            if (emailAlreadyExists) {
                clientSideMessage = "Email is already taken. Please provide another one!"
            }
            throw new Meteor.Error(exception.error, clientSideMessage);
        }
    }
});

rateLimit({
    methods: [
    ],
    limit: 5,
    timeRange: 1000,
});
