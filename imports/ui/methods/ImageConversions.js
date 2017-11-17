import { Meteor } from 'meteor/meteor';

const ImageConversions = {};

//takes in base64 and converts it to a blob
const base64ToBlob = function(b64Data) {
    let mime = b64Data.split(',')[0].split(':')[1].split(';')[0];
    let binary = atob(b64Data.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: mime});
}

ImageConversions.base64ToBlob = base64ToBlob;

export default ImageConversions;
