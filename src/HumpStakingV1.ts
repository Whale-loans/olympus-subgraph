import { Address } from '@graphprotocol/graph-ts'
import { Stake, Unstake } from '../generated/schema'

import {  StakeCall, UnstakeCall  } from '../generated/HumpStakingV1/HumpStakingV1'
import { toDecimal } from "./utils/Decimals"
import { loadOrCreateHUMPie, updateHumpieBalance } from "./utils/HUMPie"
import { loadOrCreateTransaction } from "./utils/Transactions"
import { updateProtocolMetrics } from './utils/ProtocolMetrics'

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
    updateProtocolMetrics(transaction)
}

export function handleUnstake(call: UnstakeCall): void {
    let humpie = loadOrCreateHUMPie(call.from as Address)
    let transaction = loadOrCreateTransaction(call.transaction, call.block)
    let value = toDecimal(call.inputs._amount, 9)

    let unstake = new Unstake(transaction.id)
    unstake.transaction = transaction.id
    unstake.humpie = humpie.id
    unstake.amount = value
    unstake.timestamp = transaction.timestamp;
    unstake.save()

    updateHumpieBalance(humpie, transaction)
    updateProtocolMetrics(transaction)
}