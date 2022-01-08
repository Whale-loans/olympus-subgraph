import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts'
import { Humpie, Transaction } from '../../generated/schema'
import { HumpERC20 } from '../../generated/BUSDBondV1/HumpERC20'
import { sHumpERC20V1 } from '../../generated/BUSDBondV1/sHumpERC20V1'
import { BUSDBondV1 } from '../../generated/BUSDBondV1/BUSDBondV1'
import { HUMPBUSDBondV1 } from '../../generated/BUSDBondV1/HUMPBUSDBondV1'
import { BNBBondV1 } from '../../generated/BUSDBondV1/BNBBondV1'

import { 
    BUSDBOND_CONTRACTS1, BUSDBOND_CONTRACTS1_BLOCK, BNBBOND_CONTRACT1, BNBBOND_CONTRACT1_BLOCK, 
    HUMPBUSDSLPBOND_CONTRACT1, HUMPBUSDSLPBOND_CONTRACT1_BLOCK, HUMP_ERC20_CONTRACT, 
    SHUMP_ERC20_CONTRACTV1, USDCBOND_CONTRACT1_BLOCK,
    USDCBOND_CONTRACT1
} from '../utils/Constants'
import { loadOrCreateHumpieBalance } from './HumpieBalances'
import { toDecimal } from './Decimals'
import { getHUMPUSDRate } from './Price'
import { loadOrCreateContractInfo } from './ContractInfo'
import { getHolderAux } from './Aux'

export function loadOrCreateHUMPie(addres: Address): Humpie{
    let humpie = Humpie.load(addres.toHex())
    if (humpie == null) {
        let holders = getHolderAux()
        holders.value = holders.value.plus(BigInt.fromI32(1))
        holders.save()

        humpie = new Humpie(addres.toHex())
        humpie.active = true
        humpie.save()
    }
    return humpie as Humpie
}

