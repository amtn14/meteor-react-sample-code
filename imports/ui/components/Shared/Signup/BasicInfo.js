import React from 'react';
import { Link } from 'react-router-dom';
import { Grid,
    Row,
    Col,
    Button,
    FormGroup,
    ControlLabel }
    from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import validate from '../../../../modules/validate';
import UserEnums from '../../../../api/Users/enums';
import CandidateEnums from '../../../../api/Candidates/enums';
import CompanyEnums from '../../../../api/Companies/enums';
import _ from 'underscore';
import $ from 'jquery';

const candidateSignupStepEnums = CandidateEnums.CANDIDATE_SIGNUP_ENUM;
const companySignupStepEnums = CompanyEnums.COMPANY_SIGNUP_ENUM;
const userRoles = UserEnums.USER_ROLE_ENUM;

class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.saveBasicInfo = this.saveBasicInfo.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.createOrUpdateUser = this.createOrUpdateUser.bind(this);
        this.validateForm = this.validateBasicInfo.bind(this);

        this.state = {
            firstName: props.userObj.firstName,
            middleName: props.userObj.middleName,
            lastName: props.userObj.lastName,
            email: props.userObj.email,
            password: props.userObj.password,
            confirmPassword: props.userObj.confirmPassword,
            isFormValidatedAndSaved: false,
            termsAndPrivacyAgreed: props.userObj.agreements.agreedToTerms && props.userObj.agreements.agreedToPrivacyPolicy,
            bonusTermsAgreed: props.userObj.agreements.agreedToBonusTerms,
            contractAgreed: props.userObj.agreements.agreedToContract,
            agreements: props.userObj.agreements,
            isAnonymous: props.isAnonymous
        }
    }

    componentDidMount(){
        //keeping track of what step the user is on (on parent component)
        this.props.updateCurrentStep(candidateSignupStepEnums.basicInfo.enum);
    }

    validateBasicInfo(e) {
        if (e) {
            e.preventDefault();
        }

        let isPasswordRequired;
        //if user is signing up, pw is most definitely required,
        //otherwise, they're on their dashboard profile, and the pw fields are optional
        if (!this.props.isOnSignupView || Meteor.user()) {
            isPasswordRequired = false;
        } else {
            isPasswordRequired = true;
        }

        const bonusTermsRequired = this.props.userRole === userRoles.candidate ? true : false;

        let validationResult = validate($(this.basicInfoForm), {
            rules: {
                firstName: {
                    required: true,
                    accept: "[a-zA-Z ]+"
                },
                lastName: {
                    required: true,
                    accept: "[a-zA-Z ]+"
                },
                phoneNumber: {
                    required: true,
                    validPhoneNumber: true
                },
                email: {
                    required: true,
                    email: true,
                    validEmail: true
                },
                password: {
                    required: isPasswordRequired,
                    validPassword: isPasswordRequired
                },
                confirmPassword: {
                    required: isPasswordRequired,
                    validPassword: isPasswordRequired,
                    equalTo: document.getElementsByName('password')[0]
                },
                termsAndPrivacyAgreed: {
                    required: true,
                    checkedCheckbox: true
                },
                bonusTermsAgreed: {
                    required: bonusTermsRequired,
                    checkedCheckbox: bonusTermsRequired
                },
                contractAgreed: {
                    required: !bonusTermsRequired,
                    checkedCheckbox: !bonusTermsRequired
                }
            },
            messages: {
                firstName: {
                    required: 'What\'s your first name?',
                    accept: "Only letters and spaces are allowed in this field."
                },
                lastName: {
                    required: 'What\'s your last name?',
                    accept: "Only letters and spaces are allowed in this field."
                },
                phoneNumber: {
                    required: 'Please provide a phone number.',
                    validPhoneNumber: 'Please provide a valid phone number.'
                },
                email: {
                    required: 'Please provide an email address.',
                    email: 'Is this email address correct?',
                    validEmail: 'Please provide a valid email address.'
                },
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
                },
                bonusTermsAgreed: {
                    required: 'Please agree to the Hiring Bonus Terms and Conditions of Betagig before continuing with the registration process',
                    checkedCheckbox: 'Please agree to the Hiring Bonus Terms and Conditions of Betagig before continuing with the registration process'
                },
                contractAgreed: {
                    required: 'Please agree to the Company Contract of Betagig before continuing with the registration process',
                    checkedCheckbox: 'Please agree to the Company Contract of Betagig before continuing with the registration process'
                }
            }
        });

        this.saveBasicInfo(validationResult);
    }

    //function isValidated() is called when a user clicks on the top step nav (Basic Info, Personal Info, etc.)
    //this is how Stepzilla prevents users from moving to a different step before finishing their current step
    //*make sure each stepzilla component has this function
    isValidated() {
        if (this.props.isOnSignupView) {
            let isStepValid = this.state.isFormValidatedAndSaved;
            if (isStepValid === false) {
                this.validateBasicInfo();
            }
            return isStepValid;
        } else {
            return true; //will allow user to skip around in steps - only in dashboard
        }
    }

    saveBasicInfo(validator) {
        if (validator && validator.form() === true) {
            let updatedUserObj = _.omit(this.state, "isFormValidatedAndSaved");
            this.createOrUpdateUser(this.props.userCreated, updatedUserObj, this.state.termsAndPrivacyAgreed, this.state.bonusTermsAgreed, this.state.contractAgreed, this.state.isAnonymous);
            this.props.updateUserValues(updatedUserObj);
        } else {
            Bert.alert("Please fill out all fields before moving on!", 'danger');
        }
    }

    handleInputChange(event) {
        const nameOfActiveField = event.target.name;

        if ( nameOfActiveField === "termsAndPrivacyAgreed" ||
            nameOfActiveField === "bonusTermsAgreed" ||
            nameOfActiveField === "contractAgreed" ||
            nameOfActiveField === "isAnonymous" ) {

            this.setState({
                [nameOfActiveField]: event.target.checked
            });
        }
        else {
            let valOfField;
            if (nameOfActiveField == "email") {
                valOfField = s(event.target.value).trim().toLowerCase().value();
            } else if (nameOfActiveField == "confirmPassword" || nameOfActiveField == "password" ) {
                valOfField = event.target.value;
            } else {
                valOfField = s(event.target.value).capitalize().value();
            }

            this.setState({
                [nameOfActiveField]: valOfField
            });
        }
    }

    //Will save or update user:
    //If saving, saves to user collection in db - also signs user in:
    createOrUpdateUser(aboutToUpdateUser, userObj, termsAndPrivacyAgreed, bonusTermsAgreed, contractAgreed, isAnonymous) {
        let userSignUpRole = this.props.userRole;

        if (userSignUpRole === userRoles.company) {
            userSignUpRole = userRoles.companyAdmin;
        }

        //create user
        if (aboutToUpdateUser === false) {
            userObj.agreements.agreedToPrivacyPolicy = termsAndPrivacyAgreed;
            userObj.agreements.agreedToTerms = termsAndPrivacyAgreed;
            userObj.agreements.agreedToBonusTerms = bonusTermsAgreed;
            userObj.agreements.agreedToContract = contractAgreed;
            userObj.agreements.agreedToPrivacyPolicyDate = new Date();
            userObj.agreements.agreedToTermsDate = new Date();
            userObj.agreements.agreedToBonusTermsDate = new Date();
            userObj.agreements.agreedToContractDate = new Date();

            const user = {
                profile: {
                    name: {
                        first: userObj.firstName,
                        middle: userObj.middleName,
                        last: userObj.lastName
                    }
                },
                password: userObj.password,
                email: userObj.email,
                roles: [userSignUpRole],
                completedSignUpSteps: this.props.updateCompletedSignUpSteps(this.props.userRole, candidateSignupStepEnums.basicInfo.enum),
                agreements: userObj.agreements,
                createdByAdmin: false
            };

            Meteor.call('users.addUser', user, (error, userId) => {

                if (error) {
                    Bert.alert(error.reason.reason, 'danger');
                } else {
                    user.userId = userId;

                    if (this.props.userRole === userRoles.company) {
                        const company = {
                            'completedSignUpSteps': user.completedSignUpSteps,
                            'isVisible': true,
                            'isDeleted': false
                        };

                        Meteor.call('companies.insert', company, (error2, companyId) => {

                            if (error2) {
                                Bert.alert(error2, 'danger');
                            }
                            else {
                                user.companyId = companyId;

                                const employee = {
                                    'userId': user.userId,
                                    'companyId': user.companyId
                                };

                                Meteor.call('employees.insert', employee, (error3, employeeId) => {

                                    if (error3) {
                                        Bert.alert(error3, 'danger');
                                    }
                                    else {
                                        Bert.alert('Success! First step down.', 'success');
                                        this.setState({isFormValidatedAndSaved: true});

                                        this.props.onSaveSuccessOfUserOrProfile(this.props.userRole, {
                                            'user': {
                                                'id': user.userId
                                            },
                                            'employee':{
                                                'id': employeeId
                                            },
                                            'company':{
                                                'id': companyId
                                            }

                                        });

                                        this.props.jumpToStep(companySignupStepEnums.basicInfo.enum);

                                        Meteor.loginWithPassword(user.email, user.password, function(error4) {
                                            if (error4) {
                                                Bert.alert("Email or password invalid, please try again.", 'danger');
                                            }
                                        });
                                    }
                                });

                            }
                        });
                    }

                    //this isn't yet implemented, just laying out the code for future use - ky
                    //not being used at the moment, but may be used later down the line inside of the company dashboard - adding an employee - an/ky
                    else if (this.props.userRole === userRoles.companyAdmin || this.props.userRole === userRoles.employee) {

                        const employee = {
                            'userId': user.userId,
                            'companyId': this.props.companyId,  //todo this isn't yet implemented, just laying out the code for future use - ky
                            'completedSignUpSteps': user.completedSignUpSteps
                        };

                        Meteor.call('employees.insert', employee, (error) => {
                            if (error) {
                                Bert.alert(error, 'danger');
                            }
                            else {
                                Bert.alert('Success! First step down.', 'success');
                                this.setState({isFormValidatedAndSaved: true});
                                this.props.onSaveSuccessOfUserOrProfile(this.props.userRole);
                                this.props.jumpToStep(companySignupStepEnums.basicInfo.enum);
                            }
                        });
                    }
                    else if (this.props.userRole === userRoles.candidate) {
                        const candidate = {
                            'userId': user.userId,
                            'completedSignUpSteps': user.completedSignUpSteps,
                            'isAnonymous': isAnonymous
                        };

                        Meteor.call('candidates.insert', candidate, (error2, result) => {
                            if (error2) {
                                Bert.alert(error2.reason, 'danger');
                            }
                            else {
                                Bert.alert('Success! First step down.', 'success');
                                this.setState({isFormValidatedAndSaved: true});
                                this.props.onSaveSuccessOfUserOrProfile(this.props.userRole, {
                                    'candidate':{
                                        'id': result
                                    },
                                    'user': {
                                        'id': user.userId
                                    }
                                });

                                this.props.jumpToStep(candidateSignupStepEnums.basicInfo.enum);

                                Meteor.loginWithPassword(user.email, user.password, function(error3) {
                                    if (error3) {
                                        Bert.alert("Email or password invalid, please try again.", 'danger');
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
        //update user
        else {
            let userProfile  = {...userObj};
            const deniedProperties = ['email', 'password', 'confirmPassword', 'isFormValidatedAndSaved', 'agreements'];

            Object.keys(userProfile)
                .filter(key => deniedProperties.includes(key))
                .forEach(key => delete userProfile[key]);

            const profile = {
                emailAddress: userObj.email,
                profile: {
                    name: {
                        first: userProfile.firstName,
                        middle: userProfile.middleName,
                        last: userProfile.lastName
                    }
                },
                _id: Meteor.userId()
            };

            let isCandidateRole = Meteor.user().roles.includes(userRoles.candidate);
            let candidateProfile = null;

            if (isCandidateRole) {
                candidateProfile = {
                    _id: Meteor.user().candidate()._id,
                    isAnonymous: isAnonymous
                };
            }

            if (userObj.password && userObj.confirmPassword
                && userObj.password !== "" && userObj.confirmPassword !== ""
                && (userObj.password === userObj.confirmPassword)) {

                profile.password = Accounts._hashPassword(userObj.password);
            }

            Meteor.call('users.editProfile', profile, (error) => {
                if (error) {
                    let emailAlreadyExists = s.include(error.reason, "E11000");
                    //error code E11000 - is a dupe key code
                    let errorMsg = error.reason;

                    if (emailAlreadyExists) {
                        errorMsg = "Email is already taken. Please provide another one!"
                    }

                    Bert.alert(errorMsg, 'danger');

                } else {
                    if (!isCandidateRole) {
                        //'users.editProfile' was the last call - give user a success msg
                        Bert.alert('Successfully saved your changes!', 'success');
                    } else {
                        Meteor.call('candidates.update', candidateProfile, (error, ret) => {
                            if (error) {
                                console.log("ERROR: ",error);
                            } else {
                                Bert.alert('Successfully saved your changes!', 'success');
                                this.setState({isFormValidatedAndSaved: true});

                                if (this.props.isOnSignupView) {
                                    this.props.jumpToStep(candidateSignupStepEnums.basicInfo.enum);
                                }
                            }
                        });
                    }
                }
            });
        }
    }

    render() {
        return (
            <Col md={10} mdPush={1} className="basic-info-container signup-step-container">
                {(this.props.isOnSignupView) ?
                    <h1>Step 1: Basic Info</h1>
                    : null }
                <form ref={form => (this.basicInfoForm = form)} onSubmit={(e) => this.validateBasicInfo(e)}>
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <ControlLabel>First Name</ControlLabel>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="firstName"
                                    onChange={this.handleInputChange}
                                    value={this.state.firstName}
                                    placeholder="First Name"
                                />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <ControlLabel>Middle Name</ControlLabel>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="middleName"
                                    onChange={this.handleInputChange}
                                    value={this.state.middleName}
                                    placeholder="Middle Name"
                                />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <ControlLabel>Last Name</ControlLabel>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="lastName"
                                    onChange={this.handleInputChange}
                                    value={this.state.lastName}
                                    placeholder="Last Name"
                                />
                            </FormGroup>
                        </Col>
                    </Row>



                    {/* email */}
                    <Row>
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Email</ControlLabel>
                                <input
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    onChange={this.handleInputChange}
                                    value={this.state.email}
                                    placeholder="Email Address"
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* password */}
                    <Row style={{marginBottom:'0px'}}>
                        <Col md={6}>
                            <FormGroup>
                                {this.props.isOnSignupView ?
                                    <ControlLabel>Password</ControlLabel>
                                    :
                                    <ControlLabel>New Password</ControlLabel>
                                }
                                <input
                                    className="form-control"
                                    type="password"
                                    name="password"
                                    onChange={this.handleInputChange}
                                    value={this.state.password}
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
                                    onChange={this.handleInputChange}
                                    value={this.state.confirmPassword}
                                    placeholder="Confirm Password"
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* password note */}
                    <Row style={{marginTop:'0px'}}>
                        <Col xs={12}>
                            <div className="password-instructions">
                                <div className="create-password">
                                    <i className='fa fa-info-circle' aria-hidden='true'> </i>&nbsp;
                                    Password must contain at least 8 characters, one uppercase, and one special character.
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <div className="agreements-container">
                        {

                            this.props.userRole === userRoles.candidate ?
                                <Row style={{marginTop:'0px'}}>
                                    <Col xs={12} style={{'marginBottom': '24px'}}>
                                        <div className="">
                                            <FormGroup className="no-margin">
                                                <ControlLabel>Protect My Identity</ControlLabel>
                                                <input type="checkbox"
                                                       name="isAnonymous"
                                                       checked={this.state.isAnonymous}
                                                       onChange={this.handleInputChange} />
                                                <span> Protect my identity (name & photo) from companies browsing for candidates</span>
                                            </FormGroup>
                                        </div>
                                    </Col>
                                </Row>
                                : null
                        }

                        {/* agreements */}
                        {(this.props.isOnSignupView) ?
                            <Row style={{marginBottom:'0px'}}>
                                <Col xs={12}>
                                    <div className="">
                                        <FormGroup className="no-margin">
                                            <input type="checkbox"
                                                   name="termsAndPrivacyAgreed"
                                                   checked={this.state.termsAndPrivacyAgreed}
                                                   onChange={this.handleInputChange} />
                                            <span> I have read and agreed to the <Link to="/Terms" target="_blank" className="orange-link"> Terms and Conditions </Link> and <Link to="/Privacy" target="_blank" className="orange-link"> Privacy and Policies </Link> of Betagig.</span>
                                        </FormGroup>
                                    </div>
                                </Col>
                            </Row>
                            : null }

                        {
                            this.props.userRole === userRoles.candidate && this.props.isOnSignupView ?
                                <Row style={{marginTop:'0px'}}>
                                    <Col xs={12}>
                                        <div className="">
                                            <FormGroup className="no-margin">
                                                <input type="checkbox"
                                                       name="bonusTermsAgreed"
                                                       checked={this.state.bonusTermsAgreed}
                                                       onChange={this.handleInputChange} />
                                                <span> I have read and agreed to the <Link to="/bonus-terms" target="_blank" className="orange-link"> Hiring Bonus Terms and Conditions </Link> of Betagig.</span>
                                            </FormGroup>
                                        </div>
                                    </Col>
                                </Row>
                                : null
                        }
                        { this.props.userRole !== userRoles.candidate && this.props.isOnSignupView ?
                            <Row style={{marginTop:'0px'}}>
                                <Col xs={12}>
                                    <div className="">
                                        <FormGroup className="no-margin">
                                            <input type="checkbox"
                                                   name="contractAgreed"
                                                   checked={this.state.contractAgreed}
                                                   onChange={this.handleInputChange} />
                                            <span> I have read and agreed to the <Link to="/company-contract" target="_blank" className="orange-link"> Company Contract agreement </Link> of Betagig.</span>
                                        </FormGroup>
                                    </div>
                                </Col>
                            </Row>
                            : null
                        }
                    </div>

                    {/* next button */}
                    <Row>
                        <Col xs={12}>
                            <div className="button-container">
                                <Button className="btn-bg-orange btn-fat btn-wide" type="submit">{(this.props.isOnSignupView) ? "Next: Tell Us About Yourself" : "Save"}</Button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </Col>
        )
    }
}

BasicInfo.propTypes = {
    isOnSignupView: PropTypes.bool.isRequired
};

export default BasicInfo;
