// A chronically empty sequence.
hi.EmptySequence = function(){};

hi.EmptySequence.prototype = Object.create(hi.Sequence.prototype);
hi.EmptySequence.prototype.constructor = hi.EmptySequence;
Object.assign(hi.EmptySequence.prototype, {
    repeat: function(repetitions){
        return this;
    },
    reverse: function(){
        return this;
    },
    bounded: () => true,
    unbounded: () => false,
    done: () => true,
    length: () => 0,
    left: () => 0,
    front: () => undefined,
    popFront: () => {},
    back: () => undefined,
    popBack: () => {},
    index: (i) => undefined,
    has: (i) => false,
    get: (i) => undefined,
    slice: function(i, j){
        return this;
    },
    copy: function(){
        return this;
    },
    reset: function(){
        return this;
    },
});

hi.register("empty", {}, function(){
    return new hi.EmptySequence();
});
