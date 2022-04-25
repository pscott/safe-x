%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.hash_state import hash_init, hash_update

# Internal utility function to hash data.
# Dev note: starkware.py and starknet.js methods for hashing an array append the length of the array to the end before hashing.
# So if you wish to compare `hash_pedersen` to the off-chain hashing methods, make sure you append the length of the array before
# feeding it to `hash_pedersen`!
@external
func hash_pedersen{pedersen_ptr : HashBuiltin*}(calldata_len : felt, calldata : felt*) -> (
        hash : felt):
    let (hash_state_ptr) = hash_init()
    let (hash_state_ptr) = hash_update{hash_ptr=pedersen_ptr}(
        hash_state_ptr, calldata, calldata_len)

    return (hash_state_ptr.current_hash)
end
