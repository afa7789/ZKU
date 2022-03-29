pragma solidity 0.5.4;
// Hello World with a uint instead of a string
contract HelloWorldZKU_BG {
    // private uint so we can only get the value with the function calling
    uint private unsigned_integer;

    // this will retrieve the number, by simply returning it.
    // we use public because it's a public function anyone can call
    // and we use view because it's a view , it's not cost anything to use this function.
    function retrieveNumber() public view returns (uint) {
        return unsigned_integer;
    }

    // this function will spend some gas, and write the new value to the blockchain.
    function storeNumber( uint new_value ) public {
        unsigned_integer = new_value;
    }
}
