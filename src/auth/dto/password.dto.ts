import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class ForgetPasswordDto {
  @ApiProperty({ example: '01734911480' })
  @IsNotEmpty()
  @Matches(/^01[3-9]\d{8}$/, { message: 'Phone number must be a valid Bangladeshi mobile number' })
  @MaxLength(15)
  phone: string;
}

export class ResetForgottenPasswordDto {
  @ApiProperty({ example: '01734911480' })
  @IsNotEmpty()
  @Matches(/^01[3-9]\d{8}$/, { message: 'Phone number must be a valid Bangladeshi mobile number' })
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsNotEmpty()
  @MaxLength(100)
  newPassword: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsNotEmpty()
  @MaxLength(100)
  confirmNewPassword: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsNotEmpty()
  @MaxLength(100)
  oldPassword: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsNotEmpty()
  @MaxLength(100)
  newPassword: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsNotEmpty()
  @MaxLength(100)
  confirmNewPassword: string;
}

