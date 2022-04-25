%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.uint256 import Uint256
from starkware.starknet.common.syscalls import get_caller_address, call_contract
from contracts.starknet.lib.hash_pedersen import hash_pedersen
from starkware.cairo.common.memcpy import memcpy
from starkware.cairo.common.math import assert_le
from openzeppelin.account.library import Call
from starkware.cairo.common.alloc import alloc

@storage_var
func execution_relayer() -> (address : felt):
end

@constructor
func constructor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr : felt}(
        _execution_relayer : felt):
    execution_relayer.write(_execution_relayer)
    return ()
end

func execute_call_array{syscall_ptr : felt*}(calls_len : felt, calls : Call*, response : felt*) -> (
        response_len : felt):
    alloc_locals

    # if no more calls
    if calls_len == 0:
        return (0)
    end

    # do the current call
    let this_call : Call = [calls]
    let res = call_contract(
        contract_address=this_call.to,
        function_selector=this_call.selector,
        calldata_size=this_call.calldata_len,
        calldata=this_call.calldata)

    # copy the result in response
    memcpy(response, res.retdata, res.retdata_size)
    # do the next calls recursively
    let (response_len) = execute_call_array(
        calls_len - 1, calls + Call.SIZE, response + res.retdata_size)
    return (response_len + res.retdata_size)
end

@external
func execute{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr : felt}(
        proposal_outcome : felt, execution_hash : Uint256, execution_params_len : felt,
        execution_params : felt*):
    alloc_locals

    let (caller_address) = get_caller_address()
    let (_execution_relayer) = execution_relayer.read()

    # Make sure the caller is the execution relayer
    with_attr error_message("Invalid caller"):
        assert caller_address = _execution_relayer
    end

    # Verify the hash
    # execution_params[0] is the address of this smart contract
    let (res) = hash_pedersen(execution_params_len - 1, &execution_params[1])

    with_attr error_message("Hash mismatch"):
        # Only use .low because it's a pedersen hash anyway
        assert res = execution_hash.low
    end

    let calls : Call* = cast(&execution_params[1], Call*)
    # execution_params[-1] is actually the length (see hash_pedersen comments)
    # so make sure we substract 2 and not just one
    let calls_len_in_felts = (execution_params_len - 2)
    # Should be a round number because it should be divisible by Call.SIZE
    let calls_len = calls_len_in_felts / Call.SIZE

    let (response : felt*) = alloc()
    execute_call_array(calls_len, calls, response)

    # We are not going to check anything about response
    return ()
end
