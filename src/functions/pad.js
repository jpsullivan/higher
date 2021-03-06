import {Sequence} from "../core/sequence";
import {FiniteRepeatElementSequence} from "./repeatElement";
import {wrap} from "../core/wrap";

import {BoundsUnknownError} from "../errors/BoundsUnknownError";

import {mustSupport} from "./mustSupport";

export const PadLeftSequence = Sequence.extend({
    constructor: function PadLeftSequence(
        source, padElement, padTotal, padCount = undefined
    ){
        this.source = source;
        this.padElement = padElement;
        this.padTotal = padTotal;
        this.padCount = padCount || 0;
        this.maskAbsentMethods(source);
    },
    bounded: function(){
        return this.source.bounded();
    },
    unbounded: function(){
        return this.source.unbounded();
    },
    done: function(){
        return this.padCount >= this.padTotal && this.source.done();
    },
    length: function(){
        return this.source.length() + this.padTotal;
    },
    left: function(){
        return this.source.left() + (this.padTotal - this.padCount);
    },
    front: function(){
        return (this.padCount >= this.padTotal ?
            this.source.front() : this.padElement
        );
    },
    popFront: function(){
        this.padCount++;
        if(this.padCount > this.padTotal){
            return this.source.popFront();
        }
    },
    back: function(){
        return this.source.done() ? this.padElement : this.source.back();
    },
    popBack: function(){
        if(this.source.done()){
            this.padCount++;
        }else{
            return this.source.popBack();
        }
    },
    index: function(i){
        return (i < this.padTotal ?
            this.padElement : this.source.index(i - this.padTotal)
        );
    },
    slice: function(i, j){
        if(j < this.padTotal){
            return new FiniteRepeatElementSequence(j - i, this.padElement);
        }else if(i >= this.padTotal){
            return this.source.slice(i - this.padTotal, j - this.padTotal);
        }else{
            return new PadLeftSequence(
                this.source.slice(0, j - this.padTotal),
                this.padElement, this.padTotal - i
            );
        }
    },
    has: function(i){
        return this.source.has(i);
    },
    get: function(i){
        return this.source.get(i);
    },
    copy: function(){
        return new PadLeftSequence(
            this.source.copy(), this.padElement,
            this.padTotal, this.padCount
        );
    },
    reset: function(){
        this.source.reset();
        this.padCount = 0;
        return this;
    },
    rebase: function(source){
        this.source = source;
        return this;
    },
});

export const PadRightSequence = Sequence.extend({
    constructor: function PadRightSequence(
        source, padElement, padTotal, padCount = undefined
    ){
        this.source = source;
        this.padElement = padElement;
        this.padTotal = padTotal;
        this.padCount = padCount || 0;
        this.maskAbsentMethods(source);
        if(!source.length){
            this.index = null;
            this.slice = null;
        }
    },
    bounded: function(){
        return this.source.bounded();
    },
    // Please don't right-pad unbounded sequences that doesn't make any sense
    unbounded: function(){
        return this.source.unbounded();
    },
    done: function(){
        return this.padCount >= this.padTotal && this.source.done();
    },
    length: function(){
        return this.source.length() + this.padTotal;
    },
    left: function(){
        return this.source.left() + (this.padTotal - this.padCount);
    },
    front: function(){
        return this.source.done() ? this.padElement : this.source.front();
    },
    popFront: function(){
        if(this.source.done()){
            this.padCount++;
        }else{
            return this.source.popFront();
        }
    },
    back: function(){
        return (this.padCount >= this.padTotal ?
            this.source.back() : this.padElement
        );
    },
    popBack: function(){
        this.padCount++;
        if(this.padCount > this.padTotal){
            return this.source.popBack();
        }
    },
    index: function(i){
        return i >= this.source.length() ? this.padElement : this.source.index(i);
    },
    slice: function(i, j){
        const sourceLength = this.source.length();
        if(i >= sourceLength){
            return new FiniteRepeatElementSequence(j - i, this.padElement);
        }else if(j < sourceLength){
            return this.source.slice(i, j);
        }else{
            return new PadRightSequence(
                this.source.slice(i, sourceLength),
                this.padElement, j - sourceLength
            );
        }
    },
    has: function(i){
        return this.source.has(i);
    },
    get: function(i){
        return this.source.get(i);
    },
    copy: function(){
        return new PadLeftSequence(
            this.source.copy(), this.padElement,
            this.padTotal, this.padCount
        );
    },
    reset: function(){
        this.source.reset();
        this.padCount = 0;
        return this;
    },
    rebase: function(source){
        this.source = source;
        return this;
    },
});

export const SequencePadder = function(source){
    this.source = source;
};

SequencePadder.prototype.constructor = SequencePadder;
Object.assign(SequencePadder.prototype, {
    left: function(length, element){
        this.source = mustSupport(this.source, "length");
        const sourceLength = this.source.length();
        const targetLength = +length;
        if(sourceLength >= targetLength){
            return this.source;
        }else if(sourceLength === 0){
            return new FiniteRepeatElementSequence(targetLength, element);
        }else{
            return this.leftCount(targetLength - sourceLength, element);
        }
    },
    leftCount: function(count, element){
        return count <= 0 ? source : new PadLeftSequence(
            this.source, element, count
        );
    },
    right: function(length, element){
        if(this.source.unbounded()){
            return this.source;
        }else if(!this.source.bounded()){
            throw BoundsUnknownError(this.source, {
                message: "Failed to right pad sequence",
            });
        }
        this.source = mustSupport(this.source, "length");
        const sourceLength = this.source.length();
        const targetLength = +length;
        if(sourceLength >= targetLength){
            return this.source;
        }else if(sourceLength === 0){
            return new FiniteRepeatElementSequence(targetLength, element);
        }else{
            return this.rightCount(targetLength - sourceLength, element);
        }
    },
    rightCount: function(count, element){
        if(this.source.unbounded()) return source;
        else return count <= 0 ? source : new PadRightSequence(
            this.source, element, count
        );
    },
});

export const pad = wrap({
    name: "pad",
    attachSequence: true,
    async: false,
    sequences: [
        PadLeftSequence,
        PadRightSequence
    ],
    arguments: {
        one: wrap.expecting.sequence
    },
    implementation: (source) => {
        return new SequencePadder(source);
    },
});

export default pad;
