import { Address, BigDecimal, BigInt, log} from '@graphprotocol/graph-ts'
import { HumpERC20 } from '../../generated/HumpStakingV1/HumpERC20';
import { sHumpERC20V1 } from '../../generated/HumpStakingV1/sHumpERC20V1';
import { CirculatingSupply } from '../../generated/HumpStakingV1/CirculatingSupply';
import { ERC20 } from '../../generated/HumpStakingV1/ERC20';
import { UniswapV2Pair } from '../../generated/HumpStakingV1/UniswapV2Pair';
import { HumpStakingV1 } from '../../generated/HumpStakingV1/HumpStakingV1';

import { ProtocolMetric, Transaction } from '../../generated/schema'
import { 
    SHUMP_ERC20_CONTRACTV1, UNI_HUMPBUSD_PAIR, CIRCULATING_SUPPLY_CONTRACT, 
    CIRCULATING_SUPPLY_CONTRACT_BLOCK, ERC20BUSD_CONTRACT, HUMP_ERC20_CONTRACT, 
    STAKING_CONTRACT_V1, TREASURY_ADDRESS_V1, WBNB_ERC20_CONTRACT 
} from './Constants';
import { dayFromTimestamp } from './Dates';
import { toDecimal } from './Decimals';
import { getHUMPUSDRate, getDiscountedPairUSD, getPairUSD, getBNBUSDRate } from './Price';
import { getHolderAux } from './Aux';
import { updateBondDiscounts } from './BondDiscounts';

export function loadOrCreateProtocolMetric(timestamp: BigInt): ProtocolMetric{
    let dayTimestamp = dayFromTimestamp(timestamp);

    let protocolMetric = ProtocolMetric.load(dayTimestamp)
    if (protocolMetric == null) {
        protocolMetric = new ProtocolMetric(dayTimestamp)
        protocolMetric.timestamp = timestamp
        protocolMetric.humpCirculatingSupply = BigDecimal.fromString("0")
        protocolMetric.sHumpCirculatingSupply = BigDecimal.fromString("0")
        protocolMetric.totalSupply = BigDecimal.fromString("0")
        protocolMetric.humpPrice = BigDecimal.fromString("0")
        protocolMetric.marketCap = BigDecimal.fromString("0")
        protocolMetric.totalValueLocked = BigDecimal.fromString("0")
        protocolMetric.treasuryRiskFreeValue = BigDecimal.fromString("0")
        protocolMetric.treasuryMarketValue = BigDecimal.fromString("0")
        protocolMetric.nextEpochRebase = BigDecimal.fromString("0")
        protocolMetric.nextDistributedHump = BigDecimal.fromString("0")
        protocolMetric.currentAPY = BigDecimal.fromString("0")
        protocolMetric.treasuryBusdRiskFreeValue = BigDecimal.fromString("0")
        protocolMetric.treasuryUsdcRiskFreeValue = BigDecimal.fromString("0")
        protocolMetric.treasuryBusdMarketValue = BigDecimal.fromString("0")
        protocolMetric.treasuryUsdcMarketValue = BigDecimal.fromString("0")
        protocolMetric.treasuryWBNBRiskFreeValue = BigDecimal.fromString("0")
        protocolMetric.treasuryWBNBMarketValue = BigDecimal.fromString("0")
        protocolMetric.treasuryHumpDaiPOL = BigDecimal.fromString("0")
        protocolMetric.treasuryHumpFraxPOL = BigDecimal.fromString("0")
        protocolMetric.treasuryHumpLusdPOL = BigDecimal.fromString("0")
        protocolMetric.treasuryHumpEthPOL = BigDecimal.fromString("0")
        protocolMetric.holders = BigInt.fromI32(0)

        protocolMetric.save()
    }
    return protocolMetric as ProtocolMetric
}


function getTotalSupply(): BigDecimal{
    let hump_contract = HumpERC20.bind(Address.fromString(HUMP_ERC20_CONTRACT))
    let total_supply = toDecimal(hump_contract.totalSupply(), 9)
    log.debug("Total Supply {}", [total_supply.toString()])
    return total_supply
}

function getCriculatingSupply(transaction: Transaction, total_supply: BigDecimal): BigDecimal{
    let circ_supply = BigDecimal.fromString("0")
    if(transaction.blockNumber.gt(BigInt.fromString(CIRCULATING_SUPPLY_CONTRACT_BLOCK))){
        let circulatingsupply_contract = CirculatingSupply.bind(Address.fromString(CIRCULATING_SUPPLY_CONTRACT))
        circ_supply = toDecimal(circulatingsupply_contract.HUMPCirculatingSupply(), 9)
    }
    else{
        circ_supply = total_supply;
    }
    log.debug("Circulating Supply {}", [total_supply.toString()])
    return circ_supply
}

