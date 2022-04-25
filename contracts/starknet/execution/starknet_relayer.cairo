%lang starknet

from starkware.cairo.common.uint256 import Uint256
from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.alloc import alloc
from starkware.starknet.common.messages import send_message_to_l1
from contracts.starknet.lib.hash_pedersen import hash_pedersen
from contracts.starknet.execution.interface import IExecutionStrategy
from starkware.cairo.common.cairo_builtins import HashBuiltin

@external
func execute{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr : felt}(
        proposal_outcome : felt, execution_hash : Uint256, execution_params_len : felt,
        execution_params : felt*):
    # Verify that execution_params, when hashed, actually make `execution_hash` (only use .low because we will use pedersen hash)
    # decode transactions from execution_params

    let address = execution_params[0]
    # Send it to the execution address
    IExecutionStrategy.execute(
        contract_address=address,
        proposal_outcome=proposal_outcome,
        execution_hash=execution_hash,
        execution_params_len=execution_params_len,
        execution_params=execution_params)
    return ()
end
