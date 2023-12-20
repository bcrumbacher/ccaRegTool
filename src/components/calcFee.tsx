import { FEES, EVENT_CONST } from "./feeVals";

export default function calcFee(events: any) {
  let fee = 0;
  const varsity = events.filter((event: any) => event.type === EVENT_CONST.VARSITY);
  const debate = events.filter((event: any) => event.type === EVENT_CONST.DEBATE);
  const jr = events.filter((event: any) => event.type === EVENT_CONST.JR);
  const jv = events.filter((event: any) => event.type === EVENT_CONST.JV);
  if (varsity.length >= 1) {
    fee += FEES.V_FIRST;
  }
  if (varsity.length >= 2) {
    fee += FEES.V_ADD * (varsity.length - 1);
  }
  if (debate.length > 0) {
    fee += FEES.DEBATE;
  }

  if (jr.length > 0) {
    fee += FEES.JR;
  }

  if (jv.length > 0) {
    fee += FEES.JV;
  }
  return fee;
}
