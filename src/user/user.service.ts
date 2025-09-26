import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalAuthUserDto } from 'src/auth/dto/local-auth-user.dto';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { ActiveStatusEnum } from 'src/common/enums/active-status.enum';
import { CryptoUtil } from 'src/common/utils/crypto.util';
import { UserFilterUtil } from 'src/common/utils/user-filter.util';
import { Repository } from 'typeorm';
import { UserReponseDto } from './dto/user-response.dto';
import { UserEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly crypto: CryptoUtil,
    private readonly userFilterUtil: UserFilterUtil,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(registerUserDto: RegisterUserDto | any): Promise<UserEntity> {
    const isEmailDuplicate = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    });

    if (isEmailDuplicate) {
      throw new BadRequestException('Email already exist!');
    }

    const isPhoneDuplicate = await this.userRepository.findOne({
      where: { phone: registerUserDto.phone },
    });

    if (isPhoneDuplicate) {
      throw new BadRequestException('Phone number already exists!');
    }

    registerUserDto.password = await this.crypto.hashPassword(
      registerUserDto.password,
    );

    const verificationToken = this.generateVerificationToken();

    const refreshToken = (Math.random() * 0xfffff * 1000000).toString(16);
    const userEntity = {
      ...registerUserDto,
      verification_token: verificationToken,
      is_active: registerUserDto.is_active || ActiveStatusEnum.ACTIVE,
      refresh_token: refreshToken,
      is_verified: registerUserDto.is_verified || false,
      created_at: new Date(),
    };

    const user = await this.userRepository.save(userEntity);
    delete user.password;
    return user;
  }

  generateVerificationToken(): string {
    const timestamp = new Date().getTime().toString(16).slice(-8);
    const randomToken = (Math.random() * 0xfffff * 1000000)
      .toString(16)
      .slice(0, 12);

    const verificationToken = timestamp + randomToken;
    return verificationToken;
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async validateUserEmailPass(
    localUser: LocalAuthUserDto,
    options?: {
      bypassPhoneNumberVerification?: boolean;
    }
  ): Promise<UserReponseDto> {
    // Check if user is trying to login with email or phone
    let user: UserEntity | null;
    
    if (localUser.email && localUser.email.includes('@')) {
      // Login with email
      user = await this.userRepository.findOne({
        where: { email: localUser.email },
      });
    } else if (localUser.phone) {
      // Login with phone
      user = await this.userRepository.findOne({
        where: { phone: localUser.phone },
      });
    } else {
      throw new UnauthorizedException('Invalid login credentials');
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    if (
      !(await this.crypto.comparePassword(localUser.password, user.password))
    ) {
      throw new UnauthorizedException('Login credentials not accepted');
    }

    // Check if user is verified
    if (!user.is_verified && !options?.bypassPhoneNumberVerification) {
      throw new UnauthorizedException('Please verify your phone number before logging in');
    }


    //generate token
    const access_token = this.generateJwtToken(user);

    const refreshToken = (Math.random() * 0xfffff * 1000000).toString(16);
    user.refresh_token = refreshToken;
    await user.save();
    return { ...user, access_token };
  }

  private generateJwtToken(user: UserEntity): string {
    const payload = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      phone: user.phone
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '30m',
    });

    return token;
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { phone },
    });
  }

  async verifyUserByPhone(phone: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { phone },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.is_verified = true;
    
    return await this.userRepository.save(user);
  }
  
  async updatePasswordByPhone(phone: string, newPassword: string) {
    const user = await this.findByPhone(phone);
    if (!user) throw new BadRequestException('User not found');
  
    user.password = await this.crypto.hashPassword(newPassword);
    await this.userRepository.save(user);
  
    return this.userFilterUtil.filterSensitiveFields(user);
  }
  
  async updatePasswordByOldPassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.findById(userId);
  
    const isMatch = await this.crypto.comparePassword(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }
  
    user.password = await this.crypto.hashPassword(newPassword);
    await this.userRepository.save(user);
  
    return this.userFilterUtil.filterSensitiveFields(user);
  }
  
}
