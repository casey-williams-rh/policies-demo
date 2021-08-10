import { ActionType } from '../../../../types/Policy/Actions';
import { ActionSchema } from '../ActionSchema';

describe('src/schemas/CreatePolicy/Actions/ActionSchema', () => {
    it('should fail when type is undefined', () => {
        expect(ActionSchema.isValidSync({
            type: undefined
        })).toBeFalsy();
    });

    it('should fail when type is omitted', () => {
        expect(ActionSchema.isValidSync({})).toBeFalsy();
    });

    it('should fail if type is not an ActionType', () => {
        expect(ActionSchema.isValidSync({
            type: 'foo'
        })).toBeFalsy();
    });

    it('should succeed if using valid ActionType', () => {
        expect(ActionSchema.isValidSync({
            type: ActionType.NOTIFICATION
        })).toBeTruthy();
    });
});
