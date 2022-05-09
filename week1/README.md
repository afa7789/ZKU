# Week 1 Answers
## Part 1 Theoretical background of zk-SNARKs and zk-STARKS

__Write down two types of SNARK proofs.__
Groth16 and PLONK ?

<br/>


__Explain in 2-4 sentences why SNARK requires a trusted setup while STARK doesn’t.__

In addition to being based on elliptic curves, zk-SNARKs also require a trusted set up. A trusted setup is the creation event of the keys that are used to create the proofs required for private transactions and the verification of those proofs. This happen because the way it works needs to have a public key and a private key. The Stark doesn't need.

<br/>


__Name two more differences between SNARK and STARK proofs.__

STARK can handle larger proofs sizes than SNARK ( so it needs more time and consequently more gas, STARK came years after SNARK and that's why it has lesser adoption.

<br/>


__What is a Powers of Tau ceremony? Explain why this is important in the setup of zk-SNARK applications.__
Powers of Tau is a ceremony where multiple people creates the setup keys for SNARK,
with a key someone could change values and fake transactions leaving the network insecure.
By doing this type of ceremony the key is usually destroyed guaranteeing that the network is secure.

<br/>


__How are Phase 1 and Phase 2 trusted setup ceremonies different from each other?__

The first we now refer to as “Powers of Tau”, and is a general setup for all circuits up to a given size

The second converts the output of the Powers of Tau phase into a relation-specific CRS. In this scheme a coordinator is used to manage messages between the participants. This scales the process, enabling it to theoretically support hundreds or even thousands of participants. And despite the presence of a coordinator, the output of the MPC can still be independently verified, retaining security.

<br/>


__You should encounter an error with the circuit as is. Explain what the error means and how it arises.__

Error found:
```swift
    error[T3001]: Non quadratic constraints are not allowed!
    ┌─ "Multiplier3.circom":14:4
    │
    14 │    d <== a * b * c * 1;  
    │    ^^^^^^^^^^^^^^^^^^^ found here
    │
    = call trace:
        ->Multiplier3
```
It's complaining that the circuit is not quadratic. And it's right since a*b*c is a multiplication between three linear expressions.

Follows the explanation from circom:
>Quadratic expression: it is obtained by allowing a multiplication between two linear expressions and addition of a linear expression: A*B - C, where A, B and C are linear expressions. For instance, (2*x + 3*y + 2) * (x+y) + 6*x + y – 2.

So we fix it be only changing for d to be two multiplications and creating a preivous step that another one.

<br/>

__contracts/circuits/LessThan10.circom Implements a circuit that verifies an input is less than 10 using the LessThan template. Study how the template is used in this circuit. What does the 32 in Line 9 stand for?__

It's the number of bytes that will be used in the input we are going to compare.

__What are the possible outputs for the LessThan template and what do they mean respectively?__
0 or 1, 0 being false, and 1 being true.

__Instead of using a brute force method to verify a sudoku puzzle solution, the circuit here uses the sum and sum of squares of each row, each column, and each “box” to prove the solution. What is/are the benefit(s) of this algorithmic implementation over the brute force implementation?__

The benefits would be that it takes less time and checks if there is anything wrong in each condition, if one of the condition fails the sudoku itself would not be possible to be solven. The brute force would need to keep trying different inputs until it finds one that works.

___ Record the error, resolve it by modifying project/zkPuzzles/scripts/compile-circuits.sh, and explain why it has occurred and what you did to solve the error.__

I had more than one error, but due to wrong circom, I believe that the correct failure would be the:
```
    [ERROR] snarkJS: circuit too big for this power of tau ceremony. 80259 > 2**16
```
I changed the powersOfTau file until I find one that would be able to handle the circuit ( 10, 12, 32, and 17 workout ), powersOfTau28_hez_final_17.ptau

__bonus4__
Maybe we could use Fourier transform or Laplace transform ? they have reverse functions too. Not sure. ( but they're hard to understand for people who are not exactly from stem field)

__print__
![print](/resources/print.png?raw=true "Test results")



## Part 2 Getting started with circom and snarkjs

### Installing CIRCOM and snarkjs

_rust_

`curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh`

to uninstall:

`rustup self uninstall`

_circom_

```bash
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom
```

I had a problem with SHA-1 key (which I did not have and solved with the discussion in this thread: https://github.com/rust-lang/cargo/issues/3381)

_snarkjs_

`npm install -g snarkjs`

but I believe you can run snarkjs with npx too.

### part 2 running stuff
I changed to use npx with snarkjs to do not have to install it globally.
`bash ./scripts/compile-HelloWorld.sh`

in the compiler for 16growth I only had to make a small change to the circom and watch out for the name of the filnes refering to multiplier. But in the plonk we gotta remove the contribution we do not use to use it, it's not part of the plonk part I believe.

In plonk test I used variables as i Used on input but I said I expected 0 and passed the statements of the input and it failed. So I consider this is ok.

### part3
runned `npm install` in Q3 and in the project, remove the .git file of it too.


found this error
```
error[P1000]: Could not open file ../node_modules/circomlib/circuits/poseidon.circom
```
then I runned install again
and got this error:

```
error[T2021]: Calling symbol
   ┌─ "sudoku.circom":20:28
   │
20 │     component rangeProof = RangeProof(32);
   │                            ^^^^^^^^^^^^^^ Calling unknown symbol
```

[ERROR] snarkJS: circuit too big for this power of tau ceremony. 80259 > 2**16