import { DepositCall, RedeemCall  } from '../generated/HUMPBUSDBondV1/HUMPBUSDBondV1'
import { Deposit, Redemption } from '../generated/schema'
import { loadOrCreateTransaction } from "./utils/Transactions"
import { loadOrCreateHUMPie, updateHumpieBalance } from "./utils/HUMPie"
import { toDecimal } from "./utils/Decimals"
import { HUMPBUSDLPBOND_TOKEN, SUSHI_HUMPBUSD_PAIR } from './utils/Constants'
import { loadOrCreateToken } from './utils/Tokens'
import { createDailyBondRecord } from './utils/DailyBond'
import { getPairUSD } from './utils/Price'

export function handleDeposit(call: DepositCall): void {
  let humpie = loadOrCreateHUMPie(call.transaction.from)
  let transaction = loadOrCreateTransaction(call.transaction, call.block)
  let token = loadOrCreateToken(HUMPBUSDLPBOND_TOKEN)

  let amount = toDecimal(call.inputs._amount, 18)
  let deposit = new Deposit(transaction.id)
  deposit.transaction = transaction.id
  deposit.humpie = humpie.id
  deposit.amount = amount
  deposit.value = getPairUSD(call.inputs._amount, SUSHI_HUMPBUSD_PAIR)
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
  redemption.token = loadOrCreateToken(HUMPBUSDLPBOND_TOKEN).id;
  redemption.timestamp = transaction.timestamp;
  redemption.save()
  updateHumpieBalance(humpie, transaction)
}