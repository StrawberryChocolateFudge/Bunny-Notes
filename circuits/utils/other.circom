include "../../node_modules/circomlib/circuits/comparators.circom";

// This function takes an array input and an index and outputs the value of in[index]
// CHECK IF AN ARRAY CONTAINS AN ELEMENT AT INDEX
// We cannot use an if statement with unknowns so this quinSelector is used
// for checking for an element in the input signal. we need to know the index of the element 
// then we can compare the out to the value of the element when in use
template QuinSelector(levels){
    signal input in[levels];
    signal input index;
    signal output out;
    
    // Ensure that index is less than levels
    component lessThan = LessThan(20);
    lessThan.in[0] <== index;
    lessThan.in[1] <== levels;
    lessThan.out === 1;

    component calcTotal = CalculateTotal(levels);
    component eqs[levels];

    for(var i = 0; i< levels;i++){
         eqs[i] = IsEqual();
         eqs[i].in[0] <== i;
         eqs[i].in[1] <== index;

         // eqs[i].out is 1 if the index matches
         // as such at least 1 input to calcTotal is not 0
         // We multiply the input we are looking for by 1 
         // and the rest of the inputs are multiplied by zero
         calcTotal.in[i] <== eqs[i].out * in[i];
    }
    //Returns 0+0+...+item+...+0
    out <== calcTotal.out;
}

// Calculates the value of the total amout of inputs
template CalculateTotal(n) {
    signal input in[n];
    signal output out;

    signal sums[n];

    sums[0] <== in[0];

    for (var i = 1; i < n; i++) {
        sums[i] <== sums[i-1] + in[i];
    }

    out <== sums[n-1];
}