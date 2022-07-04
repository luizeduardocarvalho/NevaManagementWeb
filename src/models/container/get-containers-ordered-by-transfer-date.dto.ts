export class GetContainersOrderedByTransferDateDto {
  id: number;
  name: string;
  transferDate: Date;

  constructor(id: number, name: string, transferDate: Date) {
    this.id = id;
    this.name = name;
    this.transferDate = transferDate;
  }
}
