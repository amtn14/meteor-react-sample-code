import React from 'react';
import { Grid, Row, Col,
    Button, FormGroup, ControlLabel,
    OverlayTrigger, Tooltip, Alert }
    from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import validate from '../../../modules/validate';
import { Typeahead } from 'react-bootstrap-typeahead';
import { formatPhoneNumber, unformatPhoneNumber } from '../../methods/FormFieldsUiHelpers';
import { getPhoneNumberTypeArray } from '../CompanySignup/DropdownData/PhoneNumberType';
import { getUserEmployeeDefaultValues } from './UserEmployeeDefault';
import numeral from 'numeral';
import { Roles } from 'meteor/alanning:roles';
import UserEnums from '../../../api/Users/enums';
import EmployeeEnums from '../../../api/Employees/enums';
import _ from 'underscore';

const userRoles = UserEnums.USER_ROLE_ENUM;
const employeeSignupEnums = EmployeeEnums.EMPLOYEE_SIGNUP_ENUM;

class AddEditEmployeeForm extends React.Component {
    constructor(props) {
        super(props);
        this.saveOrUpdateEmployeeInfo = this.saveOrUpdateEmployeeInfo.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateEmployeeInfo = this.validateEmployeeInfo.bind(this);
        this.setupPhoneNumData = this.setupPhoneNumData.bind(this);
        this.clearFieldsAndTypeaheads = this.clearFieldsAndTypeaheads.bind(this);
        this._getListOfCompanyAdmin = this._getListOfCompanyAdmin.bind(this);
        this.handleRoleSwitchBtns = this.handleRoleSwitchBtns.bind(this);

        this.state = {
            userId: props.userEmployeeObj.userId,
            employeeId: props.userEmployeeObj._id,
            userEmployeeObj: props.userEmployeeObj, //has user and employee properties (merged)
            editMode: props.editMode,
            company: props.company,
            isDeactivated: props.userEmployeeObj.isDeactivated ? props.userEmployeeObj.isDeactivated : false,
            confirmingRoleSwitch: false,
            confirmingInactiveRole: false,
            showConfirmDeactivationOrRoleSwitchAlert: false
        }
    }

    //clears out form if user jumps from editMode==true to editMode==false
    componentWillReceiveProps(nextProps) {
        if (this.state.editMode !== nextProps.editMode) {
            this.clearFieldsAndTypeaheads();
        }
    }

    componentWillMount() {
        this.setupPhoneNumData();
    }

    setupPhoneNumData() {
        const component = this;
        //if user is on edit mode, we'll have an employee object,
        //so we'll have to setState to our userEmployeeObj
        if (this.props.editMode) {
            const copyOfuserEmployeeObj = {...this.state.userEmployeeObj};
            //massage any data before setting state variables and the component mounts
            //(i'm referring to you, typeahead -glares-)
            const setStateVariables = function(props) {
                let phoneNumberType = [];
                const currentPhoneNumberType = copyOfuserEmployeeObj.details.phoneNumberType;

                if (currentPhoneNumberType) {
                    if (Array.isArray(currentPhoneNumberType) && currentPhoneNumberType.length > 0) {
                        //NOT setting to array because it already is one
                        phoneNumberType = currentPhoneNumberType;
                    }
                    else {
                        //get phonetype array
                        Object.keys(getPhoneNumberTypeArray()).map(function(k){
                            if (getPhoneNumberTypeArray()[k].value === currentPhoneNumberType) {
                                //setting to array because it's currently an obj and typeahead expects an array
                                phoneNumberType = [getPhoneNumberTypeArray()[k]];
                            }
                        });
                    }
                }
                copyOfuserEmployeeObj.details['phoneNumberType'] = phoneNumberType;
            }
            setStateVariables(this.props);
            this.setState({ userEmployeeObj: copyOfuserEmployeeObj });
        }
    }

