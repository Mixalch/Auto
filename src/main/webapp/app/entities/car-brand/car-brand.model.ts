import { IClientCar } from 'app/entities/client-car/client-car.model';

export interface ICarBrand {
  id?: number;
  brande?: string | null;
  clientCars?: IClientCar[] | null;
}

export class CarBrand implements ICarBrand {
  constructor(public id?: number, public brande?: string | null, public clientCars?: IClientCar[] | null) {}
}

export function getCarBrandIdentifier(carBrand: ICarBrand): number | undefined {
  return carBrand.id;
}
