import React from 'react';
import {Row, Col, FormGroup, ControlLabel, Button, Checkbox, Radio} from 'react-bootstrap';
import JobForm from '../../components/UserProfile/JobForm';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Bert } from 'meteor/themeteorchef:bert';
import Geosuggest from 'react-geosuggest';
import { getLanguageArray } from './DropdownData/Languages';
import { getEthnicityObj } from './DropdownData/Ethnicity';
import { getGenderArray } from './DropdownData/Gender';
import SwitchButton from 'lyef-switch-button';
import validate from '../../../modules/validate';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import _ from 'underscore';
import '/node_modules/lyef-switch-button/css/main.css';
import '/node_modules/react-geosuggest/module/geosuggest.css';
import CandidateEnums from '../../../api/Candidates/enums';

const candidateSignupStepEnums = CandidateEnums.CANDIDATE_SIGNUP_ENUM;

class JobHistoryAndSkills extends React.Component {
    constructor(props) {
        super(props);
        this.postValidationHandler = this.postValidationHandler.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateJob = this.validateJob.bind(this);
        this.renderJobHistory = this.renderJobHistory.bind(this);
        this.handleGmapsAutoCompleteInput = this.handleGmapsAutoCompleteInput.bind(this);
        this.retrieveAddJobFormRef = this.retrieveAddJobFormRef.bind(this);
        this.updateStateOfAddForm = this.updateStateOfAddForm.bind(this);
        this.resetFormValuesAndState = this.resetFormValuesAndState.bind(this);
        this.onSkipStep = this.onSkipStep.bind(this);

        let mostRecentJob;

        if (props.candidateObj.jobHistory && props.candidateObj.jobHistory.length == 1) {
            mostRecentJob = props.candidateObj.jobHistory[0];
        }

        this.state = {
            mostRecentJobExp:{
                jobTitle: (mostRecentJob && mostRecentJob.jobTitle) ? mostRecentJob.jobTitle: "",
                isCurrentJob: (mostRecentJob && mostRecentJob.isCurrentJob) ? mostRecentJob.isCurrentJob: false,
                employer: (mostRecentJob && mostRecentJob.employer) ? mostRecentJob.employer: "",
                location: (mostRecentJob && mostRecentJob.location) ? mostRecentJob.location: "",
                startYear: (mostRecentJob && mostRecentJob.startYear) ? mostRecentJob.startYear: "",
                endYear: (mostRecentJob && mostRecentJob.endYear) ? mostRecentJob.endYear: "",
                salary: (mostRecentJob && mostRecentJob.salary) ? mostRecentJob.salary: "",
            },
            languageArray: props.candidateObj.languageArray ? props.candidateObj.languageArray : [],
            gender: (props.candidateObj.gender && props.candidateObj.gender !== "") ? props.candidateObj.gender : [],
            ethnicityArray: props.candidateObj.ethnicityArray,
            jobHistory: props.candidateObj.jobHistory,
            isVeteran: props.candidateObj.isVeteran,
            isFormValidatedAndSaved: false, //checks the add form only
            addJobRef: null,
            showAddForm: (props.candidateObj.jobHistory.length == 0) ? true : false,
        }
    }

    componentDidMount() {
        this.props.updateCurrentStep(candidateSignupStepEnums.jobHistorySkills.enum); //keeping track of what step the user is on (on parent component)
    }

    onSkipStep(e) {
        e.preventDefault();
        this.props.updateCandidateValues({}, false, true); //update parent component
        this.props.jumpToStep(candidateSignupStepEnums.jobHistorySkills.enum);
    }

    //After child component, send refs back to parent component (this one), so we can reference them here
    retrieveAddJobFormRef(addJobRef) {
        this.setState({ addJobRef:addJobRef });
    }

