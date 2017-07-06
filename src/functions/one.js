import {Sequence} from "../core/sequence";
import {FiniteRepeatElementSequence, InfiniteRepeatElementSequence} from "./repeatElement";
import {expecting, wrap} from "../core/wrap";

export const OneElementSequence = function(element, isDone = false){
    this.element = element;
    this.isDone = isDone;
};

OneElementSequence.prototype = Object.create(Sequence.prototype);
OneElementSequence.prototype.constructor = OneElementSequence;
Object.assign(OneElementSequence.prototype, {
    seed: function(element){
        this.element = element;
        return this;
    },
    // Optimized implementations of some common operations
    repeat: function(repetitions = -1){
        if(repetitions === 0){
            return new EmptyElementSequence(this.element);
        }else if(repetitions < 0){
            return new InfiniteRepeatElementSequence(this.element);
        }else{
            return new FiniteRepeatElementSequence(repetitions, this.element);
        }
    },
    reverse: function(){
        return this;
    },
    bounded: () => true,
    done: function(){
        return this.isDone;
    },
    length: () => 1,
    left: function(){
        return this.isDone ? 0 : 1;
    },
    front: function(){
        return this.element;
    },
    popFront: function(){
        this.isDone = true;
    },
    back: function(){
        return this.element;
    },
    popBack: function(){
        this.isDone = true;
    },
    index: function(i){
        return this.element;
    },
    has: (i) => false,
    get: (i) => undefined,
    slice: function(i, j){
        return new OneElementSequence(this.element, i >= j);
    },
    copy: function(){
        return new OneElementSequence(this.element, this.isDone);
    },
    reset: function(){
        this.isDone = false;
        return this;
    },
});

export const one = wrap({
    name: "one",
    attachSequence: false,
    async: false,
    arguments: {
        one: expecting.anything
    },
    implementation: (element) => {
        return new OneElementSequence(element);
    },
});

export default one;
