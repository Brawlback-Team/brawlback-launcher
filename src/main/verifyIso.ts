import { IsoValidity } from "@common/types";
import crypto from "crypto";
import fs from "fs";
import { fileExists } from "utils/fileExists";
interface IsoHashInfo {
  valid: IsoValidity;
  name: string;
}

const isoHashes = new Map<string, IsoHashInfo>();

// Valid Brawl ISOs

isoHashes.set("0e95949ac585f357e79fcd34b20670b5dca97ac2", {
  valid: IsoValidity.VALID,
  name: "unknown Brawl copy sha1 hash",
});
isoHashes.set("d18726e6dfdc8bdbdad540b561051087", {
  valid: IsoValidity.VALID,
  name: "Brawl 1.01 NTSC",
});

isoHashes.set("d8560b021835c9234c28be7ff9bcaaeb", {
  valid: IsoValidity.VALID,
  name: "Brawl 1.01 alt #1 also good",
});

isoHashes.set("5052e2e15f22772ab6ce4fd078221e96", {
  valid: IsoValidity.VALID,
  name: "Brawl 1.01 alt #2 also good",
});

isoHashes.set("52ce7160ced2505ad5e397477d0ea4fe", {
  valid: IsoValidity.VALID,
  name: "Brawl alt 3 MD5 hash",
});

isoHashes.set("9f677c78eacb7e9b8617ab358082be32", {
  valid: IsoValidity.VALID,
  name: "Brawl alt 4 MD5 hash",
});

isoHashes.set("1c4d6175e3cbb2614bd805d32aea7311", {
  valid: IsoValidity.VALID,
  name: "Brawl alt 5 MD5 hash",
});

// Known Invalid ISOs

isoHashes.set("0e63d4223b01d9aba596259dc155a174", {
  valid: IsoValidity.INVALID,
  name: "Melee NTSC-U 1.02 md5",
});

isoHashes.set("863dc6e0c5ddc1c086895e922ce925e3", {
  valid: IsoValidity.INVALID,
  name: "3.6 Project M Full Netplay iso md5",
});

export async function verifyIsoMD5(isoPath: string): Promise<IsoValidity> {
  const exists = await fileExists(isoPath);
  if (!exists) {
    return Promise.reject(`Error verifying ISO: File ${isoPath} does not exist`);
  }

  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("md5");
    const input = fs.createReadStream(isoPath);
    //const checkedRevision = false;

    input.on("error", (err) => {
      reject(`Error reading ISO file ${isoPath}: ${err}`);
    });

    input.on("readable", () => {
      const data: Buffer = input.read();

      if (data) {
        /* This seems to be specific to the sha1 hashing algorithm that slippi uses:
        The idea seems to read in an integer from the first 8 bytes of data. 
        That's the revision, and if it is not equal to the number 2, then it's invalid.
        But we don't need this so we throw it out. 
        There's also a check for .gcz filetype which is presumably to quickly snip wrong filetypes

        if (!checkedRevision && !isoPath.endsWith(".gcz")) {
          checkedRevision = true;
          const revision = data.readInt8(7);
          if (revision !== 2) {
            resolve(IsoValidity.INVALID);
            return;
          }
        }
        */

        hash.update(data);
        return;
      }

      // Reading complete, check hash
      const resultHash = hash.digest("hex");
      const isoInfo = isoHashes.get(resultHash);
      if (isoInfo) {
        resolve(isoInfo.valid);
      } else {
        resolve(IsoValidity.UNKNOWN);
      }
    });
  });
}

// this is the legacy slippi function to verify the iso, it uses the sha1 hash and has some logic to check validity
export async function _verifyIsoSHA1(isoPath: string): Promise<IsoValidity> {
  const exists = await fileExists(isoPath);
  if (!exists) {
    return Promise.reject(`Error verifying ISO: File ${isoPath} does not exist`);
  }

  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha1");
    const input = fs.createReadStream(isoPath);
    let checkedRevision = false;

    input.on("error", (err) => {
      reject(`Error reading ISO file ${isoPath}: ${err}`);
    });

    input.on("readable", () => {
      const data: Buffer = input.read();
      if (data) {
        if (!checkedRevision && !isoPath.endsWith(".gcz")) {
          checkedRevision = true;
          const revision = data.readInt8(7);
          if (revision !== 2) {
            resolve(IsoValidity.INVALID);
            return;
          }
        }

        hash.update(data);
        return;
      }

      // Reading complete, check hash
      const resultHash = hash.digest("hex");
      const isoInfo = isoHashes.get(resultHash);
      if (isoInfo) {
        resolve(isoInfo.valid);
      } else {
        resolve(IsoValidity.UNKNOWN);
      }
    });
  });
}
