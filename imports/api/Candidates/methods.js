import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import rateLimit from '../../modules/rate-limit';
import Candidates from './Candidates';
import sendHtmlEmail from '../../../server/email';
import SharedEnums from '../Shared/enums';

Meteor.methods({
    'candidates.insert': function candidatesInsert(candidate) {
        try {
            check(candidate, {
                userId: String,
                completedSignUpSteps: Array,
                isAnonymous: Boolean
            });

            let id = Candidates.insert({
                userId: candidate.userId,
                completedSignUpSteps: candidate.completedSignUpSteps,
                isAnonymous: candidate.isAnonymous
            });

            if( Meteor.isProduction ){
                let data = {};

                let user = Meteor.users.findOne({_id: candidate.userId});
                data['userFirst'] = user && user.profile && user.profile.name && user.profile.name.first ? user.profile.name.first : null;
                data['userLast'] = user && user.profile && user.profile.name && user.profile.name.last ? user.profile.name.last : null;
                data['userEmail'] = user && user.emails && user.emails.length && user.emails[0].address ? user.emails[0].address : null;
                data['candidate'] = id;

                let defaultFrom = 'support@betagig.tech';
                let tmpl = 'candidate_new_signup';
                let to = Meteor.settings.private.emails.candidate_new_signup.to;
                let from = Meteor.settings.private.emails.candidate_new_signup.from || defaultFrom;
                let subject = "New Candidate Signup"
                if( to && from ){
                    sendHtmlEmail(to,from,subject,data,tmpl);
                }else{
                    console.log("Missing To/From for Email");
                }
            }

        } catch (exception) {
            throw new Meteor.Error('500', exception);
        }
    },

    'candidates.update': function candidatesUpdate(candidateObj) {
        const workAuthEnums = SharedEnums.WORK_AUTH_ENUM;
        let candidateId;

        if (candidateObj._id) {
            candidateId = candidateObj._id;
            delete candidateObj._id;
        } else if (candidateObj.candidateId) {
            candidateId = candidateObj.candidateId;
        }

        if (!Candidates.simpleSchema().newContext().validate(candidateObj, keys=Object.keys(candidateObj))){
            throw new Meteor.Error('500', "Invalid arguments passed");
        } else {
            //console.log("checked the following keys: ", Object.keys(candidateObj), "what value does this return?: ",
            //!Candidates.simpleSchema().validate(candidateObj, keys=Object.keys(candidateObj)));
        }

        try {
            let onDoneFunction = function(err, response) {
                //console.log("ERROR: ",err);
                //console.log("RESPONSE: ",response);

                if (err) {
                    throw new Meteor.Error('500', err.reason);
                }
            }

            Candidates.update(candidateId, { $set: candidateObj }, onDoneFunction);
            return candidateId; // Return _id so we can redirect to betagig after update.
        }

        catch (exception) {
            throw new Meteor.Error('500', exception);
        }
    },

    'candidates.remove': function candidatesRemove(candidateId) {
        check(candidateId, String);
        try {
            return Candidates.remove(candidateId);
        } catch (exception) {
            throw new Meteor.Error('500', exception);
        }
    },
});

rateLimit({
    methods: [
        'candidates.insert',
        'candidates.update',
        'candidates.remove',
        'candidates.addCandidateSkeleton'
    ],
    limit: 5,
    timeRange: 1000,
});
