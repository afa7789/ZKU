pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include ""; // hint: you can use more than one templates in circomlib-matrix to help you

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    // [bonus] insert your code here
    // A * X = b   matMul takes A and x as inputs and generates the mul res of matrix.
    component mul = matMul(n,n,1);
    for (var i=0;i<n;i++) {
        mul.b[i][0] <== x[i];
	for (var j=0;j<n;j++) {
            mul.a[i][j] <== A[i][j];
        } 
    } 

    component isEqual[n];
    signal tmp[n];
    // first check
    isEqual[0] = IsEqual();
    isEqual[0].in[0] <== mul.out[0][0];
    isEqual[0].in[1] <== b[0];
    tmp[0] <== isEqual[0].out;

    // If these is one equation that is not satisfied, the output is 0.
    for (var i=1; i<n; i++) {
        isEqual[i] = IsEqual();
        isEqual[i].in[0] <== mul.out[i][0];
        isEqual[i].in[1] <== b[i];
        tmp[i] <== tmp[i-1] * isEqual[i].out;
    }
    out <== tmp[n-1];
}

component main {public [A, b]} = SystemOfEquations(3);