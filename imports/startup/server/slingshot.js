//works in conjunction with dropzone component for users to upload different media types to s3

import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot'; 
import _ from 'underscore';

//default settings:
const s3_upload_settings = {
    //Following values are set and retrieved from settings-development.json
    bucket: Meteor.settings.private.AWS.S3Bucket,
    region: Meteor.settings.private.AWS.Region, 
    AWSAccessKeyId: Meteor.settings.private.AWS.AccessKeyId,
    AWSSecretAccessKey: Meteor.settings.private.AWS.SecretAccessKey,
    acl: 'public-read',
    authorize: function(){
        //Deny uploads if user is not logged in.
        if (!this.userId) {
            throw new Meteor.Error('Login required', 'You need to be logged in to upload files!');
        }
        return true;
    },
    key: function( file ){
        //Store file into a directory by the user's username.
        let user = Meteor.users.findOne(this.userId);
        //default - will get overwritten with _.defaults()
        return user._id + '/' + file.name;
    }
}

//available setting objects - depending on what you're receiving/expecting from the user:  
const image_upload_settings = {
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg', 'image/gif', 'image/svg+xml'],
    maxSize: null, //1 * 1024 * 1024, // 1MB limit (use null for unlimited)
    key: function( file , metaContext ){
        let user = Meteor.users.findOne(this.userId)
        let defaultDirectory = user._id + '/' + file.name;
        let directory = (metaContext && metaContext.baseDirectory) ? metaContext.baseDirectory + '/' + file.name : defaultDirectory;
        return directory;
    }
}

//todo-an- if we need to implement video uploading - VIDEO settings here - be sure to take a look at the allowedFileTYpes and set a maxSize?
//a large file could destroyyyy us allllll!
// const video_upload_settings = {
//     allowedFileTypes: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-ms-wmv'],
//     maxSize: null, //1 * 1024 * 1024, // 1MB limit (use null for unlimited)
//     key: function( file , metaContext ){
    // let user = Meteor.users.findOne(this.userId)
    // let defaultDirectory = user._id + '/' + file.name;
    // let directory = (metaContext && metaContext.baseDirectory) ? metaContext.baseDirectory + '/' + file.name : defaultDirectory;
    // return directory;
//        return metaContext.baseDirectory + user._id + '/videos/' + file.name;
//     }
// }

//images + documents:
const mixed_media_upload_settings = {
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg', 'image/gif', 
        'image/svg+xml', 'application/msword', 'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize: null, //1 * 1024 * 1024, // 1MB limit (use null for unlimited)
    key: function( file , metaContext){
        let user = Meteor.users.findOne(this.userId)
        let defaultDirectory = user._id + '/' + file.name;
        let directory = (metaContext && metaContext.baseDirectory) ? metaContext.baseDirectory + '/' + file.name : defaultDirectory;
        return directory;
    }
}

const documents_upload_settings = {
    allowedFileTypes: ['application/msword', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize: null, 
    key: function( file, metaContext ){
        let user = Meteor.users.findOne(this.userId)
        let defaultDirectory = user._id + '/' + file.name;
        let directory = (metaContext && metaContext.baseDirectory) ? metaContext.baseDirectory + '/' + file.name : defaultDirectory;
        return directory;
    }
}

//merges two objects together - values in the first object will override the values in the 2nd object
_.defaults(image_upload_settings, s3_upload_settings);
_.defaults(documents_upload_settings, s3_upload_settings);
_.defaults(mixed_media_upload_settings, s3_upload_settings);
// _.defaults(video_upload_settings, s3_upload_settings);

//Param #1 - name/reference of the directive (to call from client-side), 
//Param #2 - tells 'Slingshot' that we're using s3 as our cloud service/provider,
//Param #3 - merging the default settings with the settings of the type of file(s) we're collecting from the user
//Source: https://atmospherejs.com/edgee/slingshot
Slingshot.createDirective('image-uploads', Slingshot.S3Storage, image_upload_settings);
// Slingshot.createDirective('video-uploads', Slingshot.S3Storage, video_upload_settings);
Slingshot.createDirective('document-uploads', Slingshot.S3Storage, documents_upload_settings);
Slingshot.createDirective('mixed-media-uploads', Slingshot.S3Storage, mixed_media_upload_settings);
