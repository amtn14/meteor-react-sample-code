import React from 'react';
import PropTypes from 'prop-types';
import { Row,
         Col,
         Button,
         Grid,
         Alert }
      from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';  
import { formatPhoneNumber, unformatPhoneNumber } from '../../methods/FormFieldsUiHelpers';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import TableData from '../Shared/TableData';
import UserEnums from '../../../api/Users/enums';
import '../Shared/TableData.less';
const userRoles = UserEnums.USER_ROLE_ENUM;

//what will show up on the table:
const employeeData = {
    "schema": [
        {"fieldName":"userId","display":"User Id"},
        {"fieldName": "fullName", "display": "Full Name"},
        {"fieldName": "emailAddress", "display": "Email"},
        {"fieldName": 'details.jobTitle', "display":"Job Title"},
        {"fieldName":"roles", "display": "Role"},
        //{"fieldName":"activeStatus", "display": "Status"}
    ]
}

class EmployeeIndex extends React.Component {
    constructor(props) {
        super();  
        this.massageData = this.massageData.bind(this);

        this.state = {
            employeeTableData: [],
        }
    }

    componentWillMount() {
        let employeeTableData = this.massageData();
        this.setState({employeeTableData: employeeTableData});
    }

    massageData() {
        let employees = this.props.company.employees().fetch();
        let arrayOfMergedUserAndEmployeeObject = [];
        let newEmployeeUserObj;
        _.each(employees,function(e,idx){
            let u = e.user();

            //employee's name:
            let firstName = u && u.profile && u.profile.name && u.profile.name.first ? u.profile.name.first : "";
            let middleName = u && u.profile && u.profile.name && u.profile.name.middle ? u.profile.name.middle : "";
            let lastName = u && u.profile && u.profile.name && u.profile.name.last ? u.profile.name.last : "";
            
            //employee's phone number:
            let phoneNum = e && e.details && e.details.phoneNumber ? e.details.phoneNumber : "";
            let phoneExt = e && e.details && e.details.phoneNumberExt ? e.details.phoneNumberExt : "";
            let phoneType = e && e.details && e.details.phoneNumberType ? e.details.phoneNumberType : [];
            let formattedPhoneNumber = "N/A";

            if (phoneNum) {
                formattedPhoneNumber = formatPhoneNumber(phoneNum);
                if (phoneExt) {
                    formattedPhoneNumber += " Ext. " + phoneExt;
                }
                if (phoneType) {
                    formattedPhoneNumber += " (" + phoneType + ")"
                }
            }

            //set up the object to match with what the table is expecting
            e['userId'] = e.userId;
            e['employeeId'] = e._id;
            e['fullName'] = firstName + " " + lastName;
            e['emailAddress'] = u && u.emails && u.emails[0] && u.emails[0].address ? u.emails[0].address : null;
            e['firstName'] = firstName;
            e['lastName'] = lastName;
            e['middleName'] = middleName;
            e['details.jobTitle'] = s(e.details.jobTitle).capitalize().value();
            e['fullPhoneNumber'] = formattedPhoneNumber;
            e['isDeactivated'] = false;
            //e['activeStatus'] = 'Active';

            if (u && u.roles.includes(userRoles.companyAdmin)){
                e['roles']= ["Account Admin"];
            } else if (u && u.roles.includes(userRoles.employee)) {
                e['roles'] = ["Shadow Host"];
            }

            if (u && u.roles.includes(userRoles.inactive)) {
                e['isDeactivated'] = true;
                e['fullName'] = firstName + " " + lastName + ' (Deactivated)';
                //e['activeStatus'] = 'Inactive';
            }
        });
        return employees;
    }

    addInCustomTrClassName(row, rowIndex) {
        let trClassName = 'tr-active';
        if (row.isDeactivated) {
            trClassName = 'tr-deactivated';
        }
        return trClassName;
    }
    
    render() {
        return(
            <div className="employee-index-component">
                <Alert className="how-to-edit-and-view-alert" bsStyle="warning">
                    <i className="fa fa-hand-pointer-o" aria-hidden="true"></i>
                    To <strong> view </strong> or <strong> edit </strong> an employee, click anywhere on the row!
                </Alert>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <TableData
                            containerClass="employee-table-container"
                            headerStyle={{'background': '#dddddd'}}
                            data={this.state.employeeTableData}
                            schema={employeeData.schema}
                            pagination={false}
                            clickFunction={this.props.switchToEditMode}
                            maxHeight='300'
                            enableFiltering={true}
                            enableEdit={false}
                            hideSelectColumn={true}
                            trClassName={(row, rowIndex) => this.addInCustomTrClassName(row, rowIndex)}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}


EmployeeIndex.propTypes = {
  loading: PropTypes.bool,
  match: PropTypes.object,
  history: PropTypes.object,
  company: PropTypes.object.isRequired,
  switchToEditMode: PropTypes.func.isRequired
};

export default EmployeeIndex;

