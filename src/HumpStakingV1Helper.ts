import { Address } from '@graphprotocol/graph-ts'
import { Stake, Unstake } from '../generated/schema'

import {  StakeCall  } from '../generated/HumpStakingV1Helper/HumpStakingV1Helper'
import { toDecimal } from "./utils/Decimals"
import { loadOrCreateHUMPie, updateHumpieBalance } from "./utils/HUMPie"
import { loadOrCreateTransaction } from "./utils/Transactions"

export function handleStake(call: StakeCall): void {
    let humpie = loadOrCreateHUMPie(call.from as Address)
    let transaction = loadOrCreateTransaction(call.transaction, call.block)
    let value = toDecimal(call.inputs._amount, 9)

    let stake = new Stake(transaction.id)
    stake.transaction = transaction.id
    stake.humpie = humpie.id
    stake.amount = value
    stake.timestamp = transaction.timestamp;
    stake.save()

    updateHumpieBalance(humpie, transaction)
}