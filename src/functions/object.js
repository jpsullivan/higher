const object = registerFunction("object", {
    numbers: "?",
    sequences: 1,
    // Don't waste time coercing input iterables to sequences
    allowIterables: true,
    // Also generate an async version of this function
    async: true,
}, function(limit, source){
    function pushKeyValuePair(result, element){
        if(isArray(element)){
            if(element.length){
                result[element[0]] = element.length > 1 ? element[1] : null;
            }
        }else if(isObject(element) && "key" in element){
            result[element.key] = "value" in element ? element.value : null;
        }else{
            result[element] = null;
        }
    }
    if(limit <= 0){
        return {};
    }else if(!limit){
        if(!source.bounded()){
            throw sequenceBoundsError("write", "object");
        }
        let result = {};
        for(let element of source){
            pushKeyValuePair(result, element);
        }
        return result;
    }else{
        let result = {};
        let i = 0;
        for(let element of source){
            if(i++ >= limit) break;
            pushKeyValuePair(result, element);
        }
        return result;
    }
});
