import { 
  ApiPropertyOptional, 
  ApiProperty 
} from '@nestjs/swagger';
import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MaxLength, 
  Matches, 
  IsEnum, 
  ValidateIf 
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { RolesEnum } from 'src/common/enums/roles.enum';

export class RegisterUserDto {
  @ApiProperty({ default: 'Sadiquzzaman' })
  @IsNotEmpty({ message: 'First name must be non empty' })
  @IsString({ message: 'First name must be a string' })
  @MaxLength(65, { message: 'First name is maximum 65 characters supported' })
  first_name: string;

  @ApiProperty({ default: 'Shovon' })
  @IsNotEmpty({ message: 'Last name must be non empty' })
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(65, { message: 'Last name is maximum 65 characters supported' })
  last_name: string;

  @ApiPropertyOptional({ default: 'sadikuzzaman1996@gmail.com' })
  @ValidateIf((o) => !o.phone) // required only if phone is missing
  @IsNotEmpty({ message: 'Email must be provided if phone is empty' })
  @IsEmail({}, { message: 'Email must be valid' })
  @MaxLength(100, { message: 'Maximum 100 characters supported' })
  email?: string;

  @ApiPropertyOptional({ default: '01734911480' })
  @ValidateIf((o) => !o.email) // required only if email is missing
  @IsNotEmpty({ message: 'Phone number must be provided if email is empty' })
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^01[3-9]\d{8}$/, { message: 'Phone number must be a valid Bangladeshi mobile number' })
  @MaxLength(15, { message: 'Maximum 15 characters supported' })
  phone?: string;

  @ApiProperty({ default: '12345678' })
  @Exclude({ toPlainOnly: true })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsString({ message: 'Must be a string' })
  @MaxLength(100, { message: 'Maximum 100 characters supported' })
  password: string;

  @ApiPropertyOptional({ enum: RolesEnum }) 
  @IsEnum(RolesEnum, { message: 'Role type must be one of the following: SUPER_ADMIN, ADMIN, TEACHER and STUDENT' })
  @IsNotEmpty({ message: 'Role type must be provided' })
  role: RolesEnum;
}
