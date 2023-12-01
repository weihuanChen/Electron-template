import crypto from "crypto";
export class ModelBase {
  id: string;
  constructor() {
    // 随机id
    this.id = crypto.randomUUID();
  }
}
