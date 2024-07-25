export class CreateCollectionDto {
  chainId: number;
  address: string;
  logo: string;
  banner: string;
  description: string;
  classification: [string];
}
export class UpdateCollectionDto {
  logo: string;
  banner: string;
  description: string;
  classification: [string];
}
