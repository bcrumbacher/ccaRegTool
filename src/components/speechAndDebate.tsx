import { FEES, EVENT_CONST } from "./feeVals";

export default function speechAndDebate(events: any) {
  let fee = 0;
  const varsity = events.filter((event: any) =>
    event.type === EVENT_CONST.VARSITY ||
    event.type === EVENT_CONST.JV ||
    event.type === EVENT_CONST.JR
  );
  const debate = events.filter((event: any) => event.type === EVENT_CONST.DEBATE);
  let ret = "";

  if (varsity.length >= 1 && debate.length >= 1) {
    ret = "both";
  } else if (varsity.length >= 1 && debate.length === 0) {
    ret = "ie";
  } else if (varsity.length < 1 && debate.length >= 1) {
    ret = "debate";
  }
  return ret;

}
