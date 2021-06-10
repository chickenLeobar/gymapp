import fs, { unlinkSync } from "fs";

export class UtilFIle {
  static deleteFile(path: string): boolean {
    if (this.existFile(path)) {
      unlinkSync(path);
      return true;
    } else {
      return false;
    }
  }

  static existFile(path: string): boolean {
    return fs.existsSync(path);
  }
}
