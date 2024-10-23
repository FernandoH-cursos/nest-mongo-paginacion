import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

import { PaginationDto } from 'src/common/dto/pagination.dto';

import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('DEFAULT_LIMIT');
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);

    throw new InternalServerErrorException(
      `Cant't create pokemon - Check server logs`,
    );
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      //* Inserta en BD mongo
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { offset = 0, limit = this.defaultLimit } = paginationDto;

    const pokemons = await this.pokemonModel
      .find()
      .skip(offset)
      .limit(limit)
      //* Ordenar de forma ascendente por número de pokemon
      .sort({ no: 1 })
      .select('-__v');

    return pokemons;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    //* Validar número
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({
        no: term,
      });
    }

    //* Validar mongoId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    //* Validar nombre
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });
    }

    //* Validar si no se encontró el pokemon
    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or no "${term}" not found`,
      );
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }

    try {
      const pokemon = await this.findOne(term);

      //* Permite actualizar en BD mongo
      await pokemon.updateOne(updatePokemonDto);

      return {
        ...pokemon.toJSON(),
        ...updatePokemonDto,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    //* Permite eliminar en BD mongo por id
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }

    return;
  }
}
