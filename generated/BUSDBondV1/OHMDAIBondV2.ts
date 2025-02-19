// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class OwnershipPulled extends ethereum.Event {
  get params(): OwnershipPulled__Params {
    return new OwnershipPulled__Params(this);
  }
}

export class OwnershipPulled__Params {
  _event: OwnershipPulled;

  constructor(event: OwnershipPulled) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class OwnershipPushed extends ethereum.Event {
  get params(): OwnershipPushed__Params {
    return new OwnershipPushed__Params(this);
  }
}

export class OwnershipPushed__Params {
  _event: OwnershipPushed;

  constructor(event: OwnershipPushed) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class HUMPBUSDBondV1__bondInfoResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: BigInt;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: BigInt
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    return map;
  }
}

export class HUMPBUSDBondV1 extends ethereum.SmartContract {
  static bind(address: Address): HUMPBUSDBondV1 {
    return new HUMPBUSDBondV1("HUMPBUSDBondV1", address);
  }

  DAO(): Address {
    let result = super.call("DAO", "DAO():(address)", []);

    return result[0].toAddress();
  }

  try_DAO(): ethereum.CallResult<Address> {
    let result = super.tryCall("DAO", "DAO():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  DAOShare(): BigInt {
    let result = super.call("DAOShare", "DAOShare():(uint256)", []);

    return result[0].toBigInt();
  }

  try_DAOShare(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("DAOShare", "DAOShare():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  LP(): Address {
    let result = super.call("LP", "LP():(address)", []);

    return result[0].toAddress();
  }

  try_LP(): ethereum.CallResult<Address> {
    let result = super.tryCall("LP", "LP():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  HUMP(): Address {
    let result = super.call("HUMP", "HUMP():(address)", []);

    return result[0].toAddress();
  }

  try_HUMP(): ethereum.CallResult<Address> {
    let result = super.tryCall("HUMP", "HUMP():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  bondCalculator(): Address {
    let result = super.call("bondCalculator", "bondCalculator():(address)", []);

    return result[0].toAddress();
  }

  try_bondCalculator(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "bondCalculator",
      "bondCalculator():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  bondInfo(param0: Address): HUMPBUSDBondV1__bondInfoResult {
    let result = super.call(
      "bondInfo",
      "bondInfo(address):(uint256,uint256,uint256,uint256,uint256)",
      [ethereum.Value.fromAddress(param0)]
    );

    return new HUMPBUSDBondV1__bondInfoResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBigInt()
    );
  }

  try_bondInfo(
    param0: Address
  ): ethereum.CallResult<HUMPBUSDBondV1__bondInfoResult> {
    let result = super.tryCall(
      "bondInfo",
      "bondInfo(address):(uint256,uint256,uint256,uint256,uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new HUMPBUSDBondV1__bondInfoResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toBigInt()
      )
    );
  }

  bondPrice(): BigInt {
    let result = super.call("bondPrice", "bondPrice():(uint256)", []);

    return result[0].toBigInt();
  }

  try_bondPrice(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("bondPrice", "bondPrice():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  bondPriceInBUSD(): BigInt {
    let result = super.call("bondPriceInBUSD", "bondPriceInBUSD():(uint256)", []);

    return result[0].toBigInt();
  }

  try_bondPriceInBUSD(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "bondPriceInBUSD",
      "bondPriceInBUSD():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  bondPriceWithoutFloor(): BigInt {
    let result = super.call(
      "bondPriceWithoutFloor",
      "bondPriceWithoutFloor():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_bondPriceWithoutFloor(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "bondPriceWithoutFloor",
      "bondPriceWithoutFloor():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  circulatingHUMPContract(): Address {
    let result = super.call(
      "circulatingHUMPContract",
      "circulatingHUMPContract():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_circulatingHUMPContract(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "circulatingHUMPContract",
      "circulatingHUMPContract():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  controlVariable(): BigInt {
    let result = super.call(
      "controlVariable",
      "controlVariable():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_controlVariable(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "controlVariable",
      "controlVariable():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  debtRatio(): BigInt {
    let result = super.call("debtRatio", "debtRatio():(uint256)", []);

    return result[0].toBigInt();
  }

  try_debtRatio(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("debtRatio", "debtRatio():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  deposit(amount_: BigInt, maxPremium_: BigInt, depositor_: Address): BigInt {
    let result = super.call(
      "deposit",
      "deposit(uint256,uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(amount_),
        ethereum.Value.fromUnsignedBigInt(maxPremium_),
        ethereum.Value.fromAddress(depositor_)
      ]
    );

    return result[0].toBigInt();
  }

  try_deposit(
    amount_: BigInt,
    maxPremium_: BigInt,
    depositor_: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "deposit",
      "deposit(uint256,uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(amount_),
        ethereum.Value.fromUnsignedBigInt(maxPremium_),
        ethereum.Value.fromAddress(depositor_)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  distributor(): Address {
    let result = super.call("distributor", "distributor():(address)", []);

    return result[0].toAddress();
  }

  try_distributor(): ethereum.CallResult<Address> {
    let result = super.tryCall("distributor", "distributor():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  manager(): Address {
    let result = super.call("manager", "manager():(address)", []);

    return result[0].toAddress();
  }

  try_manager(): ethereum.CallResult<Address> {
    let result = super.tryCall("manager", "manager():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  maxPayout(): BigInt {
    let result = super.call("maxPayout", "maxPayout():(uint256)", []);

    return result[0].toBigInt();
  }

  try_maxPayout(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("maxPayout", "maxPayout():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  maxPayoutPercent(): BigInt {
    let result = super.call(
      "maxPayoutPercent",
      "maxPayoutPercent():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_maxPayoutPercent(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "maxPayoutPercent",
      "maxPayoutPercent():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  minimumPrice(): BigInt {
    let result = super.call("minimumPrice", "minimumPrice():(uint256)", []);

    return result[0].toBigInt();
  }

  try_minimumPrice(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("minimumPrice", "minimumPrice():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  payoutFor(value_: BigInt): BigInt {
    let result = super.call("payoutFor", "payoutFor(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(value_)
    ]);

    return result[0].toBigInt();
  }

  try_payoutFor(value_: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall("payoutFor", "payoutFor(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(value_)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  pendingPayoutFor(depositor_: Address): BigInt {
    let result = super.call(
      "pendingPayoutFor",
      "pendingPayoutFor(address):(uint256)",
      [ethereum.Value.fromAddress(depositor_)]
    );

    return result[0].toBigInt();
  }

  try_pendingPayoutFor(depositor_: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "pendingPayoutFor",
      "pendingPayoutFor(address):(uint256)",
      [ethereum.Value.fromAddress(depositor_)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  percentVestedFor(depositor_: Address): BigInt {
    let result = super.call(
      "percentVestedFor",
      "percentVestedFor(address):(uint256)",
      [ethereum.Value.fromAddress(depositor_)]
    );

    return result[0].toBigInt();
  }

  try_percentVestedFor(depositor_: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "percentVestedFor",
      "percentVestedFor(address):(uint256)",
      [ethereum.Value.fromAddress(depositor_)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  recoverLostToken(token_: Address): boolean {
    let result = super.call(
      "recoverLostToken",
      "recoverLostToken(address):(bool)",
      [ethereum.Value.fromAddress(token_)]
    );

    return result[0].toBoolean();
  }

  try_recoverLostToken(token_: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "recoverLostToken",
      "recoverLostToken(address):(bool)",
      [ethereum.Value.fromAddress(token_)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  redeem(): BigInt {
    let result = super.call("redeem", "redeem():(uint256)", []);

    return result[0].toBigInt();
  }

  try_redeem(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("redeem", "redeem():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  setBondTerm(
    controlVariable_: BigInt,
    vestingTerm_: BigInt,
    minPrice_: BigInt,
    maxPayout_: BigInt,
    DAOShare_: BigInt
  ): boolean {
    let result = super.call(
      "setBondTerm",
      "setBondTerm(uint256,uint256,uint256,uint256,uint256):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(controlVariable_),
        ethereum.Value.fromUnsignedBigInt(vestingTerm_),
        ethereum.Value.fromUnsignedBigInt(minPrice_),
        ethereum.Value.fromUnsignedBigInt(maxPayout_),
        ethereum.Value.fromUnsignedBigInt(DAOShare_)
      ]
    );

    return result[0].toBoolean();
  }

  try_setBondTerm(
    controlVariable_: BigInt,
    vestingTerm_: BigInt,
    minPrice_: BigInt,
    maxPayout_: BigInt,
    DAOShare_: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "setBondTerm",
      "setBondTerm(uint256,uint256,uint256,uint256,uint256):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(controlVariable_),
        ethereum.Value.fromUnsignedBigInt(vestingTerm_),
        ethereum.Value.fromUnsignedBigInt(minPrice_),
        ethereum.Value.fromUnsignedBigInt(maxPayout_),
        ethereum.Value.fromUnsignedBigInt(DAOShare_)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  totalDebt(): BigInt {
    let result = super.call("totalDebt", "totalDebt():(uint256)", []);

    return result[0].toBigInt();
  }

  try_totalDebt(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("totalDebt", "totalDebt():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  treasury(): Address {
    let result = super.call("treasury", "treasury():(address)", []);

    return result[0].toAddress();
  }

  try_treasury(): ethereum.CallResult<Address> {
    let result = super.tryCall("treasury", "treasury():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  vestingTerm(): BigInt {
    let result = super.call("vestingTerm", "vestingTerm():(uint256)", []);

    return result[0].toBigInt();
  }

  try_vestingTerm(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("vestingTerm", "vestingTerm():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get HUMP_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get LP_(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get treasury_(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get distributor_(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get DAO_(): Address {
    return this._call.inputValues[4].value.toAddress();
  }

  get circulatingHUMPContract_(): Address {
    return this._call.inputValues[5].value.toAddress();
  }

  get bondCalculator_(): Address {
    return this._call.inputValues[6].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class DepositCall extends ethereum.Call {
  get inputs(): DepositCall__Inputs {
    return new DepositCall__Inputs(this);
  }

  get outputs(): DepositCall__Outputs {
    return new DepositCall__Outputs(this);
  }
}

export class DepositCall__Inputs {
  _call: DepositCall;

  constructor(call: DepositCall) {
    this._call = call;
  }

  get amount_(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get maxPremium_(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get depositor_(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class DepositCall__Outputs {
  _call: DepositCall;

  constructor(call: DepositCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class PullManagementCall extends ethereum.Call {
  get inputs(): PullManagementCall__Inputs {
    return new PullManagementCall__Inputs(this);
  }

  get outputs(): PullManagementCall__Outputs {
    return new PullManagementCall__Outputs(this);
  }
}

export class PullManagementCall__Inputs {
  _call: PullManagementCall;

  constructor(call: PullManagementCall) {
    this._call = call;
  }
}

export class PullManagementCall__Outputs {
  _call: PullManagementCall;

  constructor(call: PullManagementCall) {
    this._call = call;
  }
}

export class PushManagementCall extends ethereum.Call {
  get inputs(): PushManagementCall__Inputs {
    return new PushManagementCall__Inputs(this);
  }

  get outputs(): PushManagementCall__Outputs {
    return new PushManagementCall__Outputs(this);
  }
}

export class PushManagementCall__Inputs {
  _call: PushManagementCall;

  constructor(call: PushManagementCall) {
    this._call = call;
  }

  get newOwner_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class PushManagementCall__Outputs {
  _call: PushManagementCall;

  constructor(call: PushManagementCall) {
    this._call = call;
  }
}

export class RecoverLostTokenCall extends ethereum.Call {
  get inputs(): RecoverLostTokenCall__Inputs {
    return new RecoverLostTokenCall__Inputs(this);
  }

  get outputs(): RecoverLostTokenCall__Outputs {
    return new RecoverLostTokenCall__Outputs(this);
  }
}

export class RecoverLostTokenCall__Inputs {
  _call: RecoverLostTokenCall;

  constructor(call: RecoverLostTokenCall) {
    this._call = call;
  }

  get token_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RecoverLostTokenCall__Outputs {
  _call: RecoverLostTokenCall;

  constructor(call: RecoverLostTokenCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class RedeemCall extends ethereum.Call {
  get inputs(): RedeemCall__Inputs {
    return new RedeemCall__Inputs(this);
  }

  get outputs(): RedeemCall__Outputs {
    return new RedeemCall__Outputs(this);
  }
}

export class RedeemCall__Inputs {
  _call: RedeemCall;

  constructor(call: RedeemCall) {
    this._call = call;
  }
}

export class RedeemCall__Outputs {
  _call: RedeemCall;

  constructor(call: RedeemCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class RenounceManagementCall extends ethereum.Call {
  get inputs(): RenounceManagementCall__Inputs {
    return new RenounceManagementCall__Inputs(this);
  }

  get outputs(): RenounceManagementCall__Outputs {
    return new RenounceManagementCall__Outputs(this);
  }
}

export class RenounceManagementCall__Inputs {
  _call: RenounceManagementCall;

  constructor(call: RenounceManagementCall) {
    this._call = call;
  }
}

export class RenounceManagementCall__Outputs {
  _call: RenounceManagementCall;

  constructor(call: RenounceManagementCall) {
    this._call = call;
  }
}

export class SetBondTermCall extends ethereum.Call {
  get inputs(): SetBondTermCall__Inputs {
    return new SetBondTermCall__Inputs(this);
  }

  get outputs(): SetBondTermCall__Outputs {
    return new SetBondTermCall__Outputs(this);
  }
}

export class SetBondTermCall__Inputs {
  _call: SetBondTermCall;

  constructor(call: SetBondTermCall) {
    this._call = call;
  }

  get controlVariable_(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get vestingTerm_(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get minPrice_(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get maxPayout_(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get DAOShare_(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }
}

export class SetBondTermCall__Outputs {
  _call: SetBondTermCall;

  constructor(call: SetBondTermCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}
