import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { join } from 'path';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      //* 'isGlobal: true' hace que las variables de entorno estén disponibles en toda la aplicación
      isGlobal: true,
      //* 'load' permite cargar un archivo de configuración personalizado. EnvConfiguration es una función que devuelve un
      //* objeto con las variables de entorno.
      load: [EnvConfiguration],
      //* 'validationSchema' permite validar las variables de entorno con Joi
      validationSchema: JoiValidationSchema,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {}
