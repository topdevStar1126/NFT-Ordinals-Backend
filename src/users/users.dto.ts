import { IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  readonly wallet: string;
}
export class UpdateUserDto {
  readonly avatar?: string;
  readonly nickname?: string;
  readonly bio?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  readonly email?: string;

  readonly discord?: string;
  readonly telegram?: string;
}