export function updateHumpieBalance(humpie: Humpie, transaction: Transaction): void{

    let balance = loadOrCreateHumpieBalance(humpie, transaction.timestamp)

    let hump_contract = HumpERC20.bind(Address.fromString(HUMP_ERC20_CONTRACT))
    balance.humpBalance = toDecimal(hump_contract.balanceOf(Address.fromString(humpie.id)), 9)

    let stakes = balance.stakes

    let shump_contract_v1 = sHumpERC20V1.bind(Address.fromString(SHUMP_ERC20_CONTRACTV1))
    let shumpV2Balance = toDecimal(shump_contract_v1.balanceOf(Address.fromString(humpie.id)), 9)
    balance.shumpBalance = shumpV2Balance

    let cinfoShumpBalance_v1 = loadOrCreateContractInfo(humpie.id + transaction.timestamp.toString() + "sHumpERC20V1")
    cinfoShumpBalance_v1.name = "sHUMP"
    cinfoShumpBalance_v1.contract = SHUMP_ERC20_CONTRACTV1
    cinfoShumpBalance_v1.amount = shumpV2Balance
    cinfoShumpBalance_v1.save()
    stakes.push(cinfoShumpBalance_v1.id)

    balance.stakes = stakes

    if(humpie.active && balance.humpBalance.lt(BigDecimal.fromString("0.01")) && balance.shumpBalance.lt(BigDecimal.fromString("0.01"))){
        let holders = getHolderAux()
        holders.value = holders.value.minus(BigInt.fromI32(1))
        holders.save()
        humpie.active = false
    }
    else if(humpie.active==false && (balance.humpBalance.gt(BigDecimal.fromString("0.01")) || balance.shumpBalance.gt(BigDecimal.fromString("0.01")))){
        let holders = getHolderAux()
        holders.value = holders.value.plus(BigInt.fromI32(1))
        holders.save()
        humpie.active = true
    }

    //HUMP-BUSD
    let bonds = balance.bonds
    if(transaction.blockNumber.gt(BigInt.fromString(HUMPBUSDSLPBOND_CONTRACT1_BLOCK))){
        let bondHUMPDai_contract = HUMPBUSDBondV1.bind(Address.fromString(HUMPBUSDSLPBOND_CONTRACT1))
        let pending = bondHUMPDai_contract.bondInfo(Address.fromString(humpie.id))
        if (pending.value1.gt(BigInt.fromString("0"))){
            let pending_bond = toDecimal(pending.value1, 9)
            balance.bondBalance = balance.bondBalance.plus(pending_bond)

            let binfo = loadOrCreateContractInfo(humpie.id + transaction.timestamp.toString() + "HUMPBUSDBondV1")
            binfo.name = "HUMP-BUSD"
            binfo.contract = HUMPBUSDSLPBOND_CONTRACT1
            binfo.amount = pending_bond
            binfo.save()
            bonds.push(binfo.id)

            log.debug("Humpie {} pending HUMPBUSDBondV1 V1 {} on tx {}", [humpie.id, toDecimal(pending.value1, 9).toString(), transaction.id])
        }
    }

    //BUSD
    if(transaction.blockNumber.gt(BigInt.fromString(BUSDBOND_CONTRACTS1_BLOCK))){
        let bondDai_contract = BUSDBondV1.bind(Address.fromString(BUSDBOND_CONTRACTS1))
        let pending = bondDai_contract.bondInfo(Address.fromString(humpie.id))
        if (pending.value1.gt(BigInt.fromString("0"))){
            let pending_bond = toDecimal(pending.value1, 9)
            balance.bondBalance = balance.bondBalance.plus(pending_bond)

            let binfo = loadOrCreateContractInfo(humpie.id + transaction.timestamp.toString() + "BUSDBondV1")
            binfo.name = "BUSD"
            binfo.contract = BUSDBOND_CONTRACTS1
            binfo.amount = pending_bond
            binfo.save()
            bonds.push(binfo.id)

            log.debug("Humpie {} pending BUSDBondV3 V1 {} on tx {}", [humpie.id, toDecimal(pending.value1, 9).toString(), transaction.id])
        }
    }

    //USDC
    if(transaction.blockNumber.gt(BigInt.fromString(USDCBOND_CONTRACT1_BLOCK))){
        let bondFRAX_contract = BUSDBondV1.bind(Address.fromString(USDCBOND_CONTRACT1))
        let pending = bondFRAX_contract.bondInfo(Address.fromString(humpie.id))
        if (pending.value1.gt(BigInt.fromString("0"))){
            let pending_bond = toDecimal(pending.value1, 9)
            balance.bondBalance = balance.bondBalance.plus(pending_bond)

            let binfo = loadOrCreateContractInfo(humpie.id + transaction.timestamp.toString() + "BUSDBondV1")
            binfo.name = "USDC"
            binfo.contract = USDCBOND_CONTRACT1
            binfo.amount = pending_bond
            binfo.save()
            bonds.push(binfo.id)

            log.debug("Humpie {} pending USDCBondV1 V1 {} on tx {}", [humpie.id, toDecimal(pending.value1, 9).toString(), transaction.id])
        }
    }

    //WBNB
    if(transaction.blockNumber.gt(BigInt.fromString(BNBBOND_CONTRACT1_BLOCK))){
        let bondBNB_contract = BNBBondV1.bind(Address.fromString(BNBBOND_CONTRACT1))
        let pending = bondBNB_contract.bondInfo(Address.fromString(humpie.id))
        if (pending.value1.gt(BigInt.fromString("0"))){
            let pending_bond = toDecimal(pending.value1, 9)
            balance.bondBalance = balance.bondBalance.plus(pending_bond)

            let binfo = loadOrCreateContractInfo(humpie.id + transaction.timestamp.toString() + "WBNBBondV1")
            binfo.name = "WBNB"
            binfo.contract = BNBBOND_CONTRACT1
            binfo.amount = pending_bond
            binfo.save()
            bonds.push(binfo.id)

            log.debug("Humpie {} pending BNBBondV1 V1 {} on tx {}", [humpie.id, toDecimal(pending.value1, 9).toString(), transaction.id])
        }
    }
    balance.bonds = bonds

    //Price
    let usdRate = getHUMPUSDRate()
    balance.dollarBalance = balance.humpBalance.times(usdRate).plus(balance.shumpBalance.times(usdRate)).plus(balance.bondBalance.times(usdRate))
    balance.save()

    humpie.lastBalance = balance.id;
    humpie.save()
}