function getShumpSupply(transaction: Transaction): BigDecimal{
    let shump_supply = BigDecimal.fromString("0")

    let shump_contract_v1 = sHumpERC20V1.bind(Address.fromString(SHUMP_ERC20_CONTRACTV1))
    shump_supply = shump_supply.plus(toDecimal(shump_contract_v1.circulatingSupply(), 9))
    
    log.debug("sHUMP Supply {}", [shump_supply.toString()])
    return shump_supply
}

function getMV_RFV(transaction: Transaction): BigDecimal[]{
    let busdERC20 = ERC20.bind(Address.fromString(ERC20BUSD_CONTRACT))
    let wethERC20 = ERC20.bind(Address.fromString(WBNB_ERC20_CONTRACT))

    let humpbusdPair = UniswapV2Pair.bind(Address.fromString(UNI_HUMPBUSD_PAIR))

    let treasury_address = TREASURY_ADDRESS_V1;

    let busdBalance = busdERC20.balanceOf(Address.fromString(treasury_address))

    let wethBalance = wethERC20.balanceOf(Address.fromString(treasury_address))
    let wbnb_value = toDecimal(wethBalance, 18).times(getBNBUSDRate())

    //HUMPBUSD
    let humpbusdBalance = humpbusdPair.balanceOf(Address.fromString(treasury_address))
    let humpbusdTotalLP = toDecimal(humpbusdPair.totalSupply(), 18)
    let humpbusdPOL = toDecimal(humpbusdBalance, 18).div(humpbusdTotalLP).times(BigDecimal.fromString("100"))
    let humpbusd_value = getPairUSD(humpbusdBalance, UNI_HUMPBUSD_PAIR)
    let humpbusd_rfv = getDiscountedPairUSD(humpbusdBalance, UNI_HUMPBUSD_PAIR)

    let stableValue = busdBalance
    let stableValueDecimal = toDecimal(stableValue, 18)

    let lpValue = humpbusd_value
    let rfvLpValue = humpbusd_rfv

    let mv = stableValueDecimal.plus(lpValue).plus(wbnb_value)
    let rfv = stableValueDecimal.plus(rfvLpValue)

    log.debug("Treasury Market Value {}", [mv.toString()])
    log.debug("Treasury RFV {}", [rfv.toString()])
    log.debug("Treasury BUSD value {}", [toDecimal(busdBalance, 18).toString()])
    log.debug("Treasury WBNB value {}", [wbnb_value.toString()])
    log.debug("Treasury HUMP-BUSD RFV {}", [humpbusd_rfv.toString()])

    return [
        mv, 
        rfv,
        // treasuryDaiRiskFreeValue = BUSD RFV * BUSD
        humpbusd_rfv.plus(toDecimal(busdBalance, 18)),       
        // POL
        humpbusdPOL
    ]
}

function getNextHUMPRebase(transaction: Transaction): BigDecimal{
    let next_distribution = BigDecimal.fromString("0")

    let staking_contract_v1 = HumpStakingV1.bind(Address.fromString(STAKING_CONTRACT_V1))
    let distribution_v2 = toDecimal(staking_contract_v1.epoch().value3,9)
    log.debug("next_distribution v2 {}", [distribution_v2.toString()])
    next_distribution = next_distribution.plus(distribution_v2)

    log.debug("next_distribution total {}", [next_distribution.toString()])

    return next_distribution
}

function getAPY_Rebase(sHUMP: BigDecimal, distributedHUMP: BigDecimal): BigDecimal[]{
    let nextEpochRebase = distributedHUMP.div(sHUMP).times(BigDecimal.fromString("100"));

    let nextEpochRebase_number = Number.parseFloat(nextEpochRebase.toString())
    let currentAPY = Math.pow(((nextEpochRebase_number/100)+1), (365*3)-1)*100

    let currentAPYdecimal = BigDecimal.fromString(currentAPY.toString())

    log.debug("next_rebase {}", [nextEpochRebase.toString()])
    log.debug("current_apy total {}", [currentAPYdecimal.toString()])

    return [currentAPYdecimal, nextEpochRebase]
}

