import {ApiTags} from '@nestjs/swagger';
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
    DeleteEventType,
} from 'event-type/application/use-cases/delete/delete-event-type';
import {
    FindAllEventType,
} from 'event-type/application/use-cases/find-all/find-all-event-type';
import {
    FindByUuidEventType,
} from 'event-type/application/use-cases/find-by-uuid/find-by-uuid-event-type';
import {
    FindAutocompleteEventType,
} from 'event-type/application/use-cases/find-autocomplete/find-autocomplete-event-type';
import {UUID} from 'shared/types/uuid';
import {PaginationInput} from 'shared/abstracts/paginations/pagination.input';
import {CreateEventTypeInput} from './input/create-event-type.input';
import {UpdateEventTypeInput} from './input/update-event-type.input';
import {CreateEventType} from '../application/use-cases/create/create-event-type';
import {UpdateEventType} from '../application/use-cases/update/update-event-type';
import {
    FindAutocompleteEventTypeOutput,
} from 'event-type/interface/output/find-autocomplete-event-type.output';


@ApiTags('event-types')
@Controller('event-types')
export class EventTypeController {
    constructor(
        private readonly createEventType: CreateEventType,
        private readonly updateEventType: UpdateEventType,
        private readonly deleteEventType: DeleteEventType,
        private readonly findAllEventType: FindAllEventType,
        private readonly findByUuidEventType: FindByUuidEventType,
        private readonly findAutocompleteEventType: FindAutocompleteEventType,
    ) {
    }

    @Post()
    async create(@Body() body: CreateEventTypeInput) {
        return await this.createEventType.execute(body);
    }

    @Put()
    async update(@Body() body: UpdateEventTypeInput) {
        return await this.updateEventType.execute(body);
    }

    @Delete('/:uuid')
    async remove(@Param('uuid') uuid: UUID) {
        await this.deleteEventType.execute({uuid});
    }

    @Get()
    async findAll(
        @Query() pagination: PaginationInput,
        @Query('searchText') searchText?: string,
    ) {
        return await this.findAllEventType.execute({pagination, searchText});
    }

    @Get('/autocomplete')
    async autocomplete(@Query('q') query: string): Promise<FindAutocompleteEventTypeOutput[]> {
        return this.findAutocompleteEventType.execute({query});
    }

    @Get('/:uuid')
    async findOne(@Param('uuid') uuid: UUID) {
        return await this.findByUuidEventType.execute({uuid});
    }
}

