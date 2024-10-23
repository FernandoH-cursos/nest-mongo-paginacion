import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([
      {
        //* 'name' es el nombre de la colección en la base de datos
        name: Pokemon.name,
        //* 'schema' es el esquema de la colección
        schema: PokemonSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class PokemonModule {}
