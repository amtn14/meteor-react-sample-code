import React from 'react';
import { Grid, Row, Col, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import EduForm from '../../components/UserProfile/EduForm';
import { Bert } from 'meteor/themeteorchef:bert';
import { getMajorsArray } from './DropdownData/Majors';
import { getEducationArray } from './DropdownData/Education';
import validate from '../../../modules/validate';
import {Typeahead, Menu, MenuItem} from 'react-bootstrap-typeahead';
import PropTypes from 'prop-types';
import _ from 'underscore';
import EnumConversionHelpers from '../../methods/EnumConversionHelpers';
import SharedEnums from '../../../api/Shared/enums';
import CandidateEnums from '../../../api/Candidates/enums';

const candidateSignupStepEnums = CandidateEnums.CANDIDATE_SIGNUP_ENUM;
const educationLevelEnums = SharedEnums.EDUCATION_LEVEL_ENUM;
const MenuDivider = props => <li className="divider" role="separator" />;
const MenuHeader = props => <li {...props} className="dropdown-header" />;

class Education extends React.Component {
    constructor(props) {
        super(props);
        this.postValidationHandler = this.postValidationHandler.bind(this);
        this.renderEducationBackground = this.renderEducationBackground.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateEducation = this.validateEducation.bind(this);
        this.retrieveAndSaveAddFormRef = this.retrieveAndSaveAddFormRef.bind(this);
        this.updateStateOfAddForm = this.updateStateOfAddForm.bind(this);
        this.resetFormValuesAndState = this.resetFormValuesAndState.bind(this);
        this.validateAllAddAndEditForms = this.validateAllAddAndEditForms.bind(this);
        this.onSkipStep = this.onSkipStep.bind(this);
        this.setStateVariables = this.setStateVariables.bind(this);

        let mostRecentEdu = null;

        //check to see if user has saved at least 1 education background:
        //if there is more than 1 object, add form will be empty by default, and the ones they have added,
        //will be rendered below the add form
        if (props.candidateObj.educationBackground && props.candidateObj.educationBackground.length == 1) {
            mostRecentEdu = props.candidateObj.educationBackground[0];
        }

        this.state = {
            currentEdu: {
                school: (mostRecentEdu && mostRecentEdu.school) ? mostRecentEdu.school: [],
                major: (mostRecentEdu && mostRecentEdu.major) ? mostRecentEdu.major: [],
                startYear:(mostRecentEdu && mostRecentEdu.startYear) ? mostRecentEdu.startYear : "",
                endYear: (mostRecentEdu && mostRecentEdu.endYear) ? mostRecentEdu.endYear : "",
                degreeType: (mostRecentEdu && mostRecentEdu.degreeType) ? mostRecentEdu.degreeType: []
            },
            educationBackground: props.candidateObj.educationBackground,
            isFormValidatedAndSaved: false, //checks ONLY the main add form - false by default
            addEduRefs: {
                addFormRef: null
            },
            showAddForm: (props.candidateObj.educationBackground.length == 0) ? true : false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.educationBackground !== nextProps.candidateObj.educationBackground) {
            this.setState({'educationBackground': nextProps.candidateObj.educationBackground});
        }
    }

    componentDidMount(){
        this.props.updateCurrentStep(candidateSignupStepEnums.education.enum);    //keeping track of what step the candidate is on (on parent component)
    }

    componentWillMount(){
        this.setStateVariables(this.props);
    }

    setStateVariables(props) {

        const educationBackground = props.candidateObj.educationBackground;

        for (let i = 0; i < educationBackground.length; i++) {

            //typeahead always expects an array, even for single-selects
            let degreeType = [];
            let currentDegreeType = educationBackground[i].degreeType;

            if (currentDegreeType) {

                if (Array.isArray(currentDegreeType) && currentDegreeType.length > 0) {
                    currentDegreeType = currentDegreeType[0];
                }

                if (isNaN(currentDegreeType)) {
                    degreeType = [currentDegreeType];
                }

                else {
                    //convert enum to display name
                    const convertedStatus = EnumConversionHelpers.enumToDisplayName(educationLevelEnums, currentDegreeType);

                    if (convertedStatus.error) {
                        //todo-ky error
                        Bert.alert("Woops something went wrong, please refresh and try again!", 'danger');
                    }
                    else {
                        degreeType = [convertedStatus.value];
                    }
                }
            }

            educationBackground[i].degreeType = degreeType;
        }

    }

    onSkipStep(e) {
        e.preventDefault();
        this.props.updateCandidateValues({}, false, true); //update parent component
        this.props.jumpToStep(candidateSignupStepEnums.education.enum);
    }

    //After child component, send refs back to parent component (this one), so we can reference them here
    retrieveAndSaveAddFormRef(addEduRefs) {
        let addFormRef = {
            addFormRef: addEduRefs
        };
        this.setState({addEduRefs : addFormRef});
    }

    updateStateOfAddForm() {  //toggles the state of the form for you!
        let currentAddFormState = this.state.showAddForm;
        this.setState({showAddForm: !this.state.showAddForm});

        //form was originally hidden, but is about to show up for the user to add another edu:
        //we'll want to reset the form fields and ensure it's empty for the user:
        if (!currentAddFormState === true) {
            this.setState({isFormValidatedAndSaved: false});
            this.resetFormValuesAndState();
        }
    }

    //reset all typeahead input's value:
    resetFormValuesAndState(formRef) {
        let updatedEduRefObj = _.omit(formRef, 'addFormRef');

        if (this.state.showAddForm === true && updatedEduRefObj.schoolRef
            && updatedEduRefObj.majorRef && updatedEduRefObj.degreeRef) {
            _.mapObject(updatedEduRefObj, function(taInstance) {
                if (taInstance) {
                    let tempInstance = taInstance.getInstance();
                    if (tempInstance !== null) {
                        tempInstance.clear();
                    }
                }
            });
        }

        this.setState({
            currentEdu: {
                startYear: "",
                endYear: "",
                school: [],
                major: [],
                degreeType:[]
            },
            isFormValidatedAndSaved: false
        });
    }

    //function isValidated() is called when a user clicks on the top step nav (Basic Info, Personal Info, etc.)
    //this is how Stepzilla prevents users from moving to a different step before finishing their current step
    //*make sure each stepzilla component has this function
    //no longer required for education - as the user has the option to skip this step
    isValidated() {
        if (this.props.isOnSignupView) {
            //this step can be skipped, so we'll just run this function to update the completedSignupSteps
            this.props.updateCandidateValues({}, false, true); //update parent component
            // let isStepValid = this.validateAllAddAndEditForms();
            return true; //returning true to have stepzilla move user to the next step
        }
    }

    validateAllAddAndEditForms() {
        let isStepValid;
        let allEditFormsValid;
        let isAddFormValid;

        //if addform is showing + it hasn't been validated - validate it now:
        if ((this.state.showAddForm && this.state.isFormValidatedAndSaved === false)) {
            this.validateEducation(null, this.state.addEduRefs, true, null);
            isAddFormValid = false;
        } else {
            isAddFormValid = true;
        }

        //if the user has edit forms/educations that they have already saved - check to see if any of them are no longer valid:
        if (Array.isArray(this.state.educationBackground) && this.state.educationBackground.length > 0) {
            let invalidEdu = _.find(this.state.educationBackground, {isValid: false});
            if (!invalidEdu) {
                this.props.updateCandidateValues({educationBackground: this.state.educationBackground}, false, true); //update parent component
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

    validateEducation(e, formRef, isDoneAdding, keyRef) {
        if (e) {
            e.preventDefault();
        }

        let formToValidate;
        if (formRef) {
            if (!keyRef && this.state.showAddForm == true) {
                formToValidate = formRef.addFormRef;
            } else if (keyRef) {
                formToValidate = formRef;
            }
        }

        let validationResult;
        if (formToValidate) {
            validationResult = validate($(formToValidate), {
                rules: {
                    school: {
                        required: true,
                    },
                    major: {
                        required: true,
                    },
                    degreeType: {
                        required: true
                    },
                    startYear: {
                        required: true,
                        minlength: 4
                    },
                    endYear: {
                        required: true,
                        minlength: 4
                    }
                },
                messages: {
                    school: {
                        required: 'What school did you last attend?',
                    },
                    major: {
                        required: 'What did you study there?',
                    },
                    degreeType: {
                        required: 'What degree did you get from your school?'
                    },
                    startYear: {
                        required: 'Please provide a start year.',
                        minlength: 'Please enter a proper year for this field (4 digits)'
                    },
                    endYear: {
                        required: 'Please provide an end year.',
                        minlength: 'Please enter a proper year for this field (4 digits)'
                    }
                }
            });
        } else {
            validationResult = null;
        }
        this.postValidationHandler(validationResult, formRef, isDoneAdding, keyRef);
    }

    postValidationHandler(validator, formRef, isDoneAdding, keyRef) {
        if (validator && validator.form() == true) {
            let eduBackground = this.state.educationBackground;
            let tempObj;

            if (keyRef) {   //update existing education
                let onFocusEduObj = _.findWhere(eduBackground, {key: keyRef});

                tempObj = {
                    school: onFocusEduObj.school,
                    major: onFocusEduObj.major,
                    startYear: onFocusEduObj.startYear,
                    endYear: onFocusEduObj.endYear,
                    degreeType: onFocusEduObj.degreeType,
                    isValid: true
                };

                let updatedEduObj = _.extend(onFocusEduObj, tempObj);
                let returnedIndex = _.findIndex(eduBackground, {key: keyRef});
                eduBackground[returnedIndex] = updatedEduObj;

                this.setState({
                    educationBackground: eduBackground
                });

            } else {    //getting ready to save new education
                tempObj = {
                    school: this.state.currentEdu.school,
                    major: this.state.currentEdu.major,
                    startYear: this.state.currentEdu.startYear,
                    endYear: this.state.currentEdu.endYear,
                    degreeType: this.state.currentEdu.degreeType,
                    key: Date.now(),
                    isValid: true
                };

                eduBackground.push(tempObj);

                let handleIsDoneAdding = function() {
                    if (isDoneAdding === true) {
                        let isStepValid = this.validateAllAddAndEditForms();

                        if (isStepValid === true) {
                            //this.props.updateCandidateValues({educationBackground: eduBackground}, false, true); //update parent component
                            if (this.props.isOnSignupView) {
                                this.props.jumpToStep(candidateSignupStepEnums.education.enum);
                            } else {
                                //there's no need to render the add form. once the user clicks
                                //'save' on user profile, all saved education will be rendered
                                //through renderEducationBackground(). omitting this will result in
                                //duplicate renderings of the last saved education
                                this.setState({showAddForm: false});
                            }
                        }

                        else {
                            //isStepValid = false - the 'addForm' passed validation and is about to be saved locally,
                            //since we're inside the 'validator.form == true' code block
                            //this means the problem is one of the already added education is now invalid.
                            //updating the educationBackground in state will render as an 'edit form' and we'll need to hide the 'addForm'
                            this.setState({showAddForm: false});
                        }
                    }
                    //destroy current validation instantiation and clear out the form if the user is about to add another education history
                    validator.destroy();
                    this.resetFormValuesAndState(formRef);
                };

                this.setState({
                    educationBackground: eduBackground,
                    isFormValidatedAndSaved: true
                }, handleIsDoneAdding);
            }
        } else { //either variable 'validator' doesn't exist OR form is NOT valid:
            if (validator && validator.form() == false) {
                if (keyRef) {
                    let eduBackground = this.state.educationBackground;
                    let invalidEdu = _.findWhere(this.state.educationBackground, {key: keyRef});
                    let invalidEduReturnedIndex = _.findIndex(eduBackground, invalidEdu);
                    if (invalidEdu.isValid == null) {
                        //this check ensures that we don't bombard the user with multiple bert alerts
                        Bert.alert("Please fill out all fields before moving on!", 'danger');
                    }
                    invalidEdu.isValid = false;
                    eduBackground[invalidEduReturnedIndex] = invalidEdu;
                    this.setState({
                        educationBackground: eduBackground
                    });
                } else {
                    Bert.alert("Please fill out all fields before moving on!", 'danger');
                }
            } else if (!validator && this.state.showAddForm == false) {
                let invalidEdu = _.find(this.state.educationBackground, {isValid: false});
                if (!invalidEdu) {
                    this.props.updateCandidateValues({educationBackground: this.state.educationBackground}, false, true); //update parent component
                    if (this.props.isOnSignupView) {
                        this.props.jumpToStep(candidateSignupStepEnums.education.enum);
                    }
                } else {
                    Bert.alert("Please fill out all fields before moving on!", 'danger');
                }
            }
        }
    }

    //checks if user is updating an already saved education or adding a new one:
    handleInputChange(event, nameOfSelect, key, formRef) {

        let nameOfActiveField;
        let valOfField;

        if (!key) { //adding a new education object
            if (!nameOfSelect) {
                nameOfActiveField = event.target.name;
                valOfField = event.target.value;
            }
            else if (nameOfSelect === "degreeType") {
                nameOfActiveField = nameOfSelect;

                //doing a ternary so if they choose to clear the field we can start fresh
                valOfField = event[0] != null ? [event[0].value.toString()] : [];
            }
            else {
                //this code block will deal with select elements - param 'nameOfSelect' will NOT be null
                nameOfActiveField = nameOfSelect;
                valOfField = event;
            }

            this.state.currentEdu[nameOfActiveField] = valOfField;

            this.setState({
                currentEdu: this.state.currentEdu
            });
        }

        //updating an education object
        else {
            if (!nameOfSelect) {
                nameOfActiveField = event.target.name;
                valOfField = event.target.value;
            }
            else if (nameOfSelect === "degreeType") {
                nameOfActiveField = nameOfSelect;

                //doing a ternary so if they choose to clear the field we can start fresh
                valOfField = event[0] != null ? [event[0].value.toString()] : [];

                //look for coinciding enum according to display name
                // Object.keys(educationLevelEnums).map(
                //     function(k){
                //         const currentEnum = educationLevelEnums[k];
                //
                //         if (event[0] === currentEnum.displayName) {
                //             valOfField = [currentEnum.enum.toString()];
                //         }
                //     }
                // );
            }
            else {
                //this code block will deal with select elements - param 'nameOfSelect' will NOT be null
                nameOfActiveField = nameOfSelect;
                valOfField = event;
            }

            let currentEduBeingUpdated = _.findWhere(this.state.educationBackground, {key: key});
            if (currentEduBeingUpdated) {
                currentEduBeingUpdated[nameOfActiveField] = valOfField;
            }

            let validateEdu = function() {
                //after updating the state, we shall trigger the validate form (in case the user fully erased a field)
                if (key) {
                    this.validateEducation(null, formRef, false, key);
                }
            };

            this.setState({
                educationBackground: this.state.educationBackground
            }, validateEdu);
        }
    }

    //this function gets invoked via the element - this takes the MAJOR ARRAY and structures it
    //so we can have subcategory/labels within the dropdown (option groups):
    //Source: https://github.com/ericgio/react-bootstrap-typeahead/blob/master/example/examples/RenderingExample.react.js
    renderMajorMenu(results, menuProps) {
        let idx = 0;
        const grouped = _.groupBy(results, m => m.category);
        const items = Object.keys(grouped).sort().map(majorCat => {
            return [
                !!idx && <MenuDivider key={majorCat + "-divider"} />,
                <MenuHeader key={majorCat + "-header"}>
                    {majorCat}
                </MenuHeader>,
                _.map(grouped[majorCat], m => {
                    const item =
                        <MenuItem key={idx} option={m} position={idx}>
                            {m.label}
                        </MenuItem>;
                    idx++;
                    return item;
                }),
            ];
        });
        return <Menu {...menuProps}>{items}</Menu>;
    }

    removeEducation(e, key) {
        e.preventDefault();
        let updatedEduBackground = _.reject(this.state.educationBackground, {'key': key});
        this.setState({educationBackground: updatedEduBackground});
    }

    renderEducationBackground(key, index) {
        const edu = _.findWhere(this.state.educationBackground, {key: key});
        const educationArray = getEducationArray();

        return(
            <div key={key}>
                <form className="edu-edit" ref={form => (this[key] = form)}>
                    {/*If 'showAddForm == false, we want to make sure user has at least 1 saved education before giving them the option to delete their only education */}
                    {this.state.showAddForm === false && this.state.educationBackground.length > 1
                    || this.state.showAddForm && this.state.educationBackground.length > 0 ?
                        <Row>
                            <Col sm={12}>
                                <div className="remove-education-container">
                                    <Button className="remove-education-btn" onClick={(e) => this.removeEducation(e, key)} key={key} bsSize="small">
                                        <i title="Remove Education" className="fa fa-trash-o"></i>
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        : null }
                    <div>
                        <Row>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>School/Institution</ControlLabel>
                                    <Typeahead
                                        align="justify"
                                        maxResults={20}
                                        clearButton={true}
                                        className="bootstrap-typeahead typeahead-validation-container"
                                        onChange={(e) => this.handleInputChange(e, "school", key, this[key])}
                                        options={_.map(getEducationArray(),function(item){ return item })}
                                        placeholder="Ex. Monster's University"
                                        defaultSelected={edu.school}
                                        inputProps={{ name: 'school', 'data-isTypescriptSelect': true}}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>Major</ControlLabel>
                                    <Typeahead
                                        align="justify"
                                        maxResults={20}
                                        clearButton={true}
                                        className="bootstrap-typeahead typeahead-validation-container"
                                        onChange={(e) => this.handleInputChange(e, "major", key, this[key])}
                                        renderMenu={(results, menuProps) => this.renderMajorMenu(results, menuProps)}
                                        options={_.map(getMajorsArray(),function(item){ return item })}
                                        placeholder="Ex. History of Screaming"
                                        defaultSelected={edu.major}
                                        inputProps={{ 'name': 'major', 'data-isTypescriptSelect': true}}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={8}>
                                <FormGroup>
                                    <ControlLabel>Degree Type</ControlLabel>
                                    <Typeahead
                                        align="justify"
                                        maxResults={20}
                                        clearButton={true}
                                        className="bootstrap-typeahead typeahead-validation-container"
                                        onChange={(e) => this.handleInputChange(e, "degreeType", key, this[key])}
                                        options={_.map(
                                            educationLevelEnums, function(item) {
                                                return {
                                                    "value":item.enum,
                                                    "label":item.displayName
                                                }
                                            })}
                                        placeholder="Please select a degree type"
                                        defaultSelected={edu.degreeType}
                                        inputProps={{ 'name': 'degreeType', 'data-isTypescriptSelect': true}}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={2}>
                                <FormGroup>
                                    <ControlLabel>Start Year</ControlLabel>
                                    <input
                                        className="form-control"
                                        type="text"
                                        onChange={(e) => this.handleInputChange(e, null, key, this[key])}
                                        value={edu.startYear}
                                        name="startYear"
                                        placeholder="2009" />
                                </FormGroup>
                            </Col>
                            <Col sm={2}>
                                <FormGroup>
                                    <ControlLabel>End Year</ControlLabel>
                                    <input
                                        className="form-control"
                                        type="text"
                                        onChange={(e) => this.handleInputChange(e, null, key, this[key])}
                                        value={edu.endYear}
                                        name="endYear"
                                        placeholder="2012" />
                                </FormGroup>
                            </Col>
                        </Row>
                    </div>
                </form>
                {(this.state.educationBackground.length - 1) > index ?
                    <hr />
                    : null }
            </div>
        )
    }

    render() {

        return (
            <Col md={10} mdPush={1} className="education-container signup-step-container">
                {(this.props.isOnSignupView) ?
                    <h1>Step 3: Education</h1>
                    : null }
                <EduForm
                    validateEducation={this.validateEducation}
                    currentEdu={this.state.currentEdu}
                    showAddForm={this.state.showAddForm}
                    eduArrayLength={this.state.educationBackground.length}
                    retrieveAndSaveAddFormRef={this.retrieveAndSaveAddFormRef}
                    handleInputChange={this.handleInputChange}
                    renderMajorMenu={this.renderMajorMenu}
                    updateStateOfAddForm={this.updateStateOfAddForm}
                />
                { this.state.educationBackground.map((obj, index) => this.renderEducationBackground(obj.key, index))}
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
                        onClick={(e)=> this.validateEducation(null, this.state.addEduRefs, true, null)}
                        type="button">{(this.props.isOnSignupView) ? "Next: Job History and Skills" : "Save"}
                    </Button>
                </div>
            </Col>
        )
    }
}

Education.propTypes = {
    isOnSignupView: PropTypes.bool.isRequired
};

export default Education;
