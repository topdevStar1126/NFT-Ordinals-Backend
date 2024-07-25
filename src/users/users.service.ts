import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '@/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { UserSchemaModel } from '@/schemas';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { UserDocument } from '@/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchemaModel.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

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
}
