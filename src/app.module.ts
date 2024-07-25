import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { CollectionsModule } from '@/collections/collections.module';
import { UploadsModule } from '@/uploads/uploads.module';
import { TokensModule } from '@/tokens/tokens.module';
// import { InscriptionModule } from '@/inscription/inscription.module';
import { AccountsModule } from '@/accounts/accounts.module';
import { TransfersModule } from '@/transfers/transfers.module';

//Enthusiast K.G at 01:32 AM 15/13/2024 in JST
import { Brc20TokensModule } from './brc20Tokens/brc20Tokens.module'; // Import the Brc20TokensModule
import { InscBrc20TokensModule } from './inscribing/inscBrc20Tokens.module'; // Import the Brc20TokensModule
import { UpdateServerDataModule } from './updateServerData/updateServerData.module';

//Enthusiast KG. at 02:30 AM 
import { createListingsModule } from './createListings/createListings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CollectionsModule,
    UploadsModule,
    TokensModule,
    // InscriptionModule,
    AccountsModule,
    TransfersModule,

    //Enthusiast K.G
    Brc20TokensModule,
    InscBrc20TokensModule,

    UpdateServerDataModule,
    createListingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
