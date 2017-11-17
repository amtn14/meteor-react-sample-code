import React from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, Button, Checkbox, Radio } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import Dropzone from '../../components/Shared/Dropzone';
import PropTypes from 'prop-types';
import CandidateEnums from '../../../api/Candidates/enums';

const candidateSignupStepEnums = CandidateEnums.CANDIDATE_SIGNUP_ENUM;

class UploadProfilePicture extends React.Component {
    constructor(props) {
        super(props);
        this.s3UploadCallback = this.s3UploadCallback.bind(this);
        this.handleFinalSubmit = this.handleFinalSubmit.bind(this);
        
        this.state = {
            profilePicture: (props.candidateObj.profilePicture && props.candidateObj.profilePicture !== "") ? props.candidateObj.profilePicture : ""
        }
    }

    componentDidMount(){
        this.props.updateCurrentStep(candidateSignupStepEnums.uploadPicture.enum); //keeping track of what step the user is on (on parent component)
    }

    s3UploadCallback(error, result) {
        if (result) {
            this.setState({
                profilePicture: result
            }, ()=> { Bert.alert('File uploaded!', 'success') });
        }

        if (error) {
            Bert.alert('Error uploading: ' + error, 'danger');
        }
    }

    handleFinalSubmit(e) {
        e.preventDefault();
        this.props.updateCandidateValues({
            "profilePicture": this.state.profilePicture
        }, true, true);
    }

    render() {
        let dzImageMsg;
        if (this.state.profilePicture && this.state.profilePicture !== "") {
            dzImageMsg = "<img class='dz-img' src='" + this.state.profilePicture + "'/><br />To change your photo, drop a file here <br />(Or click here to select one!)";
        } else {
            //default photo:
            dzImageMsg = "<img src='/images/user-image.png'/><br />Drop your file here to upload <p class='small'>(Or click here to select one!)</p>";  
        }

        const dzConfigObj = {
            //https://github.com/felixrieseberg/React-Dropzone-Component
            componentConfig:{
                 postUrl: 'no-url',
                 showFiletypeIcon: false
            },
            eventHandlers:{},
            //http://www.dropzonejs.com/#events
            djsConfig:{
                autoProcessQueue: true,            
                uploadMultiple: false,  
                dictDefaultMessage: dzImageMsg,    
                maxfilesexceeded: function(file) {
                    this.removeAllFiles();
                    this.addFile(file);
                },
                parallelUploads: 1,               
                maxFiles: 1,
                acceptedFiles: "image/*",
                addRemoveLinks: true
            }
        };

        return (
            <Col md={10} mdPush={1} className="upload-picture-container signup-step-container">
                {(this.props.isOnSignupView) ?
                    <h1>Step 6: Upload Profile Picture</h1>
                : null }
                <form className="upload-picture-form" ref={form => (this.profilePictureForm = form)} onSubmit={(e) => this.handleFinalSubmit(e)}> 
                    <Row>
                        <Col smPush={2} sm={8}>
                            {(!this.props.isOnSignupView) ? 
                                <ControlLabel>Your Current Profile Picture:</ControlLabel>
                            : null }
                            <div className="form-group">
                                <Dropzone
                                    dzConfigObj={dzConfigObj}
                                    s3UploadCallback={this.s3UploadCallback}
                                    uploadDataType="image-uploads"
                                    metaContext={{
                                        'baseDirectory': 'user-profile-images/' + Meteor.userId()
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                    {(this.state.profilePicture && this.state.profilePicture == "") ?
                        <Row>
                            <Col smPush={1} sm={10}>
                                <i className="fa fa-info-circle" aria-hidden="true"></i> 
                                <span className="tip-for-profile-photo">
                                While a photo is completely optional, we'd recommend our candidates upload one. It adds a sparkling touch to your profile and it helps out the hiring managers.
                                </span>
                            </Col>
                        </Row>
                    : null }
                    {(this.props.isOnSignupView)}
                    <Row>
                        <Col sm={12}>
                            <div className="button-container">
                                <Button type="submit" className="btn-bg-orange btn-fat btn-wide">{(this.props.isOnSignupView) ? "Finish your Profile" : "Save"}</Button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </Col>
        )
    }
}

UploadProfilePicture.propTypes = {
    isOnSignupView: PropTypes.bool.isRequired
};

export default UploadProfilePicture;