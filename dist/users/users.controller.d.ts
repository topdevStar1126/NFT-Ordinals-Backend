import { CreateUserDto, UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("../interfaces").User>;
    findOne(req: any, wallet: string): Promise<import("../interfaces").User>;
    update(req: any, updateUserDto: UpdateUserDto): Promise<import("../interfaces").User>;
}
