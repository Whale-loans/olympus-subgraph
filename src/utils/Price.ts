import {
    SUSHI_HUMPBUSD_PAIR, SUSHI_USDC_BNB_PAIR
} from './Constants'
import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts'
import { UniswapV2Pair } from '../../generated/HumpStakingV1/UniswapV2Pair';
import { toDecimal } from './Decimals'


let BIG_DECIMAL_1E9 = BigDecimal.fromString('1e9')
let BIG_DECIMAL_1E12 = BigDecimal.fromString('1e12')

export function getBNBUSDRate(): BigDecimal {
    let pair = UniswapV2Pair.bind(Address.fromString(SUSHI_USDC_BNB_PAIR))

    let reserves = pair.getReserves()
    let reserve0 = reserves.value0.toBigDecimal()
    let reserve1 = reserves.value1.toBigDecimal()

    let ethRate = reserve0.div(reserve1).times(BIG_DECIMAL_1E12)
    log.debug("BNB rate {}", [ethRate.toString()])
    
    return ethRate
}

export function getHUMPUSDRate(): BigDecimal {
    let pair = UniswapV2Pair.bind(Address.fromString(SUSHI_HUMPBUSD_PAIR))

    let reserves = pair.getReserves()
    let reserve0 = reserves.value0.toBigDecimal()
    let reserve1 = reserves.value1.toBigDecimal()

    let humpRate = reserve1.div(reserve0).div(BIG_DECIMAL_1E9)
    log.debug("HUMP rate {}", [humpRate.toString()])

    return humpRate
}

//(slp_treasury/slp_supply)*(2*sqrt(lp_busd * lp_hump))
export function getDiscountedPairUSD(lp_amount: BigInt, pair_adress: string): BigDecimal{
    let pair = UniswapV2Pair.bind(Address.fromString(pair_adress))

    let total_lp = pair.totalSupply()
    let lp_token_1 = toDecimal(pair.getReserves().value0, 9)
    let lp_token_2 = toDecimal(pair.getReserves().value1, 18)
    let kLast = lp_token_1.times(lp_token_2).truncate(0).digits

    let part1 = toDecimal(lp_amount,18).div(toDecimal(total_lp,18))
    let two = BigInt.fromI32(2)

    let sqrt = kLast.sqrt();
    let part2 = toDecimal(two.times(sqrt), 0)
    let result = part1.times(part2)
    return result
}

export function getPairUSD(lp_amount: BigInt, pair_adress: string): BigDecimal{
    let pair = UniswapV2Pair.bind(Address.fromString(pair_adress))
    let total_lp = pair.totalSupply()
    let lp_token_0 = pair.getReserves().value0
    let lp_token_1 = pair.getReserves().value1
    let ownedLP = toDecimal(lp_amount,18).div(toDecimal(total_lp,18))
    let hump_value = toDecimal(lp_token_0, 9).times(getHUMPUSDRate())
    let total_lp_usd = hump_value.plus(toDecimal(lp_token_1, 18))

    return ownedLP.times(total_lp_usd)
}

export function getPairWBNB(lp_amount: BigInt, pair_adress: string): BigDecimal{
    let pair = UniswapV2Pair.bind(Address.fromString(pair_adress))
    let total_lp = pair.totalSupply()
    let lp_token_0 = pair.getReserves().value0
    let lp_token_1 = pair.getReserves().value1
    let ownedLP = toDecimal(lp_amount,18).div(toDecimal(total_lp,18))
    let hump_value = toDecimal(lp_token_0, 9).times(getHUMPUSDRate())
    let eth_value = toDecimal(lp_token_1, 18).times(getBNBUSDRate())
    let total_lp_usd = hump_value.plus(eth_value)

    return ownedLP.times(total_lp_usd)
}