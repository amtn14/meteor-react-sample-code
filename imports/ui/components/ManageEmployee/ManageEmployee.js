import React from 'react';
import PropTypes from 'prop-types';
import { Row,
    Col,
    Button,
    Grid }
    from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import SideNavBar from '../Shared/SideNavBar';
import EmployeeIndex from './EmployeeIndex';
import AddEditEmployeeForm from './AddEditEmployeeForm';
import { getUserEmployeeDefaultValues } from './UserEmployeeDefault';
import './ManageEmployee.less';
//import '../Shared/SideNavBar.less'; //todo-an - currently resides in user-signup-skip-bug branch : (
//#endregion

const EMPLOYEE_VIEWS_ENUM = {
    'none': 0,
    'viewAllEmployees': 1,
    'addNewEmployee': 2,
    'editEmployee': 3
};

class ManageEmployee extends React.Component {
    constructor(props) {
        super();
        this.updateMainBodyContent = this.updateMainBodyContent.bind(this);
        this.switchToEditMode = this.switchToEditMode.bind(this);

        this.state = {
            activeEmployeeView: "",
            activeEmployeeViewComponent: "",
            activeEmployeeViewHeader: "",
            userEmployeeObj: {},
            userObj: {}, //will be the users default values TODO
            editMode: ""
        }
    }

    componentWillMount(){
        //set the state's default values before component mounts:
        this.setState({
            activeEmployeeView: EMPLOYEE_VIEWS_ENUM.viewAllEmployees,
            activeEmployeeViewComponent: <EmployeeIndex
                company={this.props.company}
                switchToEditMode={this.switchToEditMode}
            />,
            activeEmployeeViewHeader: "Employees",
            userEmployeeObj: getUserEmployeeDefaultValues(),
            editMode: false //because the default view is on the index view
        });
    }

    updateMainBodyContent(e, num) {
        const component = this;
        if (e) {
            e.preventDefault();
        }

        const handleBodyContentChange = function(bool) {
            let activeEmployeeViewHeader;
            let activeEmployeeViewComponent;
            let employees = component.props.company.employees().fetch();

            switch(num) {
                case EMPLOYEE_VIEWS_ENUM.viewAllEmployees:
                    activeEmployeeViewHeader = "Employees";
                    activeEmployeeViewComponent = <EmployeeIndex
                        company={component.props.company}
                        switchToEditMode={component.switchToEditMode}/>;
                    break;
                case EMPLOYEE_VIEWS_ENUM.addNewEmployee:
                    activeEmployeeViewHeader = "Add New Employee";
                    activeEmployeeViewComponent = <AddEditEmployeeForm
                        userEmployeeObj={component.state.userEmployeeObj}
                        company={component.props.company}
                        btnText="Create"
                        editMode={component.state.editMode}/>;
                    break;
                case EMPLOYEE_VIEWS_ENUM.editEmployee:
                    activeEmployeeViewHeader = "Edit Employee";
                    activeEmployeeViewComponent = <AddEditEmployeeForm
                        userEmployeeObj={component.state.userEmployeeObj}
                        company={component.props.company}
                        btnText="Save"
                        editMode={component.state.editMode}/>;
                    break;
            }

            component.setState({
                activeEmployeeView: num,
                activeEmployeeViewComponent: activeEmployeeViewComponent,
                activeEmployeeViewHeader: activeEmployeeViewHeader
            });
        }

        if (num ==  EMPLOYEE_VIEWS_ENUM.addNewEmployee) {
            //resets all form fields
            this.setState({
                userEmployeeObj: getUserEmployeeDefaultValues(),
                editMode: false}, () => {
                handleBodyContentChange(true);
            });
        } else {
            handleBodyContentChange(false);
        }
    }

    //user just selected a row in the employee's table:
    switchToEditMode(editEmployeeObj) {
        this.setState({
            userEmployeeObj: editEmployeeObj,
            editMode: true
        }, () => {
            this.updateMainBodyContent(null, 3);
        });
    }

    render() {
        let sideNavItemsArray = [
            <div className={(this.state.activeEmployeeView == EMPLOYEE_VIEWS_ENUM.viewAllEmployees) ? 'side-nav-item active': 'side-nav-item'}
                 key="viewAllEmployees">
                <a href="#"
                   onClick={(e) => this.updateMainBodyContent(e, EMPLOYEE_VIEWS_ENUM.viewAllEmployees)} >
                    View Employees
                </a>
            </div>,
            <Button
                className={(this.state.activeEmployeeView == EMPLOYEE_VIEWS_ENUM.addNewEmployee) ? 'side-nav-item btn-md btn-bg-dark-gray active': 'side-nav-item btn-md btn-bg-dark-gray'}
                onClick={(e) => this.updateMainBodyContent(e, EMPLOYEE_VIEWS_ENUM.addNewEmployee)}
                key="addNewEmployee">
                Add New Employee
            </Button>
        ];

        return(
            <Row>
                <Col md={3} className="side-nav">
                    <SideNavBar sideNavItemsArray={sideNavItemsArray}/>
                </Col>
                <Col md={9} className="main-content">
                    <div className="employee-view-header-container">
                        <h2>{this.state.activeEmployeeViewHeader}</h2>
                    </div>
                    <div className="employee-view-body-container">
                        {this.state.activeEmployeeViewComponent}
                    </div>
                </Col>
            </Row>
        )
    }
}


ManageEmployee.propTypes = {
    loading: PropTypes.bool,
    match: PropTypes.object,
    history: PropTypes.object,
    company: PropTypes.object
};

export default ManageEmployee;
