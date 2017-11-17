import _ from 'underscore';
import { getLanguageArray } from  '/imports/ui/components/UserProfile/DropdownData/Languages';
import { getMajorsArray } from  '/imports/ui/components/UserProfile/DropdownData/Majors';
import { getPhoneNumberTypeArray } from "../CompanySignup/DropdownData/PhoneNumberType";
import { getCompanySizeArray } from '../CompanySignup/DropdownData/CompanySize';
import { getJobSearchStatusArray } from "./DropdownData/JobSearchStatus";
import { getEducationArray } from  '/imports/ui/components/UserProfile/DropdownData/Education';
import EnumConversionHelpers from '../../methods/EnumConversionHelpers';
import SharedEnums from '../../../api/Shared/enums';

//By default, typeahead elements must be set with a datatype 'array'.
//These functions are here to help with converting them to different formats
//(for prepping them to be saved in the db or other needs)

//MULTIPLE TYPEAHEAD - takes an array with MULTIPLE objects as a parameter and returns an array of strings
//Ex. saving a multiple select [{label: "English", value: "English"}, {}] to ["English", "History", "Math"];
export function convertToArrayOfStrings (arrayOfObjects) {
    let arrToBeReturned = [];
    _.each(arrayOfObjects, function(item, index){
        let tempString;
        if (typeof(item) == "object") {
            tempString = item.value;
        } else {
            tempString = item;
        }
        arrToBeReturned.push(tempString);
    });
    return arrToBeReturned;
}

//SINGLE TYPEAHEAD - takes an array with a SINGLE object and grabs the 'value' property and returns a string
export function convertToString (arrayOfOneObject) {
    let returnedValue;
    if (Array.isArray(arrayOfOneObject)) {
        if (typeof(arrayOfOneObject[0]) == "object") {
            returnedValue = arrayOfOneObject[0].value;
        } else {
            returnedValue = arrayOfOneObject[0];
        }
    } else {
        returnedValue = arrayOfOneObject; //is not an array - just return original value
    }
    return returnedValue;
}

//single typeahead
export function convertIntOrStringToEnum (enumsArr, arrayOfOneObject) {

    if (isNaN(arrayOfOneObject[0])) {
        const result = EnumConversionHelpers.displayNameToEnum(enumsArr, arrayOfOneObject[0]);

        if (result.error) {
            //todo-ky add error
            Bert.alert("Woops something went wrong, please refresh and try again!", 'danger');
            return null;
        }
        else {
            return result.value;
        }
    }
    else {
        return parseInt(arrayOfOneObject[0]);
    }
}

//SINGLE TYPEAHEAD - takes an array with a SINGLE object and grabs the 'value' property and returns an int
export function convertToInt (arrayOfOneObject) {
    let returnedValue;
    returnedValue = arrayOfOneObject[0].value;
    return parseInt(returnedValue);
}

//takes in the candidate object as a param and grabs all known typeahead elements
//and proceeds to format them into arrays
export function formatCandidateObj(candidateObj) {
    const knownMultipleTypeaheads = ['languageArray', 'topFiveSkillsArray'];
    const knownSingleTypeaheads = ['workAuthStatus', 'jobSearchStatus','gender', 'yearsOfExp', 'desiredRole'];
    const nestedEducationTypeahead = ['school', 'major', 'degreeType'];

    //array references:
    const languageArray = getLanguageArray();
    const majorsArray = getMajorsArray();
    const eduArray = getEducationArray();
    const jobSearchStatusArray = getJobSearchStatusArray();

    //enum references:
    const experienceLevelEnums = SharedEnums.EXPERIENCE_LEVEL_ENUM;
    const workAuthStatusEnums = SharedEnums.WORK_AUTH_ENUM;

    //loop through candidateObj and filter each property accordingly (typeahead elements only)
    Object.keys(candidateObj).map(function(k){
        let isMultiple = _.contains(knownMultipleTypeaheads, k);
        let isSingle =  _.contains(knownSingleTypeaheads, k);
        let toBeReturnedMultipleArray = [];

        if (isMultiple == true) {
            _.each(candidateObj[k], function(item, index) {
                let i;
                if (k === "languageArray") {
                    i = _.findWhere(languageArray, {value: item});
                } else if (k === "topFiveSkillsArray") {
                    i = item;
                }

                let tempArr = i;

                toBeReturnedMultipleArray.push(tempArr);

                if (index == (candidateObj[k].length - 1)) {
                    candidateObj[k] = toBeReturnedMultipleArray;
                }
            });
        }
        else if (isSingle == true) {
            let i;

            if (k === "workAuthStatus") {

                //find displayName of matching enum in workautharray
                const result = EnumConversionHelpers.enumToDisplayName(workAuthStatusEnums, candidateObj[k]);

                if (result.error) {
                    //todo-ky add error
                    Bert.alert("Woops something went wrong, please refresh and try again!", 'danger');
                }
                else {
                    i = result.value;
                }

            }
            else if (k === "yearsOfExp") {
                //find displayName of matching enum in yearsOfExpArray
                const result = EnumConversionHelpers.enumToDisplayName(experienceLevelEnums, candidateObj[k]);

                if (result.error) {
                    //todo-ky add error
                    Bert.alert("Woops something went wrong, please refresh and try again!", 'danger');
                }
                else {
                    i = result.value;
                }

            }
            else if (k === "jobSearchStatus") {
                i = _.findWhere(jobSearchStatusArray, {value: candidateObj[k]});
            }
            else {
                i = candidateObj[k];
            }

            if (i && i !== "") {
                candidateObj[k] = [i];
            } else {
                candidateObj[k] = [];
            }
        }
        else if (k === "educationBackground") {
            if (Array.isArray(candidateObj[k]) && candidateObj[k].length > 0) {
                _.each(candidateObj[k], function(edu, index){
                    _.each(nestedEducationTypeahead, function(prop){
                        let i;
                        if (prop === "school") {
                            i = _.findWhere(eduArray, {value: parseInt(candidateObj[k][index][prop])});
                            // i = _.findWhere(eduArray, {enum: parseInt(candidateObj[k][index][prop])});
                        } else if (prop === "major") {
                            i = _.findWhere(majorsArray, {value: candidateObj[k][index][prop]});
                        } else {
                            i = candidateObj[k][index][prop];
                        }
                        candidateObj[k][index][prop] = [i];
                    });
                });
            }
        }
    });
    return candidateObj;
}
