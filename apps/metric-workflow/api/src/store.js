import fs from "node:fs"; import path from "node:path";
export class JsonlObservationStore {
  constructor(filePath){this.filePath=filePath; fs.mkdirSync(path.dirname(filePath),{recursive:true});}
  append(observation){fs.appendFileSync(this.filePath,JSON.stringify(observation)+"\n",{encoding:"utf8",flag:"a"});}
  list(metricId){if(!fs.existsSync(this.filePath))return[]; return fs.readFileSync(this.filePath,"utf8").trim().split("\n").filter(Boolean).map(JSON.parse).filter(x=>!metricId||x.metric_id===metricId);}
}
