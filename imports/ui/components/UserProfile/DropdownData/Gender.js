//Retrieves gender array 
export function getGenderArray() {  
  const genderOptions = [
    { 
        value: 'Prefer not to disclose', 
        label: 'Prefer not to disclose' 
    },
    { 
        value: 'Female', 
        label: 'Female' 
    },
    { 
        value: 'Male', 
        label: 'Male' 
    }
  ]
  return genderOptions;
}
