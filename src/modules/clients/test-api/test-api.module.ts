import { Module } from '@nestjs/common';
import { HttpClient } from 'src/modules/shared/http-client/http-client';

@Module({
    imports: [],
    providers: [HttpClient],
})
export class TestApiClientModule {}
