import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  @IsNotEmpty()
  newQuantity: number;
}
