//AN - 9/17/17 - Using this route ensures that the user is authenticated,
//email is verified and all their user-signup steps are completed

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
import NullChecks from '../../../methods/NullChecks';
import NotFound from '../../../pages/NotFound/NotFound';
import UserEnums from '../../../../api/Users/enums';
import CandidateEnums from '../../../../api/Candidates/enums';
import CompanyEnums from '../../../../api/Companies/enums';
import EmployeeEnums from '../../../../api/Employees/enums';

const userRoles = UserEnums.USER_ROLE_ENUM;
const candidateSignupStepEnums = CandidateEnums.CANDIDATE_SIGNUP_ENUM;
const companySignupStepEnums = CompanyEnums.COMPANY_SIGNUP_ENUM;
const employeeSignupStepEnums = EmployeeEnums.EMPLOYEE_SIGNUP_ENUM;

const SignupCompleted = ({ loggingIn, authenticated, component, isEditingProfile, checkVerification, match, ...rest }) => (
    <Route
        {...rest}
        render={
            (props) => {

                if (loggingIn){
                    return <div />;
                }

                if( !authenticated ){
                    return (<Redirect to="/login" />);
                }

                let userObj = rest.user;
                let userEmailExists = (userObj && !NullChecks.isNullOrEmptyArray(userObj.emails));
                let finalSignupStep;
                let redirectTo = "/user-signup";

                const isCandidate = Roles.userIsInRole(userObj, userRoles.candidate);
                const isCompanyAdmin = Roles.userIsInRole(userObj, userRoles.companyAdmin);
                const isEmployee = Roles.userIsInRole(userObj, userRoles.employee);

                if (isCandidate) {
                    finalSignupStep = candidateSignupStepEnums.uploadPicture.enum;
                } else if (isCompanyAdmin) {
                    //checks to see if the employee has finished signing up:
                    if (Meteor.user().createdByAdmin && Meteor.user().employee() && 
                        Meteor.user().employee().completedSignUpSteps && 
                        _.max(Meteor.user().employee().completedSignUpSteps) == employeeSignupStepEnums.registeredByCompany.enum) {
                            //company admin user was signed up by company admin and has not finish their signup/reset their pw + confirm to terms/conditions
                            finalSignupStep = employeeSignupStepEnums.confirmedByEmployee.enum;
                            redirectTo = "/finish-employee-signup";
                    } else {
                        finalSignupStep = companySignupStepEnums.photosInfo.enum;
                        redirectTo = "/company-signup";
                    }
                } else if (isEmployee) {
                    finalSignupStep = employeeSignupStepEnums.confirmedByEmployee.enum;
                    redirectTo = "/finish-employee-signup";
                }

                let hasCompletedSignup = (_.max(rest.userProfile.completedSignUpSteps) == finalSignupStep);

                // Add debug={true} to the instantiation in App.js to enable this logging
                if (rest.debug) {
                    console.log("User is Authenticated...");
                    console.log("Has user's email been verified? ", (userEmailExists) ? userObj.emails[0].verified : "User email/obj is null" + userObj );
                    console.log("User has the following roles:", Roles.getRolesForUser(userObj._id));
                    console.log("What steps has the user completed?", rest.userProfile.completedSignUpSteps);
                    console.log('User\'s final signup step is:', finalSignupStep);
                }

                if (userEmailExists && userObj.emails[0].verified == false) {
                    if (hasCompletedSignup) {
                        Bert.alert("Welcome back " + userObj.profile.name.first + "! You must verify your email before proceeding." , 'info');
                        return (<Redirect to="/successful-registration" />);
                    } else {
                        return (<Redirect to={redirectTo} />);
                    }
                }

                //this prop only exists if we're viewing another user's profile and need to be sure they're verified
                if (checkVerification) {

                    const match = props.match;
                    const userProfileId = match.params.userProfileId !== undefined ? match.params.userProfileId : null;
                    const userProfileType = match.params.userType !== undefined ? match.params.userType : null;

                    if (userProfileType === userRoles.company || userProfileType === userRoles.companyAdmin) {
                        Meteor.call('companyController.getUserByCompanyId', userProfileId, (error, response) => {

                            if (error || !response.data || !response.data.emails[0].verified) {
                                //child component is listening for this, once it's been set the component will switch out to notfound
                                Session.set('verified', 'notverified');
                            }
                        });
                    }

                    else {
                        Meteor.call('userController.checkVerificationByProfileId', {"userRole": userProfileType, "profileId": userProfileId}, (error, response) => {

                            if (error || !response.data || !response.data.verified) {
                                //child component is listening for this, once it's been set the component will switch out to notfound
                                Session.set('verified', 'notverified');
                            }
                        });
                    }

                }

                return (React.createElement(component, { ...props, loggingIn, authenticated, isEditingProfile }));
            }
        }
    />
);

SignupCompleted.propTypes = {
    loggingIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    authenticated: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired,
    isEditingProfile: PropTypes.bool.isRequired,
    checkVerification: PropTypes.bool
};

export default SignupCompleted;
