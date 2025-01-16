import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDate()
  birthdate?: Date;

  @IsOptional()
  @IsNumber()
  emailNotificationsEnabled?: number;
}
