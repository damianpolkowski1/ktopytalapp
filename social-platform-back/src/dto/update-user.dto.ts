import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsNumber()
  IsVerified?: number;

  @IsOptional()
  @IsString()
  profilePictureId?: string;
}