    clearFieldsAndTypeaheads() {
        this.setState({ userEmployeeObj: getUserEmployeeDefaultValues()}, () => {
            this._phoneNumTypeTypeahead.getInstance().clear();
            this._roleTypeahead.getInstance().clear();
        });
    }

    validateEmployeeInfo(e) {
        if (e) {
            e.preventDefault();
        }

        const rolesOfLoggedInUser = Roles.getRolesForUser(Meteor.user());
        if (rolesOfLoggedInUser.includes(userRoles.companyAdmin)){
            let validationResult = validate($(this.employeeInfoForm), {
                rules: {
                    firstName: {
                        required: true,
                    },
                    lastName: {
                        required: true,
                    },
                    emailAddress: {
                        required: true,
                        email: true,
                        validEmail: true
                    },
                    roles: {
                        required: true
                    },
                    jobTitle: {
                        required: true,
                        accept: "[a-zA-Z ]+"
                    },
                    phoneNumber: {
                        required: false,
                        //validPhoneNumber: true
                    },
                    phoneNumberExt: {
                        required: false,
                        //accept: "^[0-9]*$"
                    },
                    phoneNumberType: {
                        required: false,
                        //accept: "[a-zA-Z ]+"
                    }
                },
                messages: {
                    firstName: {
                        required: 'What\'s the employee\'s first name?',
                        accept: "Only letters and spaces are allowed in this field."
                    },
                    lastName: {
                        required: 'What\'s the employee\'s last name?',
                        accept: "Only letters and spaces are allowed in this field."
                    },
                    emailAddress: {
                        required: 'Please provide an email address.',
                        email: 'Is this email address correct?',
                        validEmail: 'Please provide a valid email address.'
                    },
                    roles: {
                        required: "Please select this employee's role."
                    },
                    jobTitle: {
                        required: 'What\'s your current title?',
                        accept: "Only letters and spaces are allowed in this field."
                    },
                    phoneNumber: {
                        required: "Please provide the best number to contact you."
                    },
                    phoneNumberExt: {
                        accept: "Only numbers are allowed in this field."
                    },
                    phoneNumberType: {
                        required: "What type of phone number did you provide?",
                        accept: "Only letters and spaces are allowed in this field."
                    },
                }
            });
            this.saveOrUpdateEmployeeInfo(validationResult);
        } else {
            Bert.alert("Whoops! Only the account admin can make edits and add employees!", 'danger');
        }
    }

    _getListOfCompanyAdmin() {
        //grabs all employees based on the _id property inside of this.props.company:
        let employeesBelongingToLoggedInCompany = this.props.company.employees().fetch();
        let usersBelongingToLoggedInCompany = [];
        let companyAdminUsers;
        _.each(employeesBelongingToLoggedInCompany,function(e,idx){
            let u = e.user();
            usersBelongingToLoggedInCompany.push(u);
        });

        //retrieves only ACTIVE company admin users
        companyAdminUsers = _.filter(usersBelongingToLoggedInCompany, function(u) {
            return u.roles.includes('company admin') && u.roles.indexOf('inactive') == -1;
        });

        return companyAdminUsers;
    }

