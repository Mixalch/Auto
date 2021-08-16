import { IClientCar } from 'app/entities/client-car/client-car.model';
import { IMaster } from 'app/entities/master/master.model';

export interface IActOfWorks {
  id?: number;
  name?: string | null;
  win?: string | null;
  problev?: string | null;
  clientCar?: IClientCar | null;
  master?: IMaster | null;
}

export class ActOfWorks implements IActOfWorks {
  constructor(
    public id?: number,
    public name?: string | null,
    public win?: string | null,
    public problev?: string | null,
    public clientCar?: IClientCar | null,
    public master?: IMaster | null
  ) {}
}

export function getActOfWorksIdentifier(actOfWorks: IActOfWorks): number | undefined {
  return actOfWorks.id;
}
