import {wrap} from "../core/wrap";
import {Sequence} from "../core/sequence";

import {EmptySequence} from "./empty";

// Fallback implementation of head function for when slicing is unavailable.
export const HeadSequence = Sequence.extend({
    constructor: function HeadSequence(headLength, source, frontIndex = 0){
        this.headLength = headLength;
        this.source = source;
        this.frontIndex = frontIndex;
        this.maskAbsentMethods(source);
    },
    bounded: () => true,
    unbounded: () => false,
    done: function(){
        return this.frontIndex >= this.headLength || this.source.done();
    },
    length: function(){
        const sourceLength = this.source.length();
        return sourceLength < this.headLength ? sourceLength : this.headLength;
    },
    left: function(){
        const sourceLeft = this.source.left();
        const indexLeft = this.headLength - this.frontIndex;
        return sourceLeft < indexLeft ? sourceLeft : indexLeft;
    },
    front: function(){
        return this.source.front();
    },
    popFront: function(){
        this.source.popFront();
        this.frontIndex++;
    },
    back: null,
    popBack: null,
    index: null,
    slice: null,
    has: null,
    get: function(i){
        return this.source.get(i);
    },
    copy: function(){
        return new HeadSequence(
            this.headLength, this.source.copy(), this.frontIndex
        );
    },
    reset: function(){
        this.source.reset();
        this.frontIndex = 0;
        return this;
    },
    rebase: function(source){
        this.source = source;
        return this;
    },
});

// Get a sequence for enumerating the first so many elements of the input.
// The resulting sequence may be shorter than the length specified, but
// will never be longer.
export const head = wrap({
    names: ["head", "take"],
    attachSequence: true,
    async: false,
    sequences: [
        HeadSequence
    ],
    arguments: {
        unordered: {
            numbers: 1,
            sequences: 1
        }
    },
    implementation: (elements, source) => {
        if(elements < 1){
            return new EmptySequence();
        }else if(source.length && source.slice){
            const length = source.length();
            return source.slice(0, length < elements ? length : elements);
        }else{
            return new HeadSequence(elements, source);
        }
    },
});

export const take = head;

export default head;
