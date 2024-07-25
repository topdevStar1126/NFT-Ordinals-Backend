import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { OperatorDto } from './operator.dto';
import { OperatorService } from './operator.service';
import { JwtAuthGuard } from '@/auth/auth.guard';

@Controller('operator')
export class OperatorController {
  constructor(private readonly operatorService: OperatorService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createOperator(@Body() operatorDto: OperatorDto) {
    return this.operatorService.createOperator(operatorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateOperator(@Body() operatorDto: OperatorDto) {
    return this.operatorService.updateOperator(operatorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('pwd')
  async updatePwd(@Body() operatorDto: OperatorDto) {
    return this.operatorService.updatePwd(operatorDto);
  }


  @UseGuards(JwtAuthGuard)
  @Post('list')
  async list(@Query('page') page: number = 1,
             @Query('limit') limit: number = 10,
             @Query('username') username?: string,
             @Query('email') email?: string) {

    const filter: any = {};
    if (username) {
      filter.username = new RegExp(username, 'i'); // 忽略大小写的模糊搜索
    }
    if (email) {
      filter.email = new RegExp(email, 'i'); // 忽略大小写的模糊搜索
    }
    return this.operatorService.findPaginated(filter, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getInfo')
  async getInfo(@Req() req) {
    const operator = await this.operatorService.findById(req.user.sub); // 假设从请求中获取用户 ID，并通过服务获取用户信息
    return {
      id: operator.id,
      username: operator.username,
      nickname: operator.nickname,
      email: operator.email,
      createdAt: operator.createdAt,
    };
  }


}
