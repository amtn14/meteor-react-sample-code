import React from 'react';
import {Grid,
    Row,
    Col,
    FormGroup,
    Button,
    Checkbox,
    OverlayTrigger,
    Tooltip }
    from 'react-bootstrap';
import AdditionalLinkInput from '../../components/UserProfile/AdditionalLinkInput';
import validate from '../../../modules/validate';
import { Bert } from 'meteor/themeteorchef:bert';
import Dropzone from '../../components/Shared/Dropzone';
import EnumConversionHelpers from '../../methods/EnumConversionHelpers';
import NullChecks from '../../methods/NullChecks';
import { getSkillsArray } from '../Shared/Signup/DropdownData/Skills';
import { getSpecificDevRolesObj } from './DropdownData/SpecificDevRoles';
import { Typeahead } from 'react-bootstrap-typeahead';
import _ from 'underscore';
import PropTypes from 'prop-types';
import SharedEnums from '../../../api/Shared/enums';
import CandidateEnums from '../../../api/Candidates/enums';

const candidateSignupStepEnums = CandidateEnums.CANDIDATE_SIGNUP_ENUM;
const experienceLevelEnums = SharedEnums.EXPERIENCE_LEVEL_ENUM;

class RolesAndExperience extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.s3UploadCallback = this.s3UploadCallback.bind(this);
        this.validateRolesAndExp = this.validateRolesAndExp.bind(this);
        this.postValidationHandler = this.postValidationHandler.bind(this);
        this.deleteUploadedFile = this.deleteUploadedFile.bind(this);

        this.state = {
            desiredRole: props.candidateObj.desiredRole,
            yearsOfExp: props.candidateObj.yearsOfExp,
            topFiveSkillsArray: props.candidateObj.topFiveSkillsArray,
            specificRolesArray: props.candidateObj.specificRolesArray,
            isFormValidatedAndSaved: false,
            linkedInUrl: props.candidateObj.linkedInUrl,
            additionalLinkInputs: props.candidateObj.additionalLinkInputs,   //additional link - html elements
            additionalLinks: props.candidateObj.additionalLinks,         //array of objects with link + key
            uploadedFiles: props.candidateObj.uploadedFiles
        }
    }

    componentDidMount(){
        this.props.updateCurrentStep(candidateSignupStepEnums.rolesExperience.enum); //keeping track of what step the user is on (on parent component)
    }

    componentWillMount(){
        this.setStateVariables(this.props);
    }

    setStateVariables(props) {
        //typeahead always expects an array, even for single-selects
        let yearsOfExp = [];
        const currentYearsOfExp = props.candidateObj.yearsOfExp;

        if (!NullChecks.isNullOrEmptyArray(currentYearsOfExp)) {
            if (isNaN(currentYearsOfExp[0])) {
                //not setting to array because it's already an array
                yearsOfExp = currentYearsOfExp;
            }

            else {
                //convert enum to display name
                const convertedStatus = EnumConversionHelpers.enumToDisplayName(experienceLevelEnums, currentYearsOfExp[0]);

                if (convertedStatus.error) {
                    //todo-ky error
                    Bert.alert("Woops something went wrong, please refresh and try again!", 'danger');
                }
                else {
                    yearsOfExp = [convertedStatus.value];
                }
            }
        }

        this.setState({
            ['yearsOfExp']: yearsOfExp
        });

    }

    validateRolesAndExp(e) {
        if (e) {
            e.preventDefault();
        }

        let validationResult = validate(this.rolesAndExpForm, {
            rules: {
                desiredRole: {
                    required: true
                },
                yearsOfExp: {
                    required: true
                },
                topFiveSkillsArray: {
                    matchArrayLength: 2
                },
                specificRolesArray: {
                    required: true
                },
                linkedInUrl: {
                    required: true,
                    validUrl: true,
                    linkedIn: true
                },
                personalWebsiteUrl: {
                    validUrl: true
                },
                githubUrl: {
                    validUrl: true
                }
            },
            messages: {
                desiredRole: {
                    required: 'What type of role are you looking for?'
                },
                yearsOfExp: {
                    required: 'How many years of experience do you have in this role?'
                },
                topFiveSkillsArray: {
                    matchArrayLength: 'Let us know what 5 skills you excel at!'
                },
                specificRolesArray: {
                    required: 'Let us know which specific roles you\'re interested in!',
                },
                linkedInUrl: {
                    required: "Please provide a link to your LinkedIn profile!",
                    linkedIn: "Must be www.linkedin.com/in/YourProfile"
                }
            }
        });

        this.postValidationHandler(validationResult);
    }

    //function isValidated() is called when a user clicks on the top step nav (Basic Info, Personal Info, etc.)
    //this is how Stepzilla prevents users from moving to a different step before finishing their current step
    //*make sure each stepzilla component has this function
    isValidated() {
        if (this.props.isOnSignupView) {
            let isStepValid = this.state.isFormValidatedAndSaved;
            if (isStepValid === false) {
                this.validateRolesAndExp();
            }
            return isStepValid;
        } else {
            return true;
        }
    }

    handleInputChange(event, nameOfSelect, additionalLinkKey) {
        let nameOfActiveField;
        let valOfField;

        if (!nameOfSelect) {
            nameOfActiveField = event.target.name;
            if (event.target.type === "checkbox") {
                if (nameOfActiveField !== "specificRolesArray") {
                    valOfField = event.target.checked;
                } else {
                    if (event.target.checked === true) {
                        this.state.specificRolesArray.push(event.target.value);
                        valOfField = this.state.specificRolesArray;
                    } else {
                        let returnedIndex = this.state.specificRolesArray.indexOf(event.target.value);
                        this.state.specificRolesArray.splice(returnedIndex, 1);
                        valOfField = this.state.specificRolesArray;
                    }
                }
            } else if (event.target.type !== "checkbox") {
                if (nameOfActiveField === "linkedInUrl") {
                    this.setState({
                        isFormValidatedAndSaved: true
                    });
                }
                if (nameOfActiveField !== "additionalWebsite" && nameOfActiveField !== "githubUrl" && nameOfActiveField !== "personalWebsiteUrl") {
                    valOfField = event.target.value;
                } else {
                    let linkArray = this.state.additionalLinks;
                    let linkIndex = _.findIndex(linkArray, {'id': additionalLinkKey});

                    if (linkIndex !== -1) { //link has already been saved in the array - need to find and update it
                        linkArray[linkIndex].link = event.target.value;
                    } else {  //link has NOT been saved - need to create a new tempObj to define it and push to array
                        let tempObj = {
                            'id': additionalLinkKey,
                            'link': event.target.value
                        };
                        linkArray.push(tempObj);
                    }
                    valOfField = linkArray;
                    nameOfActiveField = "additionalLinks";
                }
            }
        }

        else if (nameOfSelect === "yearsOfExp") {
            nameOfActiveField = nameOfSelect;

            //doing a ternary so if they choose to clear the field we can start fresh
            valOfField = event[0] != null ? [event[0].value.toString()] : [];
        }
        else {
            //this code block will deal with select elements - param 'nameOfSelect' will NOT be null
            nameOfActiveField = nameOfSelect;
            valOfField = event;

            if (nameOfActiveField === "desiredRole" && !NullChecks.isNullOrEmptyArray(valOfField) && valOfField[0].value !== "Software Engineering") {
                this.setState({
                    'specificRolesArray': []    //reset to empty array if user does not select 'software engineering'
                });
            }
        }

        this.setState({
            [nameOfActiveField]: valOfField
        });
    }

    postValidationHandler(validator) {
        if (validator.form() == true) {
            // if (this.state.desiredRole == null || this.state.desiredRole.length == 0) {
            //     Bert.alert("Please select a role from the dropdown!", 'danger');
            // }

            // else if (this.state.yearsOfExp == null) {
            //     Bert.alert("Please select years of experience from the dropdown!", 'danger');
            // }

            // else if (this.state.topFiveSkillsArray == null || this.state.topFiveSkillsArray.length == 0) {
            //     Bert.alert("Please select your top five skills from the dropdown!", 'danger');
            // }

            //else {
            let updatedCandidateObj = _.omit(this.state, ["isFormValidatedAndSaved", "additionalLinkInputs"]);
            this.props.updateCandidateValues(updatedCandidateObj, false, true);   //update parent component and makes an update call to db
            if (this.props.isOnSignupView) {
                this.props.jumpToStep(candidateSignupStepEnums.rolesExperience.enum);
            }
            //}

        } else {
            Bert.alert("Please fill out all fields before moving on!", 'danger');
        }
    }

    s3UploadCallback(error, result) {
        let uploadedFiles = this.state.uploadedFiles;
        uploadedFiles.push(result);
        if (result) {
            this.setState({
                uploadedFiles: uploadedFiles
            }, ()=> {Bert.alert('File uploaded!', 'success')});
        } else {
            Bert.alert('Error uploading: ' + error, 'danger');
        }
    }

    deleteUploadedFile(e, fileUrl) {
        e.preventDefault();
        let updatedUploadedFilesArray = _.without(this.state.uploadedFiles, fileUrl);

        this.setState({
            uploadedFiles: updatedUploadedFilesArray
        });
    }

    renderUploadedFiles(uploadedFile, index) {
        function truncate(string){
            if (string.length >= 32)
                return  '...' + string.slice(-32);
            else
                return string;
        };

        let key = uploadedFile + "_" + Date.now();
        let urlShortened = truncate(uploadedFile);

        return(
            <div key={key}>
                <i className="fa fa-trash-o" onClick={(e) => this.deleteUploadedFile(e, uploadedFile)} title="Delete Uploaded File" aria-hidden="true"> </i>
                <a className="uploaded-file-url" href={uploadedFile} title={uploadedFile} target="_blank">
                    { urlShortened }
                </a>
            </div>
        )
    }

    render() {
        let desiredRoleOptions;
        const component = this;

        this.props.careerArray.map(function(currentCareer, index, array) {
            let tempObj = {
                value: currentCareer.title,
                label: currentCareer.title
            };
            array[index] = Object.assign(array[index], tempObj);
            if ((array.length - 1) == index) {
                desiredRoleOptions = array;
            }
        });

        //populates the 'specific role' checkboxes if user returns to this view after already saving it
        let specificRoleIsChecked = function(key){
            let isChecked = _.contains(component.state.specificRolesArray, key);
            if (isChecked) {
                return true;
            } else {
                return false;
            }
        };

        const tooltip = (
            <Tooltip id="tooltip">
                <strong>Some examples, you say?</strong>
                <br />
                Portfolios, certificates, anything you feel would help showcase your talents and skills!</Tooltip>
        );

        //customize your dropzone component:
        const dzConfigObj = {
            //https://github.com/felixrieseberg/React-Dropzone-Component
            componentConfig:{
                postUrl: 'no-url',
                showFiletypeIcon: false
            },
            eventHandlers:{
            },
            //http://www.dropzonejs.com/#events
            djsConfig:{
                autoProcessQueue: true,
                dictDefaultMessage: "Drop your files here to upload <p class='small'>(Or click here to select them!)</p>",
                addRemoveLinks: false,
                parallelUploads: 1,
                acceptedFiles: "image/*, application/msword, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }
        };

        let github = _.find(this.state.additionalLinks, {'id': 'github'});
        github = (github) ? github.link : "";
        let personalWebsite1 = _.find(this.state.additionalLinks, {'id': 'personalWebsite1'});
        personalWebsite1 = (personalWebsite1) ? personalWebsite1.link : "";
        let personalWebsite2 = _.find(this.state.additionalLinks, {'id': 'personalWebsite2'});
        personalWebsite2 = (personalWebsite2) ? personalWebsite2.link : "";
        let personalWebsite3 = _.find(this.state.additionalLinks, {'id': 'personalWebsite3'});
        personalWebsite3 = (personalWebsite3) ? personalWebsite3.link : "";

        return (
            <Col md={10} mdPush={1} className="roles-and-experience-container signup-step-container">
                {(this.props.isOnSignupView) ?
                    <h1>Step 5: Roles and Experience</h1>
                    : null }
                <form className="roles-and-exp-form" ref={form => (this.rolesAndExpForm = form)}  onSubmit={(e) => this.validateRolesAndExp(e)}>
                    <Row>
                        <Col sm={6} className="roles-and-exp-label">
                            <h5>What type of role are you looking for?</h5>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Typeahead
                                    className="bootstrap-typeahead typeahead-validation-container"
                                    onChange={(selectedValueOrValues) => this.handleInputChange(selectedValueOrValues, "desiredRole")}
                                    options={_.map(desiredRoleOptions,function(item){ return item })}
                                    placeholder= "Desired Role"
                                    align="justify"
                                    clearButton={true}
                                    defaultSelected={this.state.desiredRole}
                                    inputProps={{ 'name': 'desiredRole', 'data-isTypescriptSelect': true}}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    { !NullChecks.isNullOrEmptyArray(this.state.desiredRole) ?
                        <Row>
                            <Col sm={6} className="roles-and-exp-label">
                                <h5>How many years of professional experience do you have in {
                                    (!NullChecks.isNullOrEmptyArray(this.state.desiredRole) && typeof(this.state.desiredRole[0]) == "string")
                                        ?
                                        this.state.desiredRole[0]
                                        :
                                        this.state.desiredRole[0].value
                                }?</h5>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    <Typeahead
                                        className="bootstrap-typeahead typeahead-validation-container"
                                        onChange={(selectedValueOrValues) => this.handleInputChange(selectedValueOrValues, "yearsOfExp")}
                                        options={_.map(
                                            experienceLevelEnums, function(item) {
                                                return {
                                                    "value":item.enum,
                                                    "label":item.displayName
                                                }
                                            })}
                                        // options={_.map(experienceLevelEnums,function(item){ return item.displayName })}
                                        placeholder= "Years Of Experience"
                                        align="justify"
                                        clearButton={true}
                                        defaultSelected={this.state.yearsOfExp}
                                        inputProps={{ 'name': 'yearsOfExp', 'data-isTypescriptSelect': true}}/>
                                </FormGroup>
                            </Col>
                        </Row>
                        : null }

                    {(!NullChecks.isNullOrEmptyArray(this.state.desiredRole) &&
                        (this.state.desiredRole[0].value === "Software Engineering" ||
                            this.state.desiredRole[0] === "Software Engineering") &&
                        !NullChecks.isNullOrEmptyArray(this.state.yearsOfExp)) ?
                        <Row>
                            <Col sm={6} className="roles-and-exp-label">
                                <h5>What types of roles are you interested in?</h5>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    { Object
                                        .keys(getSpecificDevRolesObj())
                                        .map((key, item, index) => <Checkbox key={key}
                                                                             value={getSpecificDevRolesObj()[key].value}
                                                                             checked={specificRoleIsChecked(getSpecificDevRolesObj()[key].value)}
                                                                             name="specificRolesArray"
                                                                             onChange={(e) => this.handleInputChange(e)}>
                                            {getSpecificDevRolesObj()[key].label}
                                        </Checkbox>)}
                                </FormGroup>
                            </Col>
                        </Row>
                        : null }

                    {(!NullChecks.isNullOrEmptyArray(this.state.desiredRole)
                        && (this.state.desiredRole[0].value === "Software Engineering"
                            || this.state.desiredRole[0] === "Software Engineering")
                        && !NullChecks.isNullOrEmptyArray(this.state.yearsOfExp)
                        && !NullChecks.isNullOrEmptyArray(this.state.specificRolesArray)) ||
                    (!NullChecks.isNullOrEmptyArray(this.state.desiredRole) &&
                        !NullChecks.isNullOrEmptyArray(this.state.yearsOfExp)) ?
                        <Row>
                            <Col sm={6} className="roles-and-exp-label">
                                <h5>List your top 5 skills</h5>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    <Typeahead
                                        multiple
                                        align="justify"
                                        clearButton={true}
                                        maxResults={50}
                                        className="bootstrap-typeahead typeahead-validation-container"
                                        onChange={(selectedValueOrValues) => this.handleInputChange(selectedValueOrValues, "topFiveSkillsArray")}
                                        options={_.map(getSkillsArray(),function(item){ return item })}
                                        placeholder= "Add New Skills"
                                        defaultSelected={this.state.topFiveSkillsArray}
                                        inputProps={{ 'name': 'topFiveSkillsArray', 'data-isTypescriptSelect': true}}/>
                                </FormGroup>
                            </Col>
                        </Row>
                        : null}

                    <Row>
                        <Col sm={6} className="roles-and-exp-label">
                            <h5>Upload any additional files
                                <OverlayTrigger placement="right" overlay={tooltip}>
                                    <i className="fa fa-question-circle-o" aria-hidden="true"> </i>
                                </OverlayTrigger>
                            </h5>
                            <div className="accepted-files-list">(Accepted files include pdf, doc, docx, png, jpeg, jpg, svg, and gif)</div>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Dropzone dzConfigObj={dzConfigObj}
                                          s3UploadCallback={this.s3UploadCallback}
                                          uploadDataType="mixed-media-uploads"
                                          metaContext={{
                                              'baseDirectory': 'user-profile-images/' + Meteor.userId()
                                          }}
                                />
                                {this.state.uploadedFiles.length > 0 ?
                                    <div>
                                        <div className="uploaded-files-header">
                                            Your Uploaded Files:
                                        </div>
                                        <div className="uploaded-files-container">
                                            {this.state.uploadedFiles.map((uploadedFile, index) => this.renderUploadedFiles(uploadedFile, index))}
                                        </div>
                                    </div>
                                    : null }
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6} className="roles-and-exp-label">
                            <h5>Any links you'd like to share with us?</h5>
                        </Col>
                        <Col sm={6}>
                            <Grid fluid>
                                <Row>
                                    <div className="link-wrapper">
                                        <i className="linkFaIcon fa fa-linkedin-square" aria-hidden="true"></i>
                                        <FormGroup>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="LinkedIn (required)"
                                                value={this.state.linkedInUrl}
                                                onChange={(e) => this.handleInputChange(e)}
                                                name="linkedInUrl"
                                            />
                                        </FormGroup>
                                    </div>
                                </Row>
                                <AdditionalLinkInput
                                    id="github"
                                    url={github}
                                    handleInputChange={this.handleInputChange}
                                    linkType={"Github"}
                                />
                                <AdditionalLinkInput
                                    id="personalWebsite1"
                                    url={personalWebsite1}
                                    handleInputChange={this.handleInputChange}
                                    linkType={"Personal Website"}
                                />
                                <AdditionalLinkInput
                                    id="personalWebsite2"
                                    url={personalWebsite2}
                                    handleInputChange={this.handleInputChange}
                                    linkType={"Personal Website"}
                                />
                                <AdditionalLinkInput
                                    id="personalWebsite3"
                                    url={personalWebsite3}
                                    handleInputChange={this.handleInputChange}
                                    linkType={"Personal Website"}
                                />
                            </Grid>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <div className="button-container">
                                <Button type="submit" className="btn-bg-orange btn-fat btn-wide">{(this.props.isOnSignupView) ? "Next: Upload a Picture" : "Save"}</Button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </Col>
        )
    }
}

RolesAndExperience.propTypes = {
    isOnSignupView: PropTypes.bool.isRequired
};

export default RolesAndExperience;
