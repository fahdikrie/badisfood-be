import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCartItemsDto {
  @IsString()
  @IsNotEmpty()
  menuId: string;

  @IsNumber()
  @IsNotEmpty()
  newQuantity: number;
}
