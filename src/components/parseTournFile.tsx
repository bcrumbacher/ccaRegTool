import _ from "lodash";
import { EVENT_CONST } from "./feeVals";
import calcFee from "./calcFee";
import speechAndDebate from "./speechAndDebate";
export default async function parseFile(file: any, isSeperate: boolean, debatePoolName: string, iePoolName: string) {
  const fileReader: any = new FileReader();
  fileReader.readAsText(file, "UTF-8");
  var res;
  let jsonData: any;
  await new Promise<void>((resolve) => (fileReader.onload = () => resolve()));
  jsonData = JSON.parse(fileReader.result);

  const debatePool = jsonData.categories[0].judge_pools.find((pool: any) => pool.name === debatePoolName);
  const iePool = jsonData.categories[0].judge_pools.find((pool: any) => pool.name === iePoolName);
  let clubs = jsonData.schools.map(function (club: any) {
    const uniqueFamilies = _.groupBy(club.students, (student: any) => student.last);
    const families = Object.entries(uniqueFamilies).map((famArray: any) => {
      return {
        name: famArray[0],
        students: famArray[1],
      };
    });

    return {
      name: club.name,
      families: families,
      entries: club.entries,
      id: club.id,
    };
  });
  let catMap: any[] = [];
  jsonData.categories.forEach((cat: any) => {
    cat.events.forEach((event: any) => {
      let type: any;
      const name = event.name.toLowerCase().trim();
      if (event.type.toLowerCase().trim() === "debate") {
        type = EVENT_CONST.DEBATE;
      } else if (name.startsWith("jv")) {
        type = EVENT_CONST.JV;
      } else if (name.startsWith("jr")) {
        type = EVENT_CONST.JR;
      } else {
        type = EVENT_CONST.VARSITY;
      }
      catMap.push({ id: event.id, type: type });
  })
  });

  clubs = clubs.map((club: any) => {
    let judges: any[] = [];
    jsonData.categories.forEach((judgeCat: any) => {
      const temp = judgeCat.judges.filter((judge: any) => {
          return judge.school === club.id
      });
      judges = judges.concat(temp);
      }
    );

    judges = judges.map((judge: any) => {
      const inDebate = debatePool && debatePool.judges.includes(parseInt(judge.id));
      const inIE = iePool && iePool.judges.includes(parseInt(judge.id));
      return {
        ...judge,
        inDebate,
        inIE,
      }
    })
    const c = club.families.map((family: any) => {
      let familyFee = 0;
      let familyStudents = family.students.length;
      let seperate = false;
      let famIE = 0;
      let famDebate = 0;
      const f = family.students.map((student: any) => {
        const entries = club.entries.filter(
          (entry: any) => entry.students.includes(student.id) && entry.active === 1
        );
        const events = entries.map((ent: any) => {
          const fromEventList = catMap.find((cat: any) => cat.id === ent.event);
          return fromEventList;
        });
        if (true) {
          let studentEvents = speechAndDebate(events);
          if (studentEvents === "both") {
            famIE += 1;
            famDebate += 1;
          } else if (studentEvents === "ie") {
            famIE += 1;
          } else if (studentEvents === "debate") {
            famDebate += 1;
          }
        }
        if (famIE >= 2) {
          famIE = 2;
        }
        if (famDebate >= 2) {
          famDebate = 2;
        }
        let fee = calcFee(events);
        familyFee += fee;
        return {
          ...student,
          events: events,
          fee: fee,
        };
      });
      let judgeReq = 0;
      let regIE = 0;
      let regDebate = 0;
      const famJudges = judges.filter((judge: any) => {
        return judge.last === family.name;
      });

      famJudges.forEach((judge: any) => {
        if (judge.inIE) {
          regIE += 1;
        }
        if (judge.inDebate) {
          regDebate += 1;
        }
      });
      const famJudgeMap = famJudges.map((famJudge: any) => `${famJudge.first} ${famJudge.last}`);


      return  {
        ...family,
        students: f,
        fee: familyFee,
        judgeReq: judgeReq,
        judgeTotal: famJudges.length,
        judges: famJudgeMap.join(", "),
        famIE,
        famDebate,
        regIE,
        regDebate,
      };
    });
    const familyFilter = c.filter((family: any) => family.fee > 0);
    return {
      ...club,
      families: familyFilter,
    };
  });
  res = clubs;
  return res;
}