    updateStateOfAddForm() { //toggles the state of the form for you!
        let currentAddFormState = this.state.showAddForm;
        this.setState({showAddForm: !this.state.showAddForm});

        //form was originally hidden, but is about to show up for the user to add another job:
        //we'll want to reset the form fields and ensure it's empty for the user:
        if (!currentAddFormState === true) {
            this.setState({isFormValidatedAndSaved: false});
            this.resetFormValuesAndState();
        }
    }

    resetFormValuesAndState() {
        this.setState({
            mostRecentJobExp: {
                jobTitle: "",
                isCurrentJob: false,
                employer: "",
                location: "",
                startYear: "",
                endYear: "",
                salary: ""
            },
            isFormValidatedAndSaved: false
        });
    }

    //function isValidated() is called when a user clicks on the top step nav (Basic Info, Personal Info, etc.)
    //this is how Stepzilla prevents users from moving to a different step before finishing their current step
    //*make sure each stepzilla component has this function
    isValidated() {
        // let isStepValid = this.validateAllJobsAndSkills();
        // return isStepValid;
        //this step can be skipped, so we'll make this call to update the completedSignupstep array
        if (this.props.isOnSignupView) {
            this.props.updateCandidateValues({}, false, true); //update parent component
            return true;
        }
    }

    validateAllJobsAndSkills() {
        let isStepValid;
        let allEditFormsValid;
        let isAddFormValid;

        //if addform is showing + it hasn't been validated - validate it now:
        if ((this.state.showAddForm === true && this.state.isFormValidatedAndSaved === false)) {
            this.validateJob(null, this.state.addJobRef, true, null);
            isAddFormValid = false;
        } else {
            isAddFormValid = true;
        }

        //if the user has edit form/job that they have already saved - check to see if any of them are no longer valid:
        if (this.state.jobHistory.length > 0) {
            let invalidJob = _.find(this.state.jobHistory, { 'isValid' : false });
            if (!invalidJob) {
                let updatedStateObj = _.omit(this.state, ["mostRecentJobExp", "addJobRef", "isFormValidatedAndSaved", "showAddForm"]);
                this.props.updateCandidateValues(updatedStateObj, false, true); //update parent component
                allEditFormsValid = true;
            } else {
                allEditFormsValid = false;
            }
        } else {
            allEditFormsValid = true;
        }
        isStepValid = (allEditFormsValid && isAddFormValid);
        if (isStepValid === false) {
            Bert.alert("Please fill out all fields before moving on!", 'danger');
        }
        return isStepValid;
    }

    validateJob(e, formElToValidate, isDoneAdding, keyRef) {
        if (e) {
            e.preventDefault();
        }

        let validationResult;
        if (formElToValidate) {
            validationResult = validate($(formElToValidate), {
                rules: {
                    jobTitle: {
                        required: true,
                    },
                    employer: {
                        required: true
                    },
                    location: {
                        required: true
                    },
                    startYear: {
                        required: true,
                        minlength: 4
                    },
                    endYear: {
                        required: true,
                        minlength: 4
                    },
                    salary: {
                        required: true
                    }
                },
                messages: {
                    jobTitle: {
                        required: 'What is your current/most recent job title?',
                    },
                    employer: {
                        required: 'Who was your current/last employer?'
                    },
                    location: {
                        required: 'Where was this job located?',
                        minlength: 'Please enter a proper year for this field (4 digits)'
                    },
                    startYear: {
                        required: 'Please provide an end year.',
                        minlength: 'Please enter a proper year for this field (4 digits)'
                    },
                    endYear: {
                        required: 'Please provide an end year.',
                        minlength: 'Please enter a proper year for this field (4 digits)'
                    },
                    salary: {
                        required: 'Please provide a salary.'
                    }
                }
            });
        } else {
            validationResult = null;
        }
        this.postValidationHandler(validationResult, isDoneAdding, keyRef);
    }

