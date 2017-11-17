//Upload file using a dropzone element:
var React = require('react');
import Dropzone from 'react-dropzone-component';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Bert } from 'meteor/themeteorchef:bert';
import s3PublicUrl from 'node-s3-public-url';
import PropTypes from 'prop-types';
import _ from 'underscore';

//stylesheets for dropzone:
import '/node_modules/react-dropzone-component/styles/filepicker.css';
import '/node_modules/dropzone/dist/min/dropzone.min.css';

class DropzoneUploader extends React.Component {
    constructor(props) {
      super(props);
      const component = this;
      this.uploadToS3 = this.uploadToS3.bind(this);
        //single upload
        let passedEventHandlers = (props.dzConfigObj.eventHandlers) ? props.dzConfigObj.eventHandlers : {};
        this.updatedEventHandlers = Object.assign(passedEventHandlers, {
          sending: function(file) {
            component.uploadToS3(file);  
          }
      });
      //multiple upload (TODO-an - when the time comes - currently not needed atm)
    }

    uploadToS3(file) {
      const component = this;
      //metaContext any information you may need inside of slingshot - right now we're just sending in location
      const uploader = new Slingshot.Upload(this.props.uploadDataType, this.props.metaContext);
      const fileToSend = (file && file.blob) ? file.blob : file;
      fileToSend.name = file.name;
      uploader.send(fileToSend, function (error, downloadUrl) {
          //*Don't forget to handle bert error/success messages inside the s3UploadCallback();
        if (error) {
            console.log(error, 'error inside of dropzone.js');
            component.props.s3UploadCallback(error, null);
        } else {
          //sanitizes url amazon style - handles spaces and special characters inside of user's file name
          const sanitizedUrl = downloadUrl.replace(file.name, `${s3PublicUrl(file.name)}`);
          component.props.s3UploadCallback(null, sanitizedUrl);
        }
      });
    }

    render() {
      return (
          <div>
            <Dropzone 
                config={{...this.props.dzConfigObj.componentConfig}}
                eventHandlers={{...this.updatedEventHandlers}}
                djsConfig={{...this.props.dzConfigObj.djsConfig}} />
          </div>
      );
    }
};


//1. dzConfigObj - an object of properties you'd like to pass on to the dropzone element (example below:)
/* 
    const dzConfigObj = {
        //https://github.com/felixrieseberg/React-Dropzone-Component (for componentConfig + eventHandlers)
        componentConfig:{
              postUrl: 'no-url',
              showFiletypeIcon: false
        },
        eventHandlers:{},
        //http://www.dropzonejs.com/#events
        djsConfig:{
            autoProcessQueue: true,            
            uploadMultiple: false,  
            dictDefaultMessage: "Drop your file here to upload <p class='small'>(Or click here to select one!)</p>",    
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
*/
//2. s3UploadCallback - cb function will send back the error message (if one exists) AND the sanitized url of the uploaded file
//3. uploadDataType - available options: 'document-uploads', 'image-uploads', 'mixed-media-uploads'
//4. metaContext - an object containing anything you'd like to have passed down to slingshot.js (i.e. baseDirectory)
// ^ send in empty object, if ok with default directory inside of slingshot.js
DropzoneUploader.propTypes = {
  dzConfigObj: PropTypes.object.isRequired,
  s3UploadCallback: PropTypes.func.isRequired,
  uploadDataType: PropTypes.string.isRequired,
  metaContext: PropTypes.object.isRequired, 
};

export default DropzoneUploader;