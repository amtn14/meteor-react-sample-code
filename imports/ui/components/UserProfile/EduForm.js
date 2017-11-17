import React from 'react';
import { Grid, Row, Col, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import validate from '../../../modules/validate';
import { Bert } from 'meteor/themeteorchef:bert';
import { getMajorsArray } from './DropdownData/Majors';
import { getEducationArray } from './DropdownData/Education';
import {Typeahead, Menu, MenuItem} from 'react-bootstrap-typeahead';
import _ from 'underscore';
import PropTypes from 'prop-types';
import EnumConversionHelpers from '../../methods/EnumConversionHelpers';
import SharedEnums from '../../../api/Shared/enums';

const educationLevelEnums = SharedEnums.EDUCATION_LEVEL_ENUM;

class EduForm extends React.Component {
    constructor(props) {
        super(props);
        this.addAnotherEducation = this.addAnotherEducation.bind(this);
    }

    componentDidMount() {
        //send the addFormRef to the parent component
        if (this.props.showAddForm) {
            this.props.retrieveAndSaveAddFormRef(this.addEduForm);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.addEduForm) {        
            if (prevProps.showAddForm === false) {
                this.props.retrieveAndSaveAddFormRef(this.addEduForm);
            }
        }
    }

    addAnotherEducation(e, isDoneAdding) {
        if (this.props.showAddForm) {
            let addEduRefs = {
                addFormRef: this.addEduForm,
                schoolRef: this.schoolTypeahead,
                majorRef: this.majorTypeahead,
                degreeRef: this.degreeTypeahead
            };
            this.props.validateEducation(e, addEduRefs, isDoneAdding, this.props.eduKey);
        } else {
            this.props.updateStateOfAddForm();
        }
    }

    render() {

        return (
            <div className="edu-add">
                <h3 className="add-education-header">Degrees and Certificates
                    <Button title="Add Education" className="add-additional-btn" onClick={(e) => this.addAnotherEducation(e, false)}>
                        +
                    </Button>
                </h3>
                {(this.props.eduArrayLength > 0 && this.props.showAddForm) ?
                    <Row>
                        <Col sm={12}>
                            <div className="remove-education-container">
                                <Button className="remove-education-btn" onClick={this.props.updateStateOfAddForm} bsSize="small">
                                    <i className="fa fa-trash-o" title="Remove Education" aria-hidden="true"></i>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    : null }
                { this.props.showAddForm ?
                    <form className="add-education-form" ref={form => (this.addEduForm = form)}>
                        <Row>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>School/Institution</ControlLabel>
                                    <Typeahead
                                        ref={(input) => this.schoolTypeahead = input}
                                        align="justify"
                                        maxResults={20}
                                        clearButton={true}
                                        className="bootstrap-typeahead typeahead-validation-container"
                                        onChange={(e) => this.props.handleInputChange(e, "school")}
                                        options={_.map(getEducationArray(),function(item){ return item })}
                                        placeholder="Ex. Monster's University"
                                        defaultSelected={this.props.currentEdu.school}
                                        inputProps={{ name: 'school', 'data-isTypescriptSelect': true}}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>Major</ControlLabel>
                                    <Typeahead
                                        ref={(input)=> this.majorTypeahead = input}
                                        align="justify"
                                        clearButton={true}
                                        maxResults={20}
                                        renderMenu={(results, menuProps) => this.props.renderMajorMenu(results, menuProps)}
                                        className="bootstrap-typeahead typeahead-validation-container"
                                        onChange={(e) => this.props.handleInputChange(e, "major")}
                                        options={_.map(getMajorsArray(),function(item){ return item })}
                                        placeholder="Ex. History of Screaming"
                                        defaultSelected={this.props.currentEdu.major}
                                        inputProps={{ name: 'major', 'data-isTypescriptSelect': true}}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>Degree Type</ControlLabel>
                                    <Typeahead
                                        ref={(input)=> this.degreeTypeahead = input}
                                        align="justify"
                                        clearButton={true}
                                        className="bootstrap-typeahead typeahead-validation-container"
                                        onChange={(e) => this.props.handleInputChange(e, "degreeType")}
                                        options={_.map(
                                            educationLevelEnums, function(item) {
                                                return {
                                                    "value":item.enum,
                                                    "label":item.displayName
                                                }
                                            })}
                                        placeholder="Please select a degree type"
                                        defaultSelected={this.props.currentEdu.degreeType}
                                        inputProps={{ name: 'degreeType', 'data-isTypescriptSelect': true}}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <ControlLabel>Start Year</ControlLabel>
                                    <input
                                        className="form-control"
                                        type="text"
                                        onChange={(e) => this.props.handleInputChange(e)}
                                        value={this.props.currentEdu.startYear}
                                        name="startYear"
                                        minLength={4}
                                        placeholder="2009" />
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <ControlLabel>End Year</ControlLabel>
                                    <input
                                        className="form-control"
                                        type="text"
                                        onChange={(e) => this.props.handleInputChange(e)}
                                        value={this.props.currentEdu.endYear}
                                        name="endYear"
                                        minLength={4}
                                        placeholder="2012"/>
                                </FormGroup>
                            </Col>
                        </Row>
                    </form>
                    : null }
                { (this.props.eduArrayLength > 0 && this.props.showAddForm === true) ?
                    <hr/>
                    :null}
            </div>
        )
    }
}

EduForm.propTypes = {
    validateEducation: PropTypes.func.isRequired,
    currentEdu:PropTypes.object.isRequired,
    showAddForm: PropTypes.bool.isRequired,
    eduArrayLength: PropTypes.number.isRequired,
    retrieveAndSaveAddFormRef: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    renderMajorMenu: PropTypes.func.isRequired,
    updateStateOfAddForm: PropTypes.func.isRequired
};

export default EduForm;