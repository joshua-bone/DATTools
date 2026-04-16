export {
  filterWallsBankRecords,
  findWallsBankRecord,
  pickRandomWallsBankRecords,
} from "@/src/walls-core/bank";
export type { FilterWallsBankOptions, WallsBankRecord } from "@/src/walls-core/bank";
import {
  buildWallsBankRecords,
  parseWallsBank,
  type WallsBankJson,
  type WallsBankOccurrence,
  type WallsBankRecord,
} from "@/src/walls-core/bank";

type RuntimeImportMeta = ImportMeta & {
  env?: {
    BASE_URL?: string;
  };
};

const baseUrl = (import.meta as RuntimeImportMeta).env?.BASE_URL ?? "/";

export const WALLS_BANK_URL = `${baseUrl}walls/walls-bank.json`;
const BLOCKLISTED_SET_NAMES = new Set<string>(["Bad_Apple"]);

export type LoadedWallsBank = Readonly<{
  bank: WallsBankJson;
  records: ReadonlyArray<WallsBankRecord>;
}>;

function isBlocklistedOccurrence(entry: WallsBankOccurrence): boolean {
  return BLOCKLISTED_SET_NAMES.has(entry.setName);
}

export async function loadWallsBank(signal?: AbortSignal): Promise<LoadedWallsBank> {
  const requestInit: RequestInit = {};
  if (signal) requestInit.signal = signal;

  const response = await fetch(WALLS_BANK_URL, requestInit);
  if (!response.ok) {
    throw new Error(
      `Failed to load walls bank: ${response.status} ${response.statusText}. Run npm run build_walls if the asset is missing.`,
    );
  }

  const bank = parseWallsBank((await response.json()) as unknown);
  return {
    bank,
    records: buildWallsBankRecords(bank, {
      includeOccurrence: (entry) => !isBlocklistedOccurrence(entry),
    }),
  };
}
