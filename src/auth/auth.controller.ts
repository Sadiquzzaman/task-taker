import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthUserDto } from './dto/local-auth-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserPayload } from 'src/common/decorators/user-payload.decorator';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { VerifyOtpDto } from 'src/sms/dto/sms.dto';
import { ForgetPasswordDto, ResetForgottenPasswordDto, ResetPasswordDto } from './dto/password.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const payload = await this.authService.signUp(registerUserDto);
    return { message: 'Registered successfully!', payload };
  }

  @Post('login')
  async login(@Body() localUser: LocalAuthUserDto) {
    const payload = await this.authService.validateLocalStrategyUser(localUser);
    return { message: 'Loged in successful!', payload };
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('verify-auth-guard')
  async test(@UserPayload() jwtPayload: JwtPayloadInterface) {
    return { payload: jwtPayload };
  }

  @Post('verify-register-otp')
  async verifyPhone(@Body() verifyOtpDto: VerifyOtpDto) {
    const payload = await this.authService.verifyPhoneForRegistration(verifyOtpDto);
    return { message: 'Phone verified successfully', payload };
  }

  @Post('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    const payload = await this.authService.forgetPassword(forgetPasswordDto.phone);
    return { message: 'OTP sent to your phone number', payload };
  }

  @Post('reset-forgotten-password')
  async resetForgottenPassword(@Body() dto: ResetForgottenPasswordDto) {
    const payload = await this.authService.resetForgottenPassword(dto);
    return { message: 'Password reset successful', payload };
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(
    @UserPayload() jwtPayload: JwtPayloadInterface,
    @Body() dto: ResetPasswordDto
  ) {
    const payload = await this.authService.resetPassword(jwtPayload.id, dto);
    return { message: 'Password updated successfully', payload };
  }
}
