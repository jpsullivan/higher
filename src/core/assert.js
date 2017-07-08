import {asSequence} from "./asSequence";
import {isSequence} from "./sequence";
import {isArray, isFunction, isUndefined} from "./types";

import {equals} from "../functions/equals";

const assertMessage = (message, value) => (isFunction(message) ?
    message(value) : (message || "Assertion error")
);

export const AssertError = function(message, value = undefined){
    this.message = message;
    this.value = value;
};

AssertError.prototype = Object.create(Error.prototype);
AssertError.prototype.constructor = AssertError;

// Throw an error if the condition isn't met.
export const assert = function(condition, message = undefined){
    if(!condition) throw new AssertError(
        assertMessage(message, condition), condition
    );
    return condition;
};

// Throw an error if the condition is met.
export const assertNot = function(condition, message = undefined){
    if(condition) throw new AssertError(
        assertMessage(message, condition), condition
    );
    return condition;
};

// Throw an error if the input value isn't undefined.
export const assertUndefined = function(value, message = undefined){
    if(!isUndefined(value)) throw new AssertError(
        assertMessage(message, value), value
    );
    return value;
};

// Throw an error if all the given values aren't equal.
export const assertEqual = function(...values){
    for(let i = 1; i < values.length; i++){
        if(values[i] !== values[0]) throw new AssertError(
            "Values must be equal.", values
        );
    }
    return values[0];
};

// Throw an error if the elements of two sequences aren't equal.
// Compares elements recursively, i.e. if the inputs are sequences of sequences
// then those corresponding contained sequences are checked for equality, too.
export const assertSeqEqual = function(sequenceA, sequenceB){
    const compare = (a, b) => {
        if(isSequence(a) || isSequence(b) || isArray(a) || isArray(b)){
            return equals.implementation(compare, [
                asSequence(a), asSequence(b)
            ]);
        }else{
            return a === b;
        }
    };
    return compare(sequenceA, sequenceB);
};

export default assert;