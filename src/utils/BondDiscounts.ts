import { Address, BigDecimal, BigInt, log} from '@graphprotocol/graph-ts'
import { HUMPBUSDBondV1 } from '../../generated/HUMPBUSDBondV1/HUMPBUSDBondV1';
import { BUSDBondV1 } from '../../generated/BUSDBondV1/BUSDBondV1';
import { BNBBondV1 } from '../../generated/BNBBondV1/BNBBondV1';
import { BondDiscount, Transaction } from '../../generated/schema'
import { 
    BUSDBOND_CONTRACTS1, BUSDBOND_CONTRACTS1_BLOCK, 
    BNBBOND_CONTRACT1, BNBBOND_CONTRACT1_BLOCK, 
    USDCBOND_CONTRACT1, USDCBOND_CONTRACT1_BLOCK, 
    HUMPBUSDSLPBOND_CONTRACT1, HUMPBUSDSLPBOND_CONTRACT1_BLOCK
} from './Constants';
import { hourFromTimestamp } from './Dates';
import { toDecimal } from './Decimals';
import { getHUMPUSDRate } from './Price';

export function loadOrCreateBondDiscount(timestamp: BigInt): BondDiscount{
    let hourTimestamp = hourFromTimestamp(timestamp);

    let bondDiscount = BondDiscount.load(hourTimestamp)
    if (bondDiscount == null) {
        bondDiscount = new BondDiscount(hourTimestamp)
        bondDiscount.timestamp = timestamp
        bondDiscount.busd_discount  = BigDecimal.fromString("0")
        bondDiscount.humpbusd_discount = BigDecimal.fromString("0")
        bondDiscount.usdc_discount = BigDecimal.fromString("0")
        bondDiscount.bnb_discount = BigDecimal.fromString("0")
        bondDiscount.save()
    }
    return bondDiscount as BondDiscount
}

export function updateBondDiscounts(transaction: Transaction): void{
    let bd = loadOrCreateBondDiscount(transaction.timestamp);
    let humpRate = getHUMPUSDRate();

    //HUMPBUSD
    if(transaction.blockNumber.gt(BigInt.fromString(HUMPBUSDSLPBOND_CONTRACT1_BLOCK))){
        let bond = HUMPBUSDBondV1.bind(Address.fromString(HUMPBUSDSLPBOND_CONTRACT1))
        let price_call = bond.try_bondPriceInUSD()
        if(price_call.reverted===false && price_call.value.gt(BigInt.fromI32(0))){
            bd.humpbusd_discount = humpRate.div(toDecimal(price_call.value, 18))
            bd.humpbusd_discount = bd.humpbusd_discount.minus(BigDecimal.fromString("1"))
            bd.humpbusd_discount = bd.humpbusd_discount.times(BigDecimal.fromString("100"))
            log.debug("HUMPBUSD Discount HUMP price {}  Bond Price {}  Discount {}", [humpRate.toString(), price_call.value.toString(), bd.humpbusd_discount.toString()])
        }
    }

    //BUSD
    if(transaction.blockNumber.gt(BigInt.fromString(BUSDBOND_CONTRACTS1_BLOCK))){
        let bond = BUSDBondV1.bind(Address.fromString(BUSDBOND_CONTRACTS1))
        let price_call = bond.try_bondPriceInUSD()
        if(price_call.reverted===false && price_call.value.gt(BigInt.fromI32(0))){
            bd.busd_discount = humpRate.div(toDecimal(price_call.value, 18))
            bd.busd_discount = bd.busd_discount.minus(BigDecimal.fromString("1"))
            bd.busd_discount = bd.busd_discount.times(BigDecimal.fromString("100"))
            log.debug("BUSD Discount HUMP price {}  Bond Price {}  Discount {}", [humpRate.toString(), price_call.value.toString(), bd.busd_discount.toString()])
        }    
    }

    //USDC
    if(transaction.blockNumber.gt(BigInt.fromString(USDCBOND_CONTRACT1_BLOCK))){
        let bond = BUSDBondV1.bind(Address.fromString(USDCBOND_CONTRACT1))
        let price_call = bond.try_bondPriceInUSD()
        if(price_call.reverted===false && price_call.value.gt(BigInt.fromI32(0))){
            bd.usdc_discount = humpRate.div(toDecimal(price_call.value, 18))
            bd.usdc_discount = bd.usdc_discount.minus(BigDecimal.fromString("1"))
            bd.usdc_discount = bd.usdc_discount.times(BigDecimal.fromString("100"))
            log.debug("FRAX Discount HUMP price {}  Bond Price {}  Discount {}", [humpRate.toString(), price_call.value.toString(), bd.usdc_discount.toString()])
        }
    }

    //BNB
    if(transaction.blockNumber.gt(BigInt.fromString(BNBBOND_CONTRACT1_BLOCK))){
        let bond = BNBBondV1.bind(Address.fromString(BNBBOND_CONTRACT1))
        let price_call = bond.try_bondPriceInUSD()
        if(price_call.reverted===false && price_call.value.gt(BigInt.fromI32(0))){
            bd.bnb_discount = humpRate.div(toDecimal(price_call.value, 18))
            bd.bnb_discount = bd.bnb_discount.minus(BigDecimal.fromString("1"))
            bd.bnb_discount = bd.bnb_discount.times(BigDecimal.fromString("100"))
            log.debug("BNB Discount HUMP price {}  Bond Price {}  Discount {}", [humpRate.toString(), price_call.value.toString(), bd.bnb_discount.toString()])
        }
    }
    
    bd.save()
}