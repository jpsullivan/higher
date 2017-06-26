// Returns a function which, when called the left-most function passed at
// creation is evaluated, then that result is passed to the next function,
// that result passed to the next, etc, until a final value is acquired.
hi.pipe = function(rootFunction, ...moreFunctions){
    if(!moreFunctions.length){
        return rootFunction;
    }else{
        return (...args) => {
            let value = rootFunction(...args);
            for(const func of moreFunctions){
                value = func(value);
            }
            return value;
        };
    }
};
