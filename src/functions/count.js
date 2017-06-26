function SequenceCounter(predicate, source){
    this.predicate = predicate;
    this.source = source;
    if(!source.copy) this.copy = null;
    if(!source.reset) this.reset = null;
}

Object.assign(SequenceCounter.prototype, {
    sum: function(){
        let i = 0;
        for(const element of this.source){
            i += this.predicate(element) ? 1 : 0;
        }
        return i;
    },
    equals: function(n){
        let i = 0;
        for(const element of this.source){
            i += this.predicate(element) ? 1 : 0;
            if(i > n) return false;
        }
        return i === +n;
    },
    lessThan: function(n){
        let i = 0;
        for(const element of this.source){
            i += this.predicate(element) ? 1 : 0;
            if(i >= n) return false;
        }
        return true;
    },
    lessThanEqual: function(n){
        let i = 0;
        for(const element of this.source){
            i += this.predicate(element) ? 1 : 0;
            if(i > n) return false;
        }
        return true;
    },
    greaterThan: function(n){
        let i = 0;
        for(const element of this.source){
            i += this.predicate(element) ? 1 : 0;
            if(i > n) return true;
        }
        return false;
    },
    greaterThanEqual: function(n){
        let i = 0;
        for(const element of this.source){
            i += this.predicate(element) ? 1 : 0;
            if(i >= n) return true;
        }
        return false;
    },
    copy: function(){
        return new SequenceCounter(this.predicate, this.source.copy());
    },
    reset: function(){
        this.source.reset();
        return this;
    },
});
Object.assign(SequenceCounter.prototype, {
    sumAsync: function(){
        return new Promise((resolve, reject) => {
            hi.callAsync(() => resolve(this.sum()));
        });
    },
    equalsAsync: function(n){
        return new Promise((resolve, reject) => {
            hi.callAsync(() => resolve(this.equals(n)));
        });
    },
    lessThanAsync: function(n){
        return new Promise((resolve, reject) => {
            hi.callAsync(() => resolve(this.lessThan(n)));
        });
    },
    lessThanEqualAsync: function(n){
        return new Promise((resolve, reject) => {
            hi.callAsync(() => resolve(this.lessThanEqual(n)));
        });
    },
    greaterThanAsync: function(n){
        return new Promise((resolve, reject) => {
            hi.callAsync(() => resolve(this.greaterThan(n)));
        });
    },
    greaterThanEqualAsync: function(n){
        return new Promise((resolve, reject) => {
            hi.callAsync(() => resolve(this.greaterThanEqual(n)));
        });
    },
});

hi.register("count", {
    functions: 1,
    sequences: 1,
    // Don't waste time coercing input iterables to sequences
    allowIterables: true,
}, function(predicate, source){
    return new SequenceCounter(predicate, source);
});
