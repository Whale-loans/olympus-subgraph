import { Address } from '@graphprotocol/graph-ts'

import {  DepositCall, RedeemCall  } from '../generated/BUSDBondV1/BUSDBondV1'
import { Deposit, Redemption } from '../generated/schema'
import { loadOrCreateTransaction } from "./utils/Transactions"
import { loadOrCreateHUMPie, updateHumpieBalance } from "./utils/HUMPie"
import { toDecimal } from "./utils/Decimals"
import { BUSDBOND_TOKEN } from './utils/Constants'
import { loadOrCreateToken } from './utils/Tokens'
import { loadOrCreateRedemption } from './utils/Redemption'
import { createDailyBondRecord } from './utils/DailyBond'


export function handleDeposit(call: DepositCall): void {
  let humpie = loadOrCreateHUMPie(call.transaction.from)
  let transaction = loadOrCreateTransaction(call.transaction, call.block)
  let token = loadOrCreateToken(BUSDBOND_TOKEN)

  let amount = toDecimal(call.inputs._amount, 18)
  let deposit = new Deposit(transaction.id)
  deposit.transaction = transaction.id
  deposit.humpie = humpie.id
  deposit.amount = amount
  deposit.value = amount
  deposit.maxPremium = toDecimal(call.inputs._maxPrice)
  deposit.token = token.id;
  deposit.timestamp = transaction.timestamp;
  deposit.save()

  createDailyBondRecord(deposit.timestamp, token, deposit.amount, deposit.value)
  updateHumpieBalance(humpie, transaction)
}

export function handleRedeem(call: RedeemCall): void {
  let humpie = loadOrCreateHUMPie(call.transaction.from)
  let transaction = loadOrCreateTransaction(call.transaction, call.block)
  
  let redemption = loadOrCreateRedemption(call.transaction.hash as Address)
  redemption.transaction = transaction.id
  redemption.humpie = humpie.id
  redemption.token = loadOrCreateToken(BUSDBOND_TOKEN).id;
  redemption.timestamp = transaction.timestamp;
  redemption.save()
  updateHumpieBalance(humpie, transaction)
}