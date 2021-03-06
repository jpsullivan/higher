import {isArray} from "../core/types";
import {wrap} from "../core/wrap";

import {NotBoundedError} from "../errors/NotBoundedError";

// Base implementation for array and newArray functions.
export const asArray = function(limit, source){
    if(!limit){
        NotBoundedError.enforce(source, {
            message: "Failed to create array from sequence",
            limitArgument: true,
        });
        const result = [];
        for(const element of source){
            result.push(element);
        }
        return result;
    }else{
        if(isArray(source)) return source.slice(
            0, limit < source.length ? limit : source.length
        );
        const result = [];
        let i = 0;
        for(const element of source){
            if(i++ >= limit) break;
            result.push(element);
        }
        return result;
    }
};

export const array = wrap({
    name: "array",
    attachSequence: true,
    async: true,
    arguments: {
        unordered: {
            numbers: "?",
            sequences: 1,
            allowIterables: true
        }
    },
    implementation: (limit, source) => {
        if(limit <= 0){
            return [];
        }else if(isArray(source)){
            return (!limit || limit >= source.length ?
                source : source.slice(limit)
            );
        }else{
            return asArray(limit, source);
        }
    },
});

export default array;
