hi.DropSliceSequence = function(dropLow, dropHigh, source){
    if(dropLow === 0){
        throw "Error creating drop slice sequence: Use dropHead instead.";
    }
    if(source.back && source.length && dropHigh === source.length()){
        throw "Error creating drop slice sequence: Use dropTail instead.";
    }
    this.dropLow = dropLow < 0 ? 0 : dropLow;
    this.dropHigh = dropHigh;
    if(source.length){
        let length = source.length();
        if(this.dropHigh > length) this.dropHigh = length;
    }
    this.source = source;
    this.dropLength = dropHigh - dropLow;
    this.frontIndex = 0;
    this.backIndex = 0;
    this.droppedSlice = false;
    this.maskAbsentMethods(source);
}

hi.DropSliceSequence.prototype = Object.create(hi.Sequence.prototype);
Object.assign(hi.DropSliceSequence.prototype, {
    bounded: function(){
        return this.source.bounded();
    },
    done: function(){
        return this.source.done();
    },
    length: function(){
        return this.source.length() - this.dropLength;
    },
    left: function(){
        return this.droppedSlice ? this.source.left() : (
            this.source.left() - this.dropLength
        );
    },
    front: function(){
        return this.source.front();
    },
    popFront: function(){
        this.source.popFront();
        this.frontIndex++;
        if(!this.droppedSlice && this.frontIndex >= this.dropLow){
            for(let i = 0; i < this.dropLength && !this.source.done(); i++){
                this.source.popFront();
            }
            this.droppedSlice = true;
        }
    },
    back: function(){
        return this.source.back();
    },
    popBack: function(){
        this.source.popBack();
        this.backIndex--;
        if(!this.droppedSlice && this.backIndex <= this.dropHigh){
            for(let i = 0; i < this.dropLength && !this.source.done(); i++){
                this.source.popBack();
            }
            this.droppedSlice = true;
        }
    },
    index: function(i){
        return this.source.index(
            i < this.dropLow ? i : i + this.dropLength
        );
    },
    // Just use slice and concat to accomplish the same instead of creating
    // a DropSliceSequence for a slicing source ya dingus.
    slice: null,
    has: null,
    get: function(i){
        return this.source.get(i);
    },
    copy: function(){
        let copy = new hi.DropSliceSequence(this.strideLength, this.source.copy());
    },
    reset: function(){
        this.source.reset();
        return this;
    },
});

hi.register("dropSlice", {
    numbers: 2,
    sequences: 1,
}, function(slice, source){
    let dropLow = slice[0];
    let dropHigh = slice[1];
    if(dropLow >= dropHigh){
        return source;
    }else if(source.slice && source.length){
        let length = source.length();
        if(dropLow <= 0 && dropHigh >= length){
            return new hi.EmptySequence();
        }else{
            return new hi.ConcatSequence([
                source.slice(0, dropLow), source.slice(dropHigh, length)
            ]);
        }
    }else if(dropLow <= 0){
        if(source.length && dropHigh >= source.length()){
            return new hi.EmptySequence();
        }else{
            return new hi.DropHeadSequence(dropHigh, source);
        }
    }else if(source.length){
        let length = source.length();
        if(dropHigh >= length){
            return new hi.DropTailSequence(length - dropLow, source);
        }
    }
    return new hi.DropSliceSequence(
        dropLow, dropHigh, source
    );
});