    saveOrUpdateEmployeeInfo(validator) {
        if (validator && validator.form() === true) {
            let allowSaveOrUpdate = true;

            let userObj = {
                firstName: this.state.userEmployeeObj.firstName,
                middleName: this.state.userEmployeeObj.middleName,
                lastName: this.state.userEmployeeObj.lastName,
                email: s(this.state.userEmployeeObj.emailAddress).trim().toLowerCase().value(),
                //checks to see if items inside of the array 'roles'
                //is an object or string to grab the correct value
                roles: (this.state.userEmployeeObj.roles &&
                        this.state.userEmployeeObj.roles.length > 0 &&
                        typeof(this.state.userEmployeeObj.roles[0]) === "string" ) ?
                        [this.state.userEmployeeObj.roles[0]] :
                        [this.state.userEmployeeObj.roles[0].value],
                agreements: {
                    agreedToContract: false,
                    agreedToPrivacyPolicy: false,
                    agreedToTerms: false,
                    agreedToBonusTerms: false,
                    agreedToContractDate: new Date(),
                    agreedToPrivacyPolicyDate: new Date(),
                    agreedToTermsDate: new Date(),
                    agreedToBonusTermsDate: new Date()
                },
                createdByAdmin: true
            }

            let employeeObj = {
                companyId: this.state.company._id,
                completedSignUpSteps: [employeeSignupEnums.registeredByCompany.enum],
                details: {
                    jobTitle: this.state.userEmployeeObj.details.jobTitle,
                    phoneNumber: this.state.userEmployeeObj.details.phoneNumber,
                    phoneNumberExt: this.state.userEmployeeObj.details.phoneNumberExt,
                    phoneNumberType: (Array.isArray(this.state.userEmployeeObj.details.phoneNumberType)
                        && this.state.userEmployeeObj.details.phoneNumberType.length > 0)
                        ? this.state.userEmployeeObj.details.phoneNumberType[0].value : ""
                }
            };

            //need to do a little massaging because the labels we're
            //using for the users (Account Admin + Shadow Host) is different from what
            //we're using for our own db storage/backend (company admin + employee)
            switch(s(userObj.roles[0]).toLowerCase().trim().value()) {
                case "account admin":
                    userObj.roles = [userRoles.companyAdmin];
                    break;
                case "shadow host":
                    userObj.roles = [userRoles.employee];
                    break;
            }

            //if user is editing, we need to do a couple of checks to ensure there's always an active company-admin
            if (this.props.editMode) {
                //grab all employes users with the role "company admin"
                let listOfCompanyAdmin = this._getListOfCompanyAdmin();

                //see if the user that is going to be updated is a companyAdmin user
                let currentAdminUser = _.find(listOfCompanyAdmin, function(ca) {
                    return ca.emails[0].address == userObj.email;
                });

                //if company admin has checked the 'deactivate' checkbox,
                //we'll need to add in the 'inactive' role to the user object of that employee
                //also checking to see if value is different from what we have in the db
                if (this.state.isDeactivated && !this.props.userEmployeeObj.isDeactivated) {
                    //Before we provide an employee user with an 'inactive' role,
                    //let's check if there is at least 2 company admin
                    //(or no one will be able to add hostgigs and update employees)
                    if (listOfCompanyAdmin.length > 1 || !currentAdminUser) {
                        if (this.state.confirmingInactiveRole) {
                            userObj.roles.push('inactive');
                        } else {
                            this.setState({showConfirmDeactivationOrRoleSwitchAlert: true });
                            this.setState({confirmingInactiveRole: true });
                            allowSaveOrUpdate = false;
                        }
                    } else {
                        allowSaveOrUpdate = false;
                        Bert.alert("You are the only active account admin for this company. Please assign another employee the account admin role before setting this account to inactive.", 'danger');
                    }
                } else {
                    _.reject(userObj.roles, 'inactive');
                }

                //if the ONLY company admin is switching him/her(self) to an employee - tell them no.
                //at least ONE user associated with the company must have the company admin role
                if (userObj.roles.includes('employee') && listOfCompanyAdmin.length == 1 && currentAdminUser) {
                    allowSaveOrUpdate = false;
                    Bert.alert("You are the only active account admin for this company. Please assign another employee the account admin role before switching yourself to the 'shadow host' role.", 'danger');
                } else if (userObj.roles.includes('employee') && !this.props.userEmployeeObj.roles.includes('Shadow Host') && listOfCompanyAdmin.length > 1) {
                    //there is more than 1 company admin, but inform user that once they switch to an employee/shadow host role,
                    //they will lose the permission to add/edit employees
                    if (this.state.showConfirmDeactivationOrRoleSwitchAlert == false) {
                        this.setState({showConfirmDeactivationOrRoleSwitchAlert: true});
                        this.setState({confirmingRoleSwitch: true });
                        allowSaveOrUpdate = false;
                    }
                }
            }

            if (allowSaveOrUpdate) {
                let userAndEmployeeData = {
                    user: userObj,
                    employee: employeeObj
                };

                let methodToCall;
                if (this.props.editMode) {
                    methodToCall = 'employeeController.updateUserAndEmployee';
                    userAndEmployeeData.user._id = this.state.userId;
                    userAndEmployeeData.employee._id = this.state.employeeId;
                } else {
                    methodToCall = 'employeeController.addUserAndEmployee';
                }

                Meteor.call(methodToCall, userAndEmployeeData, (error, ret) => {
                    if (error) {
                       Bert.alert(error.reason, 'danger');
                    } else {
                        Bert.alert({
                            title: ret.title,
                            message: ret.message,
                            type: ret.type
                        });

                        //the addUserAndEmployee method will return userId + employeeId
                        if (methodToCall == 'employeeController.addUserAndEmployee') {
                            this.setState({
                                userId: ret.userId,
                                employeeId: ret.employeeId
                            });
                        }


                        if (methodToCall == 'employeeController.updateUserAndEmployee') {
                            if (this.state.confirmingRoleSwitch || this.state.confirmingInactiveRole) {
                                //reset this boolean to hide the role switch alert
                                this.setState({confirmingRoleSwitch: false});
                                this.setState({confirmingInactiveRole: false });
                                this.setState({showConfirmDeactivationOrRoleSwitchAlert: false});
                            }
                        }

                        //reset form here - but only if user is adding an employee
                        //no need to reset the form on edit mode
                        if (!this.props.editMode) {
                            this.clearFieldsAndTypeaheads();
                        }
                    }
                });
            }
        } else {
            Bert.alert("Please fill out all fields before moving on!", 'danger');
        }
    }

