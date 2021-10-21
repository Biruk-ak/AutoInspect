import { IsEmail, IsIn, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @IsOptional()
  @IsIn(['admin', 'inspector', 'garage', 'customer'])
  role?: 'admin' | 'inspector' | 'garage' | 'customer';
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
