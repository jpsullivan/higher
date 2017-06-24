// Get a sequence for enumerating the last so many elements of the input.
// The resulting sequence may be shorter than the length specified, but
// will never be longer.
const tail = registerFunction("tail", {
    numbers: 1,
    sequences: 1,
}, function(elements, source){
    if(elements < 1){
        return new EmptySequence();
    }else if(source.length && source.slice){
        let length = source.length();
        let slice = length < elements ? length : elements;
        return source.slice(length - slice, length);
    }else{
        throw "Failed to get sequence tail: Sequence can't be sliced.";
    }
});