import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonModule } from 'src/pokemon/pokemon.module';
import { SeedService } from './seed.service';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    PokemonModule,
    CommonModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
