import * as dayjs from 'dayjs';
import { IActOfWorks } from 'app/entities/act-of-works/act-of-works.model';
import { ICarBrand } from 'app/entities/car-brand/car-brand.model';

export interface IClientCar {
  id?: number;
  brande?: string | null;
  win?: string | null;
  dateReceiving?: dayjs.Dayjs | null;
  actOfWorks?: IActOfWorks[] | null;
  carBrand?: ICarBrand | null;
}

export class ClientCar implements IClientCar {
  constructor(
    public id?: number,
    public brande?: string | null,
    public win?: string | null,
    public dateReceiving?: dayjs.Dayjs | null,
    public actOfWorks?: IActOfWorks[] | null,
    public carBrand?: ICarBrand | null
  ) {}
}

export function getClientCarIdentifier(clientCar: IClientCar): number | undefined {
  return clientCar.id;
}
