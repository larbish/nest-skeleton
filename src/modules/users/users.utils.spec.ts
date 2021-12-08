import { Test } from '@nestjs/testing';
import { UsersUtils } from './users.utils';

// Follow AAA pattern => assert(act(arrange()));
describe('UsersUtils', () => {
    beforeEach(async () => {
        await Test.createTestingModule({}).compile();
    });

    describe('Concat first name and last name', () => {
        it('Success: return the concatenation', () => {
            // ARRANGE
            const firstName = 'John';
            const lastName = 'Doe';

            // ACT
            const concatenation = UsersUtils.concatNameAndlastName(firstName, lastName);

            // ASSERT
            expect(concatenation).toBe('John Doe');
        });
    });
});
