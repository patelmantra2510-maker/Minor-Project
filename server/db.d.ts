export function getAllScholarships(): any[];
export function getScholarshipByIdOrSlug(idOrSlug: string): any;
export function insertOrUpdateScholarship(s: any): void;
export function getDatabaseStats(): {
  engine: string;
  databaseFile: string;
  totalScholarships: number;
  status: string;
};
export const db: any;
export const dbPath: string;
