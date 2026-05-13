import { z } from 'zod';
import messages from '../constant/message.js';

const amountField = z.coerce.number().nonnegative(messages.bidRequiredFields);

const submitBidSchema = z.object({
    auctionId: z.string().trim().min(1, messages.bidRequiredFields),
    carrierName: z.string().trim().min(1, messages.bidRequiredFields),
    freightCharges: amountField,
    originCharges: amountField,
    destinationCharges: amountField,
    transitTime: z.string().trim().min(1, messages.bidRequiredFields),
    quoteValidity: z.coerce.date(),
});

const auctionBidParamSchema = z.object({
    auctionId: z.string().trim().min(1, messages.auctionIdRequired),
});

export default {
    submitBidSchema,
    auctionBidParamSchema,
};