    handleInputChange(event, nameOfSelect) {
        let nameOfActiveField;
        let valOfField;

        if (!nameOfSelect) {
            nameOfActiveField = event.target.name;
            valOfField = event.target.value;
        } else {
            //this code block will deal with select elements - param 'nameOfSelect' will NOT be null
            //typeahead elements in this form: phoneNumType + roles:
            nameOfActiveField = nameOfSelect;
            valOfField = (Array.isArray(event) && event.length > 0) ? [event[0]] : [];
        }

        //grab instance of this.state.userEmployeeObj;
        let userEmployeeObj = {...this.state.userEmployeeObj};

        //user is on an EMPLOYEE field
        if (nameOfActiveField == "jobTitle" ||
        nameOfActiveField ==  "phoneNumber" ||
        nameOfActiveField == "phoneNumberExt" ||
        nameOfActiveField == "phoneNumberType") {

            if (nameOfActiveField === 'phoneNumber') {
                valOfField = unformatPhoneNumber(valOfField);
            }
            if (nameOfActiveField === 'phoneNumberExt') {

                const isInt = /^\d+$/.test(valOfField);

                if (isInt && (valOfField != null && valOfField !== '') && parseInt(valOfField) < 0) {
                    Bert.alert("Invalid phone number extension", 'danger');
                }

                if (!isInt) {
                    Bert.alert("Please enter only digits in phone number extension", 'danger');
                }
            }
            userEmployeeObj.details[nameOfActiveField] = valOfField;
            this.setState({userEmployeeObj: userEmployeeObj});
        } else if (nameOfActiveField == "isDeactivated"){
            valOfField = event.target.checked;
            this.setState({
                isDeactivated: valOfField
            });
        } else {    //user is on a USER field
            userEmployeeObj[nameOfActiveField] = valOfField;
            this.setState({userEmployeeObj});
        }
    }

