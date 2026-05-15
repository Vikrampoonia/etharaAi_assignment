class Constants {
    constructor() {
        this.httpStatus = {
            success: 200,
            created: 201,
            accepted: 202,
            unauthorized: 401,
            forbidden: 403,
            serverError: 500,
            noContent: 204,
            notFound: 404,
            badRequest: 400,
            conflict: 409,
            notAllowed: 405,
            serviceUnavailable: 503,
            modified: 302,
        };
        
        this.auctionStatus = {
            active: "Active",
            closed: "Closed",
            forceClosed: "Force Closed",
        };

        this.triggerType = {
            bidReceived: "Bid_Received",
            rankChange: "Rank_Change",
            l1Change: "L1_Change",
        };

        this.activityActionType = {
            bidSubmitted: "Bid_Submitted",
            timeExtension: "Time_Extension",
        };
    }
};

export default new Constants();