import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '@/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { UserSchemaModel } from '@/schemas';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { UserDocument } from '@/schemas/user.schema';
import nodemailer from 'nodemailer';
import crypto from 'crypto'

@Injectable()
export class UsersService {
  private readonly transporter;
  private verificationCodes: Record<string, string> = {};
  constructor(
    @InjectModel(UserSchemaModel.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    // this.transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: 'your-email@gmail.com',
    //     pass: 'your-email-password',
    //   },
    // });
   }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModel.create({
      wallet: createUserDto.wallet.toLowerCase(),
      createdAt: new Date(),
    });
    return user as User;
  }

  async findOne(address: string | undefined, wallet: string): Promise<User> {
    const user = await this.userModel
      .findOne({
        wallet: wallet,
      })
      .exec();
    if (!user)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (address == wallet) return user as User;
    else
      return {
        wallet: user.wallet,
        nickname: user.nickname,
        avatar: user.avatar,
      } as User;
  }

  async update(wallet: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      {
        wallet: wallet,
      },
      { ...updateUserDto },
    );
    return user as User;
  }

  async sendVerificationEmail(email: string): Promise<void> {
    const verificationCode = crypto.randomBytes(4).toString('hex');
    this.verificationCodes[email] = verificationCode;

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Email Verification Code',
      text: `Your verification code is: ${verificationCode}`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  verifyCode(email: string, code: string): boolean {
    if (this.verificationCodes[email] === code) {
      delete this.verificationCodes[email]; // Remove the code after successful verification
      return true;
    }
    return false;
  }
}