function getRunway(sHUMP: BigDecimal, rfv: BigDecimal, rebase: BigDecimal): BigDecimal[]{
    let runway2dot5k = BigDecimal.fromString("0")
    let runway5k = BigDecimal.fromString("0")
    let runway7dot5k = BigDecimal.fromString("0")
    let runway10k = BigDecimal.fromString("0")
    let runway20k = BigDecimal.fromString("0")
    let runway50k = BigDecimal.fromString("0")
    let runway70k = BigDecimal.fromString("0")
    let runway100k = BigDecimal.fromString("0")
    let runwayCurrent = BigDecimal.fromString("0")

    if(sHUMP.gt(BigDecimal.fromString("0")) && rfv.gt(BigDecimal.fromString("0")) &&  rebase.gt(BigDecimal.fromString("0"))){
        let treasury_runway = Number.parseFloat(rfv.div(sHUMP).toString())

        let runway2dot5k_num = (Math.log(treasury_runway) / Math.log(1+0.0029438))/3;
        let runway5k_num = (Math.log(treasury_runway) / Math.log(1+0.003579))/3;
        let runway7dot5k_num = (Math.log(treasury_runway) / Math.log(1+0.0039507))/3;
        let runway10k_num = (Math.log(treasury_runway) / Math.log(1+0.00421449))/3;
        let runway20k_num = (Math.log(treasury_runway) / Math.log(1+0.00485037))/3;
        let runway50k_num = (Math.log(treasury_runway) / Math.log(1+0.00569158))/3;
        let runway70k_num = (Math.log(treasury_runway) / Math.log(1+0.00600065))/3;
        let runway100k_num = (Math.log(treasury_runway) / Math.log(1+0.00632839))/3;
        let nextEpochRebase_number = Number.parseFloat(rebase.toString())/100
        let runwayCurrent_num = (Math.log(treasury_runway) / Math.log(1+nextEpochRebase_number))/3;

        runway2dot5k = BigDecimal.fromString(runway2dot5k_num.toString())
        runway5k = BigDecimal.fromString(runway5k_num.toString())
        runway7dot5k = BigDecimal.fromString(runway7dot5k_num.toString())
        runway10k = BigDecimal.fromString(runway10k_num.toString())
        runway20k = BigDecimal.fromString(runway20k_num.toString())
        runway50k = BigDecimal.fromString(runway50k_num.toString())
        runway70k = BigDecimal.fromString(runway70k_num.toString())
        runway100k = BigDecimal.fromString(runway100k_num.toString())
        runwayCurrent = BigDecimal.fromString(runwayCurrent_num.toString())
    }

    return [runway2dot5k, runway5k, runway7dot5k, runway10k, runway20k, runway50k, runway70k, runway100k, runwayCurrent]
}


export function updateProtocolMetrics(transaction: Transaction): void{
    let pm = loadOrCreateProtocolMetric(transaction.timestamp);

    //Total Supply
    pm.totalSupply = getTotalSupply()

    //Circ Supply
    pm.humpCirculatingSupply = getCriculatingSupply(transaction, pm.totalSupply)

    //sHump Supply
    pm.sHumpCirculatingSupply = getShumpSupply(transaction)

    //HUMP Price
    pm.humpPrice = getHUMPUSDRate()

    //HUMP Market Cap
    pm.marketCap = pm.humpCirculatingSupply.times(pm.humpPrice)

    //Total Value Locked
    pm.totalValueLocked = pm.sHumpCirculatingSupply.times(pm.humpPrice)

    //Treasury RFV and MV
    let mv_rfv = getMV_RFV(transaction)
    pm.treasuryMarketValue = mv_rfv[0]

    pm.treasuryRiskFreeValue = mv_rfv[1]

    pm.treasuryBusdRiskFreeValue = mv_rfv[2]
    
    pm.treasuryUsdcRiskFreeValue = mv_rfv[3]
    pm.treasuryBusdMarketValue = mv_rfv[4]
    pm.treasuryUsdcMarketValue = mv_rfv[5]
    pm.treasuryWBNBRiskFreeValue = mv_rfv[6]
    pm.treasuryWBNBMarketValue = mv_rfv[7]
    pm.treasuryHumpDaiPOL = mv_rfv[8]
    pm.treasuryHumpFraxPOL = mv_rfv[9]
    pm.treasuryHumpLusdPOL = mv_rfv[10]
    pm.treasuryHumpEthPOL = mv_rfv[11]

    // Rebase rewards, APY, rebase
    pm.nextDistributedHump = getNextHUMPRebase(transaction)
    let apy_rebase = getAPY_Rebase(pm.sHumpCirculatingSupply, pm.nextDistributedHump)
    pm.currentAPY = apy_rebase[0]
    pm.nextEpochRebase = apy_rebase[1]

    //Runway
    let runways = getRunway(pm.sHumpCirculatingSupply, pm.treasuryRiskFreeValue, pm.nextEpochRebase)
    pm.runway2dot5k = runways[0]
    pm.runway5k = runways[1]
    pm.runway7dot5k = runways[2]
    pm.runway10k = runways[3]
    pm.runway20k = runways[4]
    pm.runway50k = runways[5]
    pm.runway70k = runways[6]
    pm.runway100k = runways[7]
    pm.runwayCurrent = runways[8]

    //Holders
    pm.holders = getHolderAux().value
    
    pm.save()
    
    updateBondDiscounts(transaction)
}