    //toggles boolean for the confirmRoleSwitch variable - also is used to show/hide '.confirm-switch-to-employee-alert' alert
    handleRoleSwitchBtns(action, confirmPropArray) {
        if (action == 'dismiss') {
            let currentRoleBool = this.state.confirmingRoleSwitch;
            let currentInactiveBool = this.state.confirmingInactiveRole;

            if (confirmPropArray.includes("employee")) {
                this.setState({confirmingRoleSwitch: !currentRoleBool});
            }

            if (confirmPropArray.includes("inactive")) {
                this.setState({confirmingInactiveRole: !currentInactiveBool });
            }

            //checks to see if these booleans are about to switch to false - if so, we'll hide the alert
            if (!currentRoleBool==false && confirmPropArray.includes("employee") && confirmPropArray.length == 1 ||
                !currentInactiveBool==false && confirmPropArray.includes("inactive") && confirmPropArray.length == 1 ||
                !currentRoleBool == false && !currentInactiveBool == false && confirmPropArray.includes('employee') && confirmPropArray.includes('inactive') && confirmPropArray.length == 2) {
                this.setState({showConfirmDeactivationOrRoleSwitchAlert: false});
            }

        } else if (action == 'submit') {
            this.validateEmployeeInfo();
        }
    }

    render() {
        const tooltip = (
            <Tooltip id="tooltip">
                <strong>What can account admins do?</strong>
                <br />
                Account admins can add or edit employees and assign other employees the account admin role.
            </Tooltip>
        );

        const employeeRoleArray = [
            {
                'value': "Account Admin",
                'label': "Account Admin"
            },
            {
                'value': "Shadow Host",
                'label': "Shadow Host"
            }
        ];

        let confirmedPropsArray = [];
        if (this.state.confirmingRoleSwitch) {
            confirmedPropsArray.push('employee');
        }

        if (this.state.confirmingInactiveRole) {
            confirmedPropsArray.push('inactive');
        }

        return (
            <div className="employee-form-container">
                {
                    (Roles.userIsInRole( Meteor.userId(), userRoles.employee )) ?
                        <Alert bsStyle="warning">
                            <strong> Heads up! </strong> Only account admins are able to add and edit employees! If you would like to have this power, contact one of your account admins!
                        </Alert>
                    : null
                }

                {(this.state.showConfirmDeactivationOrRoleSwitchAlert && Roles.userIsInRole( Meteor.userId(), userRoles.companyAdmin )) ?
                    <Alert bsStyle="warning" className="confirm-switch-to-employee-alert">

                        Looks like you&rsquo;re trying to:
                        <ul>
                            { this.state.confirmingRoleSwitch ?
                                <li>
                                    switch this account admin's role to that of a shadow host's
                                    <br/>
                                    <span>
                                        <em>(they will no longer be able to add or
                                        edit employees)</em>
                                    </span>
                                </li>
                                : null
                            }

                            {this.state.confirmingInactiveRole ?
                                <li>
                                    deactivate this employee&rsquo;s account
                                    <br/>
                                    <span>
                                        <em>(the employee will not be able to access the dashboard until an active account admin switches
                                            them back to 'active'.)
                                        </em>
                                    </span>
                                </li>
                                : null
                            }
                        </ul>

                        <br/>
                           <p> Are you sure you would like to proceed? </p>
                        <br/>
                        <div>
                            <Button
                                style={{marginRight: '10px'}}
                                bsStyle="danger"
                                onClick={() => this.handleRoleSwitchBtns('submit')}>Yes!
                            </Button>

                            <Button
                                onClick={() => this.handleRoleSwitchBtns('dismiss', confirmedPropsArray)}>
                                Never mind!
                            </Button>

                        </div>
                    </Alert>
                : null
                }

                <form ref={form => (this.employeeInfoForm = form)}
                      onSubmit={(e) => this.validateEmployeeInfo(e)}>
                    <div>
                        {/* first name, middle name, and last name */}
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <ControlLabel>First Name</ControlLabel>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="firstName"
                                        onChange={this.handleInputChange}
                                        value={this.state.userEmployeeObj.firstName}
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
                                        value={this.state.userEmployeeObj.middleName}
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
                                        value={this.state.userEmployeeObj.lastName}
                                        placeholder="Last Name"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* email, job title, and role */}
                        <Row>
                            <Col xs={4}>
                                <FormGroup>
                                    <ControlLabel>Email</ControlLabel>
                                    <input
                                        className="form-control"
                                        type="email"
                                        name="emailAddress"
                                        onChange={this.handleInputChange}
                                        value={this.state.userEmployeeObj.emailAddress}
                                        placeholder="Email Address"
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={4}>
                                <FormGroup>
                                    <ControlLabel>Job title</ControlLabel>
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Job Title"
                                        onChange={(e) => this.handleInputChange(e)}
                                        value={this.state.userEmployeeObj.details.jobTitle}
                                        name="jobTitle"
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={4}>
                                <FormGroup>
                                    <ControlLabel>Role
                                        <OverlayTrigger placement="top" overlay={tooltip}>
                                            <i className="fa fa-question-circle-o" aria-hidden="true" style={{'paddingLeft': '4px'}}> </i>
                                        </OverlayTrigger>
                                    </ControlLabel>
                                    <Typeahead
                                        className="bootstrap-typeahead typeahead-validation-container"
                                        align="justify"
                                        clearButton={true}
                                        ref={ref => this._roleTypeahead = ref}
                                        onChange={(e) => this.handleInputChange(e, "roles")}
                                        options={_.map(employeeRoleArray,function(item){ return item })}
                                        placeholder= "Employee Role"
                                        defaultSelected={this.state.userEmployeeObj.roles}
                                        inputProps={{ 'name': 'roles', 'data-isTypescriptSelect': true}}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </div>

                    {/* phone number, ext, and type */}
                    <Row>
                        <Col sm={4}>
                            <FormGroup>
                                <ControlLabel>Phone Number</ControlLabel>
                                <input
                                    className="form-control"
                                    type="tel"
                                    name="phoneNumber"
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={(this.state.userEmployeeObj.details.phoneNumber) ? formatPhoneNumber(this.state.userEmployeeObj.details.phoneNumber): ""}
                                    placeholder="Phone Number"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <FormGroup>
                                <ControlLabel>Ext.</ControlLabel>
                                <input
                                    className="form-control"
                                    type="number"
                                    name="phoneNumberExt"
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={this.state.userEmployeeObj.details.phoneNumberExt}
                                    placeholder="Ext."
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <FormGroup>
                                <ControlLabel>Type</ControlLabel>
                                <Typeahead
                                    clearButton={true}
                                    className="bootstrap-typeahead typeahead-validation-container"
                                    align="justify"
                                    onChange={(e) => this.handleInputChange(e, "phoneNumberType")}
                                    ref={ref => this._phoneNumTypeTypeahead = ref}
                                    options={_.map(getPhoneNumberTypeArray(),function(item){ return item })}
                                    placeholder= "Phone Type"
                                    defaultSelected={this.state.userEmployeeObj.details.phoneNumberType}
                                    inputProps={{ name: 'phoneNumberType', 'data-isTypescriptSelect': true}}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12}>
                            { this.props.editMode ?
                                <div>
                                    <input type="checkbox"
                                        name="isDeactivated"
                                        className="isDeactivatedCheckbox"
                                        style={{'marginRight': '5px'}}
                                        ref={input => this.isDeactivated = input}
                                        checked={this.state.isDeactivated}
                                        onChange={this.handleInputChange} />
                                         Deactivate User?
                                </div>
                            :
                                <h3>User will be emailed instructions on how to create an account and sign in.</h3>
                            }
                        </Col>
                    </Row>

                    <br/>

                    {/* next button */}
                    <Row>
                        <Col xs={12}>
                            <div className="button-container">
                                <Button className="btn-md btn-bg-orange" type="submit">{this.props.btnText}</Button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </div>
        )
    }
}

AddEditEmployeeForm.propTypes = {
    company: PropTypes.object.isRequired,
    userEmployeeObj: PropTypes.object.isRequired,
    editMode: PropTypes.bool.isRequired,    //is the user adding/creating or editing/updating?
    btnText: PropTypes.string.isRequired    //The text that will appear for the submit form button
}
export default AddEditEmployeeForm;
