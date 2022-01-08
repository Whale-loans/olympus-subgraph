import {  DepositCall, RedeemCall  } from '../generated/BNBBondV1/BNBBondV1'
import { Deposit, Redemption } from '../generated/schema'
import { loadOrCreateTransaction } from "./utils/Transactions"
import { loadOrCreateHUMPie, updateHumpieBalance } from "./utils/HUMPie"
import { toDecimal } from "./utils/Decimals"
import { BNBBOND_TOKEN } from './utils/Constants'
import { loadOrCreateToken } from './utils/Tokens'
import { createDailyBondRecord } from './utils/DailyBond'
import { getBNBUSDRate } from './utils/Price'

export function handleDeposit(call: DepositCall): void {
  let humpie = loadOrCreateHUMPie(call.transaction.from)
  let transaction = loadOrCreateTransaction(call.transaction, call.block)
  let token = loadOrCreateToken(BNBBOND_TOKEN)

  let amount = toDecimal(call.inputs._amount, 18)
  let deposit = new Deposit(transaction.id)
  deposit.transaction = transaction.id
  deposit.humpie = humpie.id
  deposit.amount = amount
  deposit.value = amount.times(getBNBUSDRate())
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
  
  let redemption = Redemption.load(transaction.id)
  if (redemption==null){
    redemption = new Redemption(transaction.id)
  }
  redemption.transaction = transaction.id
  redemption.humpie = humpie.id
  redemption.token = loadOrCreateToken(BNBBOND_TOKEN).id;
  redemption.timestamp = transaction.timestamp;
  redemption.save()
  updateHumpieBalance(humpie, transaction)
}