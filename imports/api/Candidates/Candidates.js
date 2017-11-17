import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import SharedEnums from '../Shared/enums';

const workAuthStatusEnums = SharedEnums.WORK_AUTH_ENUM;

const Candidates = new Mongo.Collection('Candidates');
Candidates.helpers({
    user() {
        return Meteor.users.findOne(
            { _id: this.userId }
        );
    }
});

Candidates.allow({
    insert: () => false,
    update: () => false,
    remove: () => false,
});

Candidates.deny({
    insert: () => true,
    update: () => true,
    remove: () => true,
});

Candidates.schema = new SimpleSchema({
    additionalLinks: {
        type: Array,
        defaultValue: []
    },
    'additionalLinks.$': {
        type: Object
    },
    'additionalLinks.$.id': {
        type: String
    },
    'additionalLinks.$.link': {
        type: String
    },
    address: {
        type: Object,
        defaultValue: {},
        label: "Address Object"
    },
    'address.city': {
        type: String,
        defaultValue: "",
        label: "Address - city"
    },
    'address.state':{
        type: String,
        defaultValue: "",
        label: "Address - state"
    },
    'address.timezoneId': {
        type: String,
        defaultValue: "",
        label: "Address - timezoneId"
    },
    completedSignUpSteps: {
        type: Array,
        defaultValue: []
    },
    'completedSignUpSteps.$': {
        type: Number
    },
    createdAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) return (new Date());
        },
    },
    currentTitle: {
        type: String,
        defaultValue: "",
        label: "Candidate/'s current job title",
        optional: true
    },
    description: {
        type: String,
        defaultValue: "",
        max: 150,
        label: "A little about the candidate"
    },
    desiredRole: {
        type: String,
        defaultValue: "",
        label: "Candidate's desired role"
    },
    desiredSalary: {
        type: String,
        defaultValue: "",
        label: "Candidate's desired salary"
    },
    educationBackground: {
        type: Array,
        defaultValue: []
    },
    'educationBackground.$': {
        type: Object
    },
    'educationBackground.$.school': {
        type: String
    },
    'educationBackground.$.major': {
        type: String
    },
    'educationBackground.$.startYear': {
        type: String,
        min: 4,
        max: 4
    },
    'educationBackground.$.endYear': {
        type: String,
        min: 4,
        max: 4
    },
    'educationBackground.$.degreeType': {
        type: String
    },
    'educationBackground.$.key': {
        type: String
    },
    ethnicityArray: {
        type: Array,
        optional: true
    },
    'ethnicityArray.$': {
        type: String,
        label: "Ethnicity makeup of candidate"
    },
    favorite: {
        type: Boolean,
        defaultValue: false
    },
    favoriteJobsArray: {
        type: Array,
        optional: true
    },
    'favoriteJobsArray.$': {
        type: String,
        label: "Favorited Hostgigs"
    },
    gender: {
        type: String,
        defaultValue: "",
        label: "Gender of Candidate"
    },
    hideBrowse: {
        type: Boolean,
        defaultValue: false
    },
    hostgigsAllowed: {
        type: Array,
        defaultValue: []
    },
    'hostgigsAllowed.$': {
        type: String,
        label: "Specific roles the candidates are allowed to apply for"
    },
    isAdmin: {
        type: Boolean,
        defaultValue: false
    },
    isAnonymous: {
        type: Boolean,
        defaultValue: false
    },
    isVeteran: {
        type: Boolean,
        defaultValue: false,
        label: "Veteran check"
    },
    jobSearchStatus: {
        type: String,
        defaultValue: "",
        label: "What is the candidate's current job status?"
    },
    'jobHistory': {
        type: Array,
        label: "Job History",
        defaultValue: []
    },
    'jobHistory.$': {
        type: Object
    },
    'jobHistory.$.jobTitle': {
        type: String
    },
    'jobHistory.$.isCurrentJob': {
        type: Boolean
    },
    'jobHistory.$.employer': {
        type: String
    },
    'jobHistory.$.location': {
        type: String
    },
    'jobHistory.$.startYear': {
        type: String,
        min: 4,
        max: 4
    },
    'jobHistory.$.endYear': {
        type: String,
        min: 4
    },
    'jobHistory.$.salary': {
        type: Number
    },
    'jobHistory.$.key': {
        type: String
    },
    languageArray: {
        type: Array,
        defaultValue: []
    },
    'languageArray.$': {
        type: String,
        label: "Languages Spoken By Candidate"
    },
    linkedInUrl: {
        type: String,
        defaultValue: ""
    },phoneNumber: {
        type: String,
        defaultValue: "",
        label: "Candidate's contact number"
    },
    perfectJobDesc: {
        type: String,
        min: 25,
        label: "Candidate's perfect job and company desc",
        optional: true
    },
    profilePicture: {
        type: String,
        defaultValue: "",
        label: "URL to user's profile image",
        optional: true
    },
    specificRolesArray: {
        type: Array,
        defaultValue: []
    },
    'specificRolesArray.$': {
        type: String,
        label: "Specific roles the candidate is interested in"
    },
    testScore: {
        type: Number,
        defaultValue: 0
    },
    topFiveSkillsArray: {
        type: Array,
        min: 2,
        defaultValue: []
    },
    'topFiveSkillsArray.$': {
        type: String,
        label: "Candidate's top 5 skills"
    },
    userId: {
        type: String,
        defaultValue: "",
        label: "Associated UserId for this candidate"
    },
    uploadedFiles: {
        type: Array,
        defaultValue: []
    },
    'uploadedFiles.$': {
        type: String
    },
    updatedAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) return (new Date());
        },
    },
    workAuthStatus: {
        type: Number,
        allowedValues: Object.keys(workAuthStatusEnums).map(function(k){ return parseInt(workAuthStatusEnums[k].enum)}),
        label: "Candidate's current work authorization status",
        optional: true
    },
    yearsOfExp: {
        type: String,
        defaultValue: "",
        label: "Candidate's years of exp in desired role"
    }
});

Candidates.attachSchema(Candidates.schema);
export default Candidates;
