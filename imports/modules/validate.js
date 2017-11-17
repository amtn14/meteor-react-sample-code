import $ from 'jquery';
import 'jquery-validation';
import _ from 'underscore';

export default function validateForm(form, options) {

    //CUSTOM METHODS:
    $.validator.addMethod("validPassword", function (password, element) {
        let filter = /^(?=.*[A-Z])(?=.*\W).{8,}$/;
        return password.match(filter);
    }, "Password must be at least 8 characters, contain one uppercase and one special character (i.e !@#$&*).");

    $.validator.addMethod("emailNotSame", function(email, element){
        return $('#yourEmail').val() != email;
    });

    //provide a regex to accept only numbers, or only letters (lowercase and capitalized)
    //*Don't forget to include a 'message' when you use this method/rule
    $.validator.addMethod("accept", function(value, element, param) {
        return value.match(new RegExp("^" + param + "$"));
    });

    $.validator.addMethod("validPhoneNumber", function (phoneNumber, element) {
        let filter = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/; //format: (909) 543-3454
        return phoneNumber.match(filter);
    }, "Please provide a valid phone number.");

    $.validator.addMethod("validEmail", function (email, element) {
        let filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //format: (909) 543-3454
        return email.match(filter);
    }, "Please provide a valid email address.");

    $.validator.addMethod("validUrl", function (url, element) {
        const with_http = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
        const without_http = new RegExp("^([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
        let testOne = url.match(with_http);
        let testTwo = url.match(without_http);
        if (testOne || testTwo || url.length == 0) {
            return true;
        } else {
            return false;
        }
    }, "Please provide a valid URL.");


    //FOR TYPEAHEAD MULTIPLE SELECTS: Checks to see if the value array has the correct number of items.
    //Send in the min required number through the 'param' parameter
    //*Don't forget to include a 'message' when you use this method/rule
    $.validator.addMethod("matchArrayLength", function (array, element, param) {
        let $parentEl = $(element).closest('.rbt-input-multi');
        let allSelectedChildren = $('.rbt-token.rbt-token-removeable', $parentEl).length;
        return allSelectedChildren >= param;
    });

    $.validator.addMethod("checkedCheckbox", function (value, element) {
        return element.checked;
    });

    $.validator.addMethod("linkedIn", function (value, element){
        return value.includes('www.linkedin.com/in/');
    });

    $.validator.addMethod("endtime_greater_than_starttime", function(value, element, param) {
        return this.optional(element) || value > $(param).val();
    }, "The end time must be after the start time.");


    //Validation error placement for select elements (Source: https://github.com/ericgio/react-bootstrap-typeahead/)
    //and others:
    //**FOR TYPEAHEAD: Don't forget to include the CLASSNAME 'typeahead-validation-container' AND
    // the attribute {'data-isTypescriptSelect': true} for INPUTPROPS**

    // Example:
    // <Typeahead
    //     className="typeahead-validation-container"
    //     inputProps={{name: 'name-of-your-select-element-here', data-isTypescriptSelect': true}}
    // />
    let customValidation = {
        errorPlacement: function (error, element) {
            let elem = $(element);
            let isTypescriptSelect = (elem.attr('data-istypescriptselect'));
            if (isTypescriptSelect == "true"){
                elem.closest('.typeahead-validation-container').after(error);
            } else if(elem[0].name === "specificRolesArray" ||
                elem[0].name === "termsAndPrivacyAgreed" ||
                elem[0].name === "bonusTermsAgreed" ||
                elem[0].name === "contractAgreed") {
                let findParentFormGroup = elem.closest(".form-group");
                error.insertAfter(findParentFormGroup);
            } else {
                error.insertAfter(element);
            }
        }
    }
    let mergedOptions = _.extend(options, customValidation);
    return $(form).validate(mergedOptions);
}

//original: export default (form, options) => $(form).validate(options);
