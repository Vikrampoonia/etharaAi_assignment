import { z } from 'zod';
import constants from '../constant/constants.js';
import messages from '../constant/message.js';
import auctionTimeUtils from '../utils/auctionTimeUtils.js';

const createAuctionSchema = z.object({
    rfqName: z.string().trim().min(1, messages.auctionRequiredFields),
    bidStartTime: z.coerce.date(),
    pickupServiceDate: z.coerce.date(),
    initialBidClose: z.coerce.date(),
    forcedBidClose: z.coerce.date(),
}).superRefine((data, ctx) => {
    if (auctionTimeUtils.toDate(data.pickupServiceDate) < auctionTimeUtils.toDate(data.bidStartTime)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.pickupServiceDateMustBeValid,
            path: ['pickupServiceDate'],
        });
    }

    if (auctionTimeUtils.toDate(data.initialBidClose) <= auctionTimeUtils.toDate(data.bidStartTime)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.initialCloseMustBeLaterThanStart,
            path: ['initialBidClose'],
        });
    }

    if (auctionTimeUtils.toDate(data.forcedBidClose) <= auctionTimeUtils.toDate(data.initialBidClose)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.forcedCloseMustBeLater,
            path: ['forcedBidClose'],
        });
    }
});

const auctionConfigSchema = z.object({
    auctionId: z.string().trim().min(1, messages.auctionIdRequired),
    triggerWindowX: z.number().int().positive(messages.invalidTriggerWindow),
    extensionDurationY: z.number().int().positive(messages.invalidExtensionDuration),
    triggerType: z.enum([
        constants.triggerType.bidReceived,
        constants.triggerType.rankChange,
        constants.triggerType.l1Change,
    ], {
        error: () => ({ message: messages.invalidTriggerType }),
    }),
});

const auctionIdParamSchema = z.object({
    auctionId: z.string().trim().min(1, messages.auctionIdRequired),
});

export default {
    createAuctionSchema,
    auctionConfigSchema,
    auctionIdParamSchema,
};
