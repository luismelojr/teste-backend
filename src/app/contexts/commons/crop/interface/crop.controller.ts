import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CreateCrop,
} from 'commons/crop/application/use-cases/create/create-crop';
import {
  CreateCropInput,
} from 'commons/crop/interface/input/create-crop.input';
import {
  FindByUuidCrop,
} from 'commons/crop/application/use-cases/find-by-uuid/find-by-uuid-crop';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  FindAllCrop,
} from 'commons/crop/application/use-cases/find-all/find-all-crop';
import {
  DeleteCrop,
} from 'commons/crop/application/use-cases/delete/delete-crop';
import {
  UpdateCrop,
} from 'commons/crop/application/use-cases/update/update-crop';
import {
  UpdateCropInput,
} from 'commons/crop/interface/input/update-crop.input';
import {
  FindAutocompleteCropOutput,
} from 'commons/crop/interface/output/find-autocomplete-crop.output';
import {
  FindAutocompleteCrop,
} from 'commons/crop/application/use-cases/find-autocomplete/find-autocomplete-crop';

@ApiTags('crops')
@Controller('crops')
export class CropController {
  constructor(
    private readonly createCrop: CreateCrop,
    private readonly findCropByUuid: FindByUuidCrop,
    private readonly findCropAll: FindAllCrop,
    private readonly deleteCrop: DeleteCrop,
    private readonly updateCrop: UpdateCrop,
    private readonly findAutocompleteCompany: FindAutocompleteCrop,
  ) {
  }

  @Post()
  async create(@Body() body: CreateCropInput) {
    return await this.createCrop.execute(body);
  }

  @Get(':uuid')
  async findById(@Param('uuid') uuid: UUID) {
    return await this.findCropByUuid.execute({ uuid });
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationInput,
    @Query('searchText') searchText?: string,
  ) {
    return await this.findCropAll.execute({ pagination, searchText });
  }

  @Get('/autocomplete')
  async autocomplete(@Query('q') query: string): Promise<FindAutocompleteCropOutput[]> {
    return this.findAutocompleteCompany.execute({ query });
  }

  @Put()
  async update(@Body() body: UpdateCropInput) {
    return await this.updateCrop.execute(body);
  }

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: UUID) {
    await this.deleteCrop.execute({ uuid });
  }
}
