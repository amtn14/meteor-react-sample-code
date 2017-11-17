import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Candidates from '../Candidates';
import Betagigs from '../../Betagigs/Betagigs';

Meteor.publish('candidates', function candidates() {
	return Candidates.find({},{ sort: {createdAt: -1}});
});

Meteor.publish('candidate.view', function candidateView(candidateId) {
	check(candidateId, String);
	return Candidates.find({ _id: candidateId });
});

Meteor.publish('candidate.view.byUserId', function candidateView(userId) {
	check(userId, String);
	return Candidates.find({ userId: userId });
});