    postValidationHandler(validator, isDoneAdding, keyRef) {
        if (validator && validator.form() === true) {
            let jobHistory = this.state.jobHistory;
            let tempObj;

            if (keyRef) {   //update existing job
                let activeJobObj = _.findWhere(jobHistory, {key: keyRef});
                tempObj = {
                    isCurrentJob: activeJobObj.isCurrentJob,
                    employer: activeJobObj.employer,
                    location: activeJobObj.location,
                    startYear: activeJobObj.startYear,
                    endYear: activeJobObj.endYear,
                    salary: activeJobObj.salary,
                    isValid: true
                }

                let updatedJobObj = _.extend(activeJobObj, tempObj);
                let returnedIndex = _.findIndex(jobHistory, {key: keyRef});
                jobHistory[returnedIndex] = updatedJobObj;

                this.setState({
                    jobHistory: jobHistory
                });

            //getting ready to save a new job
            } else {
                tempObj = {
                    jobTitle: this.state.mostRecentJobExp.jobTitle,
                    isCurrentJob: this.state.mostRecentJobExp.isCurrentJob,
                    employer: this.state.mostRecentJobExp.employer,
                    location: this.state.mostRecentJobExp.location,
                    startYear: this.state.mostRecentJobExp.startYear,
                    endYear: this.state.mostRecentJobExp.endYear,
                    salary: this.state.mostRecentJobExp.salary,
                    key: Date.now(),
                    isValid: true
                }

                jobHistory.push(tempObj);

                let handleIsDoneAdding = function() {
                    if (isDoneAdding) {
                        let isStepValid = this.validateAllJobsAndSkills();
                        if (isStepValid) {
                            let updatedStateObj = _.omit(this.state, ["mostRecentJobExp", "addJobRef", "isFormValidatedAndSaved", "showAddForm"]);
                            //this.props.updateCandidateValues(updatedStateObj, false, true); //update parent component
                            if (this.props.isOnSignupView) {
                                this.props.jumpToStep(candidateSignupStepEnums.jobHistorySkills.enum);
                            } else {
                                //we'll just hide the add form after a user clicks 'Save'
                                this.setState({showAddForm: false});
                            }
                        } else {
                            this.setState({showAddForm: false});
                        }
                    }
                    //we'll want to reset the form to its default if the user is about to add another job history
                    this.resetFormValuesAndState();
                    validator.destroy();
                }

                this.setState({
                    jobHistory: _.uniq(jobHistory),
                    isFormValidatedAndSaved: true
                }, handleIsDoneAdding);
            }
        } else {
            if (validator && validator.form() === false) {
                if (keyRef) {
                    let jobHistory = this.state.jobHistory;
                    let invalidJob = _.findWhere(this.state.jobHistory, {key: keyRef});
                    let invalidJobReturnedIndex = _.findIndex(jobHistory, invalidJob);
                    if (invalidJob.isValid == null) {
                        Bert.alert("Please fill out all fields before moving on!", 'danger');
                    }
                    invalidJob.isValid = false;
                    jobHistory[invalidJobReturnedIndex] = invalidJob;
                    this.setState({
                        jobHistory: jobHistory
                    });
                }
            } else if (!validator && this.state.showAddForm === false) {
                // Add form isn't showing - will do a validation check on edit forms and save any other fields they may have filled out - language/gender/etc.
                let isStepValid = this.validateAllJobsAndSkills();
                if (isStepValid) {
                    let updatedStateObj = _.omit(this.state, ["mostRecentJobExp", "addJobRef", "isFormValidatedAndSaved", "showAddForm"]);
                    this.props.updateCandidateValues(updatedStateObj, false, true); //update parent component
                    if (this.props.isOnSignupView) {
                        this.props.jumpToStep(candidateSignupStepEnums.jobHistorySkills.enum);
                    }
                } else {
                    Bert.alert("Please fill out all fields before moving on!", 'danger');
                }
            }
        }
    }

