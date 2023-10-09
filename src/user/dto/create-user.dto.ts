import {
  IsString,
  IsInt,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be more then 6 symbols' })
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  country: string;

  @IsInt()
  age: number;

  @IsString()
  birthday: string;

  @IsOptional()
  ip?: string;

  @IsOptional()
  phone?: string;
}
