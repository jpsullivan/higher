import Sequence from "../core/sequence";
import {asSequence, validAsSequence} from "../core/asSequence";
// import {OnceSequence} from "./once"; TODO: Missing dependency?

const ForwardFlattenSequence = function(source, frontSource = null){
    this.source = source;
    this.frontSource = frontSource;
};

const BackwardFlattenSequence = function(source, frontSource = null){
    this.source = source;
    this.frontSource = frontSource;
};

ForwardFlattenSequence.prototype = Object.create(Sequence.prototype);
ForwardFlattenSequence.prototype.constructor = ForwardFlattenSequence;
Object.assign(ForwardFlattenSequence.prototype, {
    reverse: function(){
        return new hi.BackwardFlattenSequence(this.source);
    },
    initialize: function(){
        while((!this.frontSource || this.frontSource.done()) && !this.source.done()){
            this.frontSource = asSequence(this.source.nextFront());
        }
        this.done = function(){
            return this.frontSource.done();
        };
        this.front = function(){
            return this.frontSource.front();
        };
        this.popFront = function(){
            this.frontSource.popFront();
            while(this.frontSource.done() && !this.source.done()){
                this.frontSource = asSequence(this.source.nextFront());
            }
        };
    },
    bounded: () => false,
    done: function(){
        this.initialize();
        return this.frontSource.done();
    },
    length: null,
    left: null,
    front: function(){
        this.initialize();
        return this.frontSource.front();
    },
    popFront: function(){
        this.initialize();
        this.popFront();
    },
    back: null,
    popBack: null,
    index: null,
    slice: null,
    copy: null,
    reset: null,
});

BackwardFlattenSequence.prototype = Object.create(Sequence.prototype);
BackwardFlattenSequence.prototype.constructor = BackwardFlattenSequence;
Object.assign(BackwardFlattenSequence.prototype, {
    reverse: function(){
        return new ForwardFlattenSequence(this.source);
    },
    initialize: function(){
        while((!this.frontSource || this.frontSource.done()) && !this.source.done()){
            this.frontSource = asSequence(this.source.nextBack());
        }
        this.done = function(){
            return this.frontSource.done();
        };
        this.front = function(){
            return this.frontSource.back();
        };
        this.popFront = function(){
            this.frontSource.popBack();
            while(this.frontSource.done() && !this.source.done()){
                this.frontSource = asSequence(this.source.nextBack());
            }
        };
    },
    bounded: () => false,
    done: function(){
        this.initialize();
        return this.frontSource.done();
    },
    length: null,
    left: null,
    front: function(){
        this.initialize();
        return this.frontSource.back();
    },
    popFront: function(){
        this.initialize();
        this.popFront();
    },
    back: null,
    popBack: null,
    index: null,
    slice: null,
    copy: null,
    reset: null,
});

/**
 * Flatten a single level deep.
 * @param {*} source
 */
const flatten = (source) => {
    return new ForwardFlattenSequence(source);
};

export const registration = {
    name: "flatten",
    expected: {
        sequences: 1,
    },
    implementation: flatten,
};

export default flatten;