    handleGmapsAutoCompleteInput(selectedObj, key) {
        if (selectedObj && selectedObj.label) {
            if (!key) {
                this.state.mostRecentJobExp.location = selectedObj.label;
                this.setState({
                    mostRecentJobExp: this.state.mostRecentJobExp
                });
            } else {
                this.state.jobHistory[key] = selectedObj.label;
                this.setState({
                    jobHistory: this.state.jobHistory
                });
            }
        }
    }

    handleInputChange(event, nameOfSelect, key) {
        let nameOfActiveField;
        let aboutToUpdateRecentJobExp = false;
        let valOfField;

        if (!nameOfSelect) {
            if (event.target.name !== "") { //all elements will have a 'name' attribute with the exception of the gender toggle button
                nameOfActiveField  = event.target.name;
            } else if (event.target.id !== "") {
                nameOfActiveField = event.target.id; //the toggle switch does not have a name prop, lib only allows an 'id'
            }
        } else {
            nameOfActiveField = nameOfSelect;
        }

        if (nameOfActiveField === "jobTitle" || nameOfActiveField === "isCurrentJob" || nameOfActiveField === "employer"
            || nameOfActiveField === "location" || nameOfActiveField === "startYear" || nameOfActiveField === "endYear"
            || nameOfActiveField === "salary") {
            aboutToUpdateRecentJobExp = true;
        }

        if (!nameOfSelect) {
            //handles input and checkbox elements
            if (event.target.type === "checkbox") {
                if (event.target.id && event.target.id === "isVeteran") {
                    valOfField = event.target.checked;
                }
                else if (nameOfActiveField === "ethnicityArray") {
                    if (event.target.checked === true) {
                        this.state.ethnicityArray.push(event.target.value);
                        valOfField = this.state.ethnicityArray;
                    } else {
                        let returnedIndex = this.state.ethnicityArray.indexOf(event.target.value);
                        this.state.ethnicityArray.splice(returnedIndex, 1);
                        valOfField = this.state.ethnicityArray;
                    }
                }
                else if (nameOfActiveField === "isCurrentJob") {
                    valOfField = event.target.checked;
                }
            }
            else if (event.target.type !== "checkbox") {
                if (nameOfActiveField === "salary") {
                    valOfField = numeral(event.target.value).value(); //converts salary back to a number w/o any symbols
                } else {
                    valOfField = event.target.value;
                }
            }
        } else {
            //handles select elements (typeahead)
            valOfField = event;
        }

        if (aboutToUpdateRecentJobExp) {
            //if a 'key' property exist, user is editing an already saved job exp object
            if (!key) {
                this.state.mostRecentJobExp[nameOfActiveField] = valOfField;
                if (nameOfActiveField === "isCurrentJob") {
                    if (valOfField) {
                        this.state.mostRecentJobExp.endYear = "Present";
                    } else {
                        this.state.mostRecentJobExp.endYear = "";
                    }
                }
                this.setState({
                    mostRecentJobExp: this.state.mostRecentJobExp
                });
            } else {
                let selectedJob = _.find(this.state.jobHistory, {'key': key});
                selectedJob[nameOfActiveField] = valOfField;
                if (nameOfActiveField === "isCurrentJob") {
                    if (valOfField) {
                    selectedJob.endYear = "Present";
                    } else {
                        this.state.mostRecentJobExp.endYear = "";
                    }
                }
            }
        } else {
            this.setState({
                [nameOfActiveField]: valOfField
            });
        }

        let validateJob = function() {
            //after updating the state, we shall trigger the validate form (in case the user fully erased a field)
            if (key) {
                this.validateJob(null, this[key], false, key);
            }
        };

        this.setState({
            jobHistory: this.state.jobHistory
        }, validateJob);
    }

    removeJobExp(e, key) {
        e.preventDefault();
        let updatedJobHistory = _.reject(this.state.jobHistory, {'key': key});
        this.setState({jobHistory: updatedJobHistory});
    }

