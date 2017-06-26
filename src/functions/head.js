// Fallback implementation of first function for when slicing is unavailable.
hi.HeadSequence = function(elements, source, frontIndex = 0){
    this.elements = elements;
    this.source = source;
    this.frontIndex = frontIndex;
    this.maskAbsentMethods(source);
};

hi.HeadSequence.prototype = Object.create(hi.Sequence.prototype);
Object.assign(hi.HeadSequence.prototype, {
    bounded: () => true,
    done: function(){
        return this.frontIndex >= this.elements || this.source.done();
    },
    length: function(){
        const sourceLength = this.source.length();
        return sourceLength < this.elements ? sourceLength : this.elements;
    },
    left: function(){
        const sourceLeft = this.source.left();
        const indexLeft = this.elements - this.frontIndex;
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
        return new hi.HeadSequence(
            this.elements, this.source.copy(), this.frontIndex
        );
    },
    reset: function(){
        this.source.reset();
        this.frontIndex = 0;
        return this;
    },
});

// Get a sequence for enumerating the first so many elements of the input.
// The resulting sequence may be shorter than the length specified, but
// will never be longer.
hi.register("head", {
    numbers: 1,
    sequences: 1,
}, function(elements, source){
    if(elements < 1){
        return new hi.EmptySequence();
    }else if(source.length && source.slice){
        const length = source.length();
        return source.slice(0, length < elements ? length : elements);
    }else{
        return new hi.HeadSequence(elements, source);
    }
});
