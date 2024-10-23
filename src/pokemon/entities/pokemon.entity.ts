import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Esta entidad representa un documento de la colección de Pokemons en la base de datos de mongoDB
@Schema()
export class Pokemon extends Document {
  @Prop({
    unique: true,
    //* 'index: true' crea un índice en la propiedad name que mejora la velocidad de las consultas
    index: true,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
