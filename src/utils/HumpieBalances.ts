import { BigDecimal, BigInt, Address} from '@graphprotocol/graph-ts'
import { Humpie, HumpieBalance } from '../../generated/schema'
import { dayFromTimestamp } from './Dates';

export function loadOrCreateHumpieBalance(humpie: Humpie, timestamp: BigInt): HumpieBalance{
    let id = timestamp.toString()+humpie.id

    let humpieBalance = HumpieBalance.load(id)
    if (humpieBalance == null) {
        humpieBalance = new HumpieBalance(id)
        humpieBalance.humpie = humpie.id
        humpieBalance.timestamp = timestamp
        humpieBalance.shumpBalance = BigDecimal.fromString("0")
        humpieBalance.humpBalance = BigDecimal.fromString("0")
        humpieBalance.bondBalance = BigDecimal.fromString("0")
        humpieBalance.dollarBalance = BigDecimal.fromString("0")
        humpieBalance.stakes = []
        humpieBalance.bonds = []
        humpieBalance.save()
    }
    return humpieBalance as HumpieBalance
}

