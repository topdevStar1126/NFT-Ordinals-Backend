import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Operator } from '@/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { OperatorSchemaModel } from '@/schemas';
import { OperatorDto } from './operator.dto';
import { OperatorDocument } from '@/schemas/operator.schema';
import * as bcrypt from 'bcrypt';
import { ResultData } from '@/utils/result';

@Injectable()
export class OperatorService {
  constructor(
    @InjectModel(OperatorSchemaModel.name)
    private readonly operatorModel: Model<OperatorDocument>,
  ) {
    this.initializeAdminOperator();
  }


  /**
   * admin用户初始化
   */
  async initializeAdminOperator() {
    const {
      INITIAL_OPERATOR_USERNAME: username = 'admin',
      INITIAL_OPERATOR_PASSWORD: password = 'admin123',
      INITIAL_OPERATOR_EMAIL: email = 'admin@example.com'
    } = process.env;

    if (!username || !password || !email) return;

    const existingUser = await this.operatorModel.findOne({ username });
    const existingEmailUser = await this.operatorModel.findOne({ email });

    // 如果电子邮件已被使用且不是当前用户，则返回
    if (existingEmailUser && (!existingUser || existingEmailUser.username !== username)) {
      console.error(`Email ${email} is already in use.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const currentDate = new Date();

    const operatorData = {
      username,
      password: hashedPassword,
      email,
      createdAt: currentDate
    };

    if (existingUser) {
      // 更新现有用户信息
      Object.assign(existingUser, operatorData);
      await existingUser.save();
    } else {
      // 创建新用户
      const newOperator = new this.operatorModel(operatorData);
      await newOperator.save();
    }
  }



  async findPaginated(filter: any,
                      page: number,
                      limit: number): Promise<{ data: Operator[], total: number }> {
    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.operatorModel.find(filter).skip(offset).limit(limit).exec(),
      this.operatorModel.countDocuments(filter).exec(),
    ]);
    return { data, total };
  }

  async createOperator(operatorDto: OperatorDto): Promise<Operator> {
    const operator = await this.operatorModel.create({
      username: operatorDto.username,
      password: operatorDto.password,
      nickname: operatorDto.nickname,
      email: operatorDto.email,
      createdAt: new Date(),
    });
    return operator as Operator;
  }

  async findOneOperatorName(username: string): Promise<Operator> {
    const operator = await this.operatorModel.findOne({
      username: username,
    }).exec();
    if (!operator)
      throw new HttpException(ResultData.fail(500, '用户不存在!'), HttpStatus.OK);
    return {
      id: operator.id,
      username: operator.username,
      email: operator.email,
      password: operator.password,
    } as Operator;
  }

  async findById(id: String): Promise<Operator> {
    return await this.operatorModel.findOne({ _id: id }).exec();
  }

  async updateOperator(operatorDto: OperatorDto): Promise<Operator> {
    const operator = await this.findById(operatorDto._id);
    if (!operator) {
      throw new HttpException(ResultData.fail(500, '用户不存在!'), HttpStatus.OK);
    }
    operator.nickname = operatorDto.nickname;
    operator.email = operatorDto.email;
    return await this.operatorModel.findByIdAndUpdate(operatorDto._id, operator) as Operator;
  }

  async updatePwd(operatorDto: OperatorDto): Promise<Operator> {
    const operator = await this.findById(operatorDto._id);
    if (!operator) {
      throw new HttpException(ResultData.fail(500, '用户不存在!'), HttpStatus.OK);
    }
    if (await bcrypt.compare(operatorDto.old_password, operator.password)) {
      operator.password = await bcrypt.hash(operatorDto.new_password, 10);
      return await this.operatorModel.findByIdAndUpdate(operatorDto._id, operator) as Operator;
    } else {
      throw new HttpException(ResultData.fail(500, '原密码错误!'), HttpStatus.OK);
    }
  }
}
