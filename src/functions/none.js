import {wrap} from "../core/wrap";

import {NotBoundedError} from "../errors/NotBoundedError";

export const none = wrap({
    name: "none",
    summary: "Get whether none of the elements in a sequence satisfy a predicate.",
    docs: process.env.NODE_ENV !== "development" ? undefined : {
        introduced: "higher@1.0.0",
        detail: (`
            Get whether none of the elements in an input sequence satisfy an
            optional predicate or, if no predicate was provided, whether all
            the elements of the input are falsey.
        `),
        expects: (`
            The function expects as input a sequence known to be bounded and
            an optional predicate function to apply to each element.
        `),
        returns: (`
            The function returns @true when no elements in the sequence
            satisfied the predicate or, if no predicate was given, if none of
            the elements were truthy.
            It also returns @true if the sequence was empty.
            The function returns @false otherwise.
        `),
        throws: (`
            The function throws a @NotBoundedError when the input sequence was
            not known to be bounded.
        `),
    },
    attachSequence: true,
    async: true,
    arguments: {
        unordered: {
            functions: "?",
            sequences: 1,
            allowIterables: true
        }
    },
    implementation: (predicate, source) => {
        if(predicate){
            NotBoundedError.enforce(source, {
                message: "Failed to determine whether any elements satisfied the predicate"
            });
            for(const element of source){
                if(predicate(element)) return false;
            }
        }else{
            NotBoundedError.enforce(source, {
                message: "Failed to determine whether any elements were truthy"
            });
            for(const element of source){
                if(element) return element;
            }
        }
        return true;
    },
});

export default none;