    renderJobHistory(key, index) {
        const job = _.findWhere(this.state.jobHistory, {key: key});
        let jobSalary = (job.salary !== "") ? numeral(job.salary).format('$ 0,0[.]00') : job.salary;
        let returnedJob = (
            <div key={key}>
                <form className="job-edit" ref={form => (this[key] = form)}>
                    {(this.state.showAddForm == true && this.state.jobHistory.length > 0) ||
                    this.state.showAddForm == false && this.state.jobHistory.length > 1 ?
                        <Row>
                            <Col sm={12}>
                                <div className="remove-job-container">
                                    <Button className="remove-job-btn" onClick={(e) => this.removeJobExp(e, key)} key={key} bsSize="small">
                                        <i className="fa fa-trash-o"></i>
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        : null }
                    <div>
                        <Row>
                            <Col xs={12}>
                                <FormGroup>
                                    <ControlLabel>Title</ControlLabel>
                                    <input
                                        className="form-control"
                                        name="jobTitle"
                                        type="text"
                                        onChange={(e) => this.handleInputChange(e, null, key)}
                                        value={job.jobTitle}
                                        placeholder="Ex. Product Manager"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>Employer</ControlLabel>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="employer"
                                        onChange={(e) => this.handleInputChange(e, null, key)}
                                        value={job.employer}
                                        placeholder="Ex. Betagig" />
                                </FormGroup>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>Location</ControlLabel>
                                    {/* Reference: https://github.com/ubilabs/react-geosuggest*/}
                                    <Geosuggest
                                        inputClassName="form-control"
                                        type="text"
                                        name="location"
                                        onSuggestSelect={(e) => this.handleGmapsAutoCompleteInput(event, key)}
                                        initialValue={job.location}
                                        country="us"
                                        placeholder="Ex. Los Angeles, CA"
                                        style={{
                                            'input': {'marginTop': '-5px'},
                                            'suggests': {'border': '1px solid #d9d9d9'},
                                            'suggestItem': {'fontSize': '1.3rem'}
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>Start Year</ControlLabel>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="startYear"
                                        onChange={(e) => this.handleInputChange(e, null, key)}
                                        value={job.startYear}
                                        placeholder="2010" />
                                </FormGroup>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>End Year</ControlLabel>
                                    <input
                                        className="form-control"
                                        type="number"
                                        onChange={(e) => this.handleInputChange(e, null, key)}
                                        value={job.endYear}
                                        disabled={job.isCurrentJob}
                                        name="endYear"
                                        placeholder="Present" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>Salary</ControlLabel>
                                    <input
                                        className="form-control"
                                        type="text"
                                        onChange={(e) => this.handleInputChange(e, null, key)}
                                        value={jobSalary}
                                        name="salary"
                                        placeholder="$xx,xxx" />
                                </FormGroup>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>Current Job</ControlLabel>
                                    <Checkbox
                                        onChange={(e) => this.handleInputChange(e, null, key)}
                                        checked={job.isCurrentJob}
                                        name="isCurrentJob">
                                    </Checkbox>
                                </FormGroup>
                            </Col>
                        </Row>
                    </div>
                </form>
            </div>
        );

        return returnedJob;
    }

    render() {
        const listOfEthnicity = getEthnicityObj();
        const component = this;

        //is invoked inside of the 'checked' attribute
        let ethnicityIsChecked = function(key){
            let isChecked = _.contains(component.state.ethnicityArray, key);
            if (isChecked) {
                return true;
            } else {
                return false;
            }
        }

        return (
            <Col md={10} mdPush={1} className="job-history-and-skills-container signup-step-container">
                {(this.props.isOnSignupView) ?
                    <h1>Step 4: Job History And Skills</h1>
                : null }
                <JobForm
                    retrieveAddJobFormRef={this.retrieveAddJobFormRef}
                    mostRecentJobExp={this.state.mostRecentJobExp}
                    jobHistoryArrayLength={this.state.jobHistory.length}
                    showAddForm={this.state.showAddForm}
                    validateJob={this.validateJob}
                    handleInputChange={this.handleInputChange}
                    handleGmapsAutoCompleteInput={this.handleGmapsAutoCompleteInput}
                    updateStateOfAddForm={this.updateStateOfAddForm}/>
                { this.state.jobHistory.map((job, index) => this.renderJobHistory(job.key, index))}
                <form className="add-job-history-form"
                      ref={form => (this.addSkillsAndMiscForm = form)}>
                    <Row className="language-container">
                        <Col sm={12}>
                            <h3>Languages</h3>
                        </Col>
                    </Row>
                    <Row className="language-container">
                        <Col sm={12}>
                            <FormGroup>
                                <Typeahead
                                    multiple
                                    align="justify"
                                    maxResults={20}
                                    clearButton={true}
                                    className="bootstrap-typeahead typeahead-validation-container"
                                    onChange={(selectedValueOrValues) => this.handleInputChange(selectedValueOrValues, "languageArray", null)}
                                    options={_.map(getLanguageArray(),function(item){ return item })}
                                    placeholder="Languages you are fluent in"
                                    defaultSelected={this.state.languageArray}
                                    inputProps={{ name: 'languageArray', 'data-isTypescriptSelect': true}}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className="veteran-container">
                        <Col sm={12}>
                            <h3>Veteran Status</h3>
                        </Col>
                    </Row>
                    <Row className="veteran-container">
                        {/* {Source: https://github.com/lyef/lyef-switch-button} */}
                        <SwitchButton
                            id="isVeteran"
                            name="isVeteran"
                            labelLeft="No"
                            labelRight="Yes"
                            isChecked={this.state.isVeteran}
                            action={(e) => this.handleInputChange(e, null, null)}
                        />
                    </Row>
                    <Row className="demographic-container">
                        <Col sm={12}>
                            <h3>
                                <span className="job-skills-custom-sub-navbar">Demographic Information </span>
                                <span className="small"> (optional)</span></h3>
                        </Col>
                    </Row>
                    <Row className="demographic-container">
                        <Col sm={3} xs={2}>
                            <h5>I am</h5>
                        </Col>
                        <Col sm={9} xs={10}>
                            <FormGroup>
                                <Typeahead
                                    align="justify"
                                    clearButton={true}
                                    className="bootstrap-typeahead typeahead-validation-container"
                                    onChange={(selectedValueOrValues) => this.handleInputChange(selectedValueOrValues, "gender", null)}
                                    options={_.map(getGenderArray(),function(item){ return item })}
                                    placeholder="Gender"
                                    defaultSelected={this.state.gender}
                                    inputProps={{ name: 'gender', 'data-isTypescriptSelect': true}}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className="demographic-container">
                        <Col md={8}>
                            <FormGroup className="ethnicity-container">
                                { Object.keys(listOfEthnicity).map((key, item, index) => <Checkbox
                                    key={key}
                                    value={listOfEthnicity[key].value}
                                    checked={ethnicityIsChecked(listOfEthnicity[key].value)}
                                    name="ethnicityArray"
                                    onChange={(e) => this.handleInputChange(e, null, null)}
                                    inline>
                                    {listOfEthnicity[key].label}
                                </Checkbox>)}
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <div className="button-container">
                                {(this.props.isOnSignupView) ?
                                <Button
                                    type="button"
                                    className="skip-current-step-btn btn-bg-dark-gray btn-fat btn-wide btn btn-default"
                                    style={{'marginRight': '18px'}}
                                    onClick={(e) => this.onSkipStep(e)}>
                                    Skip for Now
                                </Button>
                                : null }
                                <Button
                                    className="btn-bg-orange btn-fat btn-wide"
                                    onClick={(e) => this.validateJob(e, this.state.addJobRef, true, null)}>
                                    {(this.props.isOnSignupView) ? "Next: Roles and Experience" : "Save"}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </Col>
        )
    }
}

JobHistoryAndSkills.propTypes = {
    isOnSignupView: PropTypes.bool.isRequired
};

export default JobHistoryAndSkills;
