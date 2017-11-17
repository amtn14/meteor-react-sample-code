import React from 'react';
import PropTypes from 'prop-types';
import { Row,
         Col,
         Button,
         Grid }
      from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import EmployeeSignup from '../../components/EmployeeSignup/EmployeeSignup';
import Loading from '../../components/Loading/Loading';
import WhiteBoxBody from "../../components/Shared/Wrappers/WhiteBoxBody";

//#start - import collections for publications
import CompaniesCollection from '../../../api/Companies/Companies';
import EmployeesCollection from '../../../api/Employees/Employees';
//#end

const EmployeeSignupPage = ({ loading, match, history, users, employees }) => (!loading ? 
  <WhiteBoxBody size="lg">
    <EmployeeSignup employees={employees} users={users} history={history}/> 
  </WhiteBoxBody>
  : <Loading />);

EmployeeSignupPage.propTypes = {    
  loading: PropTypes.bool,
  match: PropTypes.object,
  history: PropTypes.object,
};

export default createContainer(() => {
    const userId = Meteor.userId();
    let currentEmployeeObj = EmployeesCollection.findOne({'userId': userId});
    let currentCompanyId = (currentEmployeeObj && currentEmployeeObj.companyId) ? currentEmployeeObj.companyId : null;
    const company_sub = Meteor.subscribe('companies.view',currentCompanyId);
    const employee_sub = Meteor.subscribe('employees.view.byCompanyId', currentCompanyId);
   
    return {
      loading: !company_sub.ready() || !employee_sub.ready(),
      company: CompaniesCollection.findOne({'_id': currentCompanyId}),
      employees: EmployeesCollection.find({'companyId': currentCompanyId}).fetch()
    };
}, EmployeeSignupPage);
