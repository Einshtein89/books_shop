export class Catalog {
  public id: string;
  public name: string;

  constructor(catalog: any) {
    Object.keys(catalog).forEach((key) => this[key] = catalog[key]);
  }
}
