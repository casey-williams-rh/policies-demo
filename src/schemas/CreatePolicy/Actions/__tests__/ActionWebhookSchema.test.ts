import { ActionType } from '../../../../types/Policy/Actions';
import { ActionNotificationSchema } from '../ActionNotificationSchema';

describe('src/schemas/CreatePolicy/Actions/ActionNotificationSchema', () => {
    it('should fail when type is undefined', () => {
        expect(ActionNotificationSchema.isValidSync({
            type: undefined
        })).toBeFalsy();
    });

    it('should fail when type is omitted', () => {
        expect(ActionNotificationSchema.isValidSync({})).toBeFalsy();
    });

    it('should fail if type is not an ActionType', () => {
        expect(ActionNotificationSchema.isValidSync({
            type: 'foo'
        })).toBeFalsy();
    });

    it('should succeed if using ActionType.NOTIFICATION', () => {
        expect(ActionNotificationSchema.isValidSync({
            type: ActionType.NOTIFICATION
        })).toBeTruthy();
    });
});
