import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router-dom';
import { Alert,
         Grid,
         Button,
         Row,
         Col,
         ControlLabel,
         FormGroup }
    from 'react-bootstrap';
import validate from '../../../modules/validate';
import _ from 'underscore';
import EmployeeEnums from '../../../api/Employees/enums';
const employeeSignupEnums = EmployeeEnums.EMPLOYEE_SIGNUP_ENUM;

class EmployeeSignup extends React.Component {
    handleSubmit(e) {
        const component = this;
        e.preventDefault();

        //#1 - validate passwords and ensure terms + conditions checkbox is ticked:
        let validationResult = validate($(this.employeeFinishSignupForm), {
            rules: {
                password: {
                    required: true,
                    validPassword: true
                },
                confirmPassword: {
                    required: true,
                    validPassword: true,
                    equalTo: document.getElementsByName('password')[0]
                },
                termsAndPrivacyAgreed: {
                    required: true,
                    checkedCheckbox: true
                }
            },
            messages: {
                password: {
                    required: 'Please provide a password.',
                    validPassword: "Password must be at least 8 characters in length, contain 1 special character and 1 uppercase letter."
                },
                confirmPassword: {
                    required: 'Please provide a password.',
                    validPassword: "Password must be at least 8 characters in length, contain 1 special character and 1 uppercase letter.",
                    equalTo: "Passwords must match!"
                },
                termsAndPrivacyAgreed: {
                    required: 'Please agree to the Terms and Conditions and Privacy and Policies of Betagig before continuing with the registration process',
                    checkedCheckbox: 'Please agree to the Terms and Conditions and Privacy and Policies of Betagig before continuing with the registration process'
                }
            }
        });

        //#2 - build out userObj + employeeObj storing all properties that need to be shipped to the server side
        let userObj = {
            _id: Meteor.userId(),
            emailAddress: s(Meteor.user().emails[0].address).trim().toLowerCase().value(),
            password: "",
            profile: {
                name: {
                    first: Meteor.user().profile.name.first,
                    middle: Meteor.user().profile.name.middle,
                    last: Meteor.user().profile.name.last
                }
            },
            roles: Meteor.user().roles,
            agreements: {
                agreedToPrivacyPolicy : this.termsAndPrivacyAgreed.checked,
                agreedToTerms : this.termsAndPrivacyAgreed.checked,
                agreedToBonusTerms : false,
                agreedToContract : false,
                agreedToPrivacyPolicyDate : new Date(),
                agreedToTermsDate : new Date(),
                agreedToBonusTermsDate : new Date(),
                agreedToContractDate : new Date()
            },
            verifyEmail: true 
            //^indicates that we're going to manually verify this users' account w/o sending an email
        }

        let employeeObj = {
            companyId: Meteor.user().employee().companyId,
            completedSignUpSteps: [employeeSignupEnums.registeredByCompany.enum, employeeSignupEnums.confirmedByEmployee.enum],                
            details: {
                jobTitle: Meteor.user().employee().details.jobTitle,
                phoneNumber: Meteor.user().employee().details.phoneNumber,
                phoneNumberExt: Meteor.user().employee().details.phoneNumberExt,
                phoneNumberType: (Array.isArray(Meteor.user().employee().details.phoneNumberType) 
                    && Meteor.user().employee().details.phoneNumberType.length > 0) 
                    ? Meteor.user().employee().details.phoneNumberType[0].value : ""
            },
            _id: Meteor.user().employee()._id
        };

        //#3 - hit Meteor.call() and save fields once the form is valid
        if (validationResult && validationResult.form()) {
            const pw = this.password.value.trim();
            const confirmPw = this.confirmPassword.value.trim();
    
            if (pw && confirmPw
                && pw !== "" && confirmPw !== ""
                && pw === confirmPw) {
                    userObj['password'] = Accounts._hashPassword(pw);
            }

            //update USER + EMPLOYEE objects:
            Meteor.call('users.editProfile', userObj, (error) => {
                if (error) {
                    Bert.alert(error, 'danger');
                } else {
                    Meteor.call('employees.update', employeeObj, (error) => {
                        if (error) {
                            Bert.alert(error, 'danger');
                        } else {
                            Bert.alert('Successfully updated your password! Directing you to your dashboard now!', 'success');

                            setTimeout(function () {
                                component.props.history.push('/dashboard');
                            }, 3000);
                        }
                    });
                }
            });
        } else {
            Bert.alert("Please fill out all fields before moving on!", 'danger');
        }
    }
    
    render() {
        return(
            <div>
                <Row>
                    <Col sm={12}>
                        <h3 className="success-sub-header">
                            <span className="text-block">Just one step away from seeing your dashboard! 
                                <br/> 
                                It's time to reset your password!
                            </span>
                        </h3>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                    <form ref={(form) => this.employeeFinishSignupForm = form }>
                        {/* password */}
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <ControlLabel>New Password</ControlLabel>
                                    <input
                                        className="form-control"
                                        type="password"
                                        name="password"
                                        ref={password => (this.password = password)}
                                        placeholder="Password"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <ControlLabel>Confirm Password</ControlLabel>
                                    <input
                                        className="form-control"
                                        type="password"
                                        name="confirmPassword"
                                        ref={confirmPassword => (this.confirmPassword = confirmPassword)}
                                        placeholder="Confirm Password"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* password note */}
                        <Row>
                            <Col xs={12}>
                                <div className="password-instructions">
                                    <div className="create-password">
                                        <i className='fa fa-info-circle' aria-hidden='true'> </i>&nbsp;
                                        Password must contain at least 8 characters, one uppercase, and one special character.
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <br/>

                        {/* agreements */}
                            <Row style={{marginBottom:'0px'}}>
                                <Col xs={12}>
                                    <div className="agreements-container">
                                        <FormGroup>
                                            <input type="checkbox"
                                                name="termsAndPrivacyAgreed"
                                                ref={termsAndPrivacyAgreed => (this.termsAndPrivacyAgreed = termsAndPrivacyAgreed)}
                                            />
                                            <span> I have read and agreed to the <Link to="/Terms" target="_blank" className="orange-link"> Terms and Conditions </Link> and <Link to="/Privacy" target="_blank" className="orange-link"> Privacy and Policies </Link> of Betagig.</span>
                                        </FormGroup>
                                    </div>
                                </Col>
                            </Row>
                    </form>
                    </Col>
                </Row>
                <Row className="button-container" style={{textAlign: "center"}}>
                    <Col xs={12} style={{marginBottom:"10px", marginTop: "10px"}}>
                        <Button bsStyle="default" className="btn-fat btn-wide" onClick={(e) => this.handleSubmit(e)}>
                            Reset Password
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default EmployeeSignup;
