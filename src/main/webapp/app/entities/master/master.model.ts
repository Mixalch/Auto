import * as dayjs from 'dayjs';
import { IActOfWorks } from 'app/entities/act-of-works/act-of-works.model';

export interface IMaster {
  id?: number;
  name?: string | null;
  date?: dayjs.Dayjs | null;
  actOfWorks?: IActOfWorks[] | null;
}

export class Master implements IMaster {
  constructor(
    public id?: number,
    public name?: string | null,
    public date?: dayjs.Dayjs | null,
    public actOfWorks?: IActOfWorks[] | null
  ) {}
}

export function getMasterIdentifier(master: IMaster): number | undefined {
  return master.id;
}
