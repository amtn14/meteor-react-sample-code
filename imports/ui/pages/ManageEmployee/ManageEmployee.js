//todo- check to see who will be able to see this view - only employee with the user role 'company admin'
import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import ManageEmployee from '../../components/ManageEmployee/ManageEmployee';
import Loading from '../../components/Loading/Loading';
import WhiteBoxBody from "../../components/Shared/Wrappers/WhiteBoxBody";

//#start - import collections for publications
import CompaniesCollection from '../../../api/Companies/Companies';
import EmployeesCollection from '../../../api/Employees/Employees';
//#end

const ManageEmployeePage = ({ loading, match, history, users, employees, company }) => (!loading ?
    <WhiteBoxBody size="lg">
        <ManageEmployee employees={employees}
                        users={users}
                        company={company}
                        history={history}/>
    </WhiteBoxBody>
    : <Loading />);

ManageEmployeePage.propTypes = {
    loading: PropTypes.bool,
    match: PropTypes.object,
    history: PropTypes.object,
};

export default createContainer(() => {

    //Starting point - Meteor.userId()
    // #1 - grab employee object by userId
    // #2 - grab companyId from employee object
    // #3 - send company object over to the parent component and it will handle the rest
    // #4 - set up subscriptions for all users + employees so we can use the collection helpers!

    const userId = Meteor.userId();
    let currentEmployeeObj = EmployeesCollection.findOne({'userId': userId});
    let currentCompanyId = (currentEmployeeObj && currentEmployeeObj.companyId) ? currentEmployeeObj.companyId : null;
    const company_sub = Meteor.subscribe('companies.view',currentCompanyId);
    const employee_sub = Meteor.subscribe('employees.view.byCompanyId', currentCompanyId);
    const user_sub = Meteor.subscribe('users.getAll.public');

    return {
        loading: !company_sub.ready() || !employee_sub.ready() || !user_sub.ready(),
        company: CompaniesCollection.findOne({'_id': currentCompanyId}),
        employees: EmployeesCollection.find({'companyId': currentCompanyId}).fetch(),
        users:  Meteor.users.find({}).fetch()
    };
}, ManageEmployeePage);
