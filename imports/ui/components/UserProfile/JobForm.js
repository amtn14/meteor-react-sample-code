import React from 'react';
import {Row, Col, FormGroup, ControlLabel, Button, Checkbox, Radio} from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import Geosuggest from 'react-geosuggest';
import Numeral from 'numeral';
import PropTypes from 'prop-types';

class JobForm extends React.Component {
    constructor() {
        super();
        this.addAnotherJobExp = this.addAnotherJobExp.bind(this);
    }

    componentDidMount() {
        if (this.props.showAddForm) {
            this.props.retrieveAddJobFormRef(this.addJobForm);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.showAddForm == false) {
            if (this.addJobForm) {
                this.props.retrieveAddJobFormRef(this.addJobForm);
            }    
        }
    }

    addAnotherJobExp(e, isDoneAdding) {
        if (this.props.showAddForm == true) {
            this.props.validateJob(e, this.addJobForm, isDoneAdding);
        } else {
            this.props.updateStateOfAddForm();
        }
    }

    render() {
        let salary = (this.props.mostRecentJobExp.salary !== "") ? Numeral(this.props.mostRecentJobExp.salary).format('$ 0,0[.]00') : this.props.mostRecentJobExp.salary;
        return (
            <div className="job-add">
                <h3 className="add-job-history-header">Prior Experience 
                    <Button 
                        className="add-additional-btn"
                        onClick={(e) => this.addAnotherJobExp(e, false)}>+
                    </Button>
                </h3>
                {(this.props.jobHistoryArrayLength > 0 && this.props.showAddForm === true) ?
                <Row>
                    <Col sm={12}>
                        <div className="remove-job-container">
                            <Button className="remove-job-btn" onClick={this.props.updateStateOfAddForm} bsSize="small">
                                <i className="fa fa-trash-o"></i>
                            </Button>
                        </div>
                    </Col>
                </Row> 
                : null}
                { this.props.showAddForm === true ?
                <form className="add-job-history-div" ref={form => (this.addJobForm = form)}> 
                   <Row>
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Title</ControlLabel>
                                <input 
                                    className="form-control"
                                    name="jobTitle"
                                    type="text"
                                    onChange={(e) => this.props.handleInputChange(e)}
                                    value={this.props.mostRecentJobExp.jobTitle}
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
                                    onChange={(e) => this.props.handleInputChange(e)}
                                    value={this.props.mostRecentJobExp.employer}
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
                                    onSuggestSelect={(e) => this.props.handleGmapsAutoCompleteInput(e)}
                                    initialValue={this.props.mostRecentJobExp.location}
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
                                    type="text"
                                    name="startYear"
                                    minLength={4}
                                    onChange={(e) => this.props.handleInputChange(e)}
                                    value={this.props.mostRecentJobExp.startYear}
                                    placeholder="2010" />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <ControlLabel>End Year</ControlLabel>
                                <input
                                    className="form-control"
                                    type="text"
                                    onChange={(e) => this.props.handleInputChange(e)}
                                    value={this.props.mostRecentJobExp.endYear}
                                    disabled={this.props.mostRecentJobExp.isCurrentJob}
                                    name="endYear"
                                    minLength={4}
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
                                    onChange={(e) => this.props.handleInputChange(e)}
                                    value={salary}
                                    name="salary"
                                    placeholder="$xx,xxx" />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <ControlLabel>Current Job</ControlLabel>
                                <Checkbox
                                    onChange={(e) => this.props.handleInputChange(e)}
                                    checked={this.props.mostRecentJobExp.isCurrentJob}
                                    name="isCurrentJob">
                                </Checkbox>
                            </FormGroup>
                        </Col>
                    </Row>
                </form>
                : null }
            </div>
        )
    }
}

JobForm.propTypes = {
    retrieveAddJobFormRef:PropTypes.func.isRequired,
    mostRecentJobExp:PropTypes.object.isRequired,
    jobHistoryArrayLength:PropTypes.number.isRequired,
    showAddForm:PropTypes.bool.isRequired,
    validateJob:PropTypes.func.isRequired,
    handleInputChange:PropTypes.func.isRequired,
    handleGmapsAutoCompleteInput:PropTypes.func.isRequired,
    updateStateOfAddForm:PropTypes.func.isRequired
};

export default JobForm;