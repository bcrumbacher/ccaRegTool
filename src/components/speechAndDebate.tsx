import { FEES, EVENT_CONST } from "./feeVals";

export default function speechAndDebate(events: any) {
  let fee = 0;
  const varsity = events.filter((event: any) => event.type === EVENT_CONST.VARSITY);
  const debate = events.filter((event: any) => event.type === EVENT_CONST.DEBATE);
  return varsity.length >= 1 && debate.length >= 1;

}
