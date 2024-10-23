import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any) {
    //* Validar si es un mongo id válido
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is not valid mongo id`);
    }

    return value;
  }
}
