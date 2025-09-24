import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from 'src/user/user.service';
import { SmsService } from 'src/sms/sms.service';
import { LocalAuthUserDto } from './dto/local-auth-user.dto';
import { UserReponseDto } from 'src/user/dto/user-response.dto';
import { VerifyOtpDto } from 'src/sms/dto/sms.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly smsService: SmsService,
  ) {}
  
  async signUp(registerUserDto: RegisterUserDto) {
    if(registerUserDto?.phone){
      const smsResult = await this.smsService.sendOtp(registerUserDto.phone);
  
      console.log({smsResult});
      
      
      if (!smsResult.success) {
        throw new Error(`Failed to send OTP: ${smsResult.message}`);
      }
    }

    await this.userService.create(registerUserDto);

    return {
      success: true,
      message: 'Registration successful. Please verify your phone number with the OTP sent.',
      data: {
        phone: registerUserDto.phone,
        otpSent: true,
      },
    };
  }

  async validateLocalStrategyUser(
    localUser: LocalAuthUserDto,
  ): Promise<UserReponseDto> {
    return await this.userService.validateUserEmailPass(localUser);
  }

  async verifyPhoneForRegistration(verifyOtpDto: VerifyOtpDto) {
    const phone = verifyOtpDto.phone;

    const user = await this.userService.findByPhone(phone);
    
    if (!user) {
      throw new BadRequestException('No user found with this phone number');
    }

    // Verify OTP
    const verifyResult = await this.smsService.verifyOtp(phone, verifyOtpDto.otp);
    
    if (!verifyResult.success) {
      throw new BadRequestException(verifyResult.message);
    }

    // Update user as verified
    await this.userService.verifyUserByPhone(phone);

    return {
      success: true,
      message: 'Phone verified successfully. You can now login.',
      data: {
        phone: phone,
        phoneVerified: true,
      },
    };
  }
}
