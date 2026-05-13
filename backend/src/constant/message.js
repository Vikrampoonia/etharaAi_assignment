class Message {
    constructor() {
        this.phoneNumberAndPasswordRequired = "Phone number and password are required";
        this.invalidPhoneNumberOrPassword = "Invalid phone number or password";
        this.loginSuccessful = "Login successful";
        this.unableToLogin = "Unable to login";

        this.signupRequiredFields = "Name, phone number, password and role are required";
        this.invalidRole = "Role must be Admin or Supplier";
        this.userAlreadyExists = "User already exists with this phone number";
        this.signupSuccessful = "Signup successful";
        this.unableToSignup = "Unable to signup";

        this.logoutSuccessful = "Logout successful";
        this.noTokenProvided = "No token provided";
        this.unableToLogout = "Unable to logout";

        this.auctionRequiredFields = "RFQ name, bid start time, pickup/service date, initial close time and forced close time are required.";
        this.pickupServiceDateMustBeValid = "Pickup/service date must be valid and not earlier than bid start time.";
        this.initialCloseMustBeLaterThanStart = "Initial close time must be later than bid start time.";
        this.forcedCloseMustBeLater = "Forced close time must be later than initial close time.";
        this.auctionCreatedSuccessfully = "Auction created successfully.";
        this.unableToCreateAuction = "Unable to create auction.";

        this.auctionIdRequired = "Auction id is required.";
        this.invalidTriggerWindow = "Trigger window must be greater than 0.";
        this.invalidExtensionDuration = "Extension duration must be greater than 0.";
        this.invalidTriggerType = "Trigger type must be Bid_Received, Rank_Change or L1_Change.";
        this.auctionConfigAddedSuccessfully = "Auction configuration added successfully.";
        this.unableToAddAuctionConfiguration = "Unable to add auction configuration.";

        this.auctionsRetrievedSuccessfully = "Auctions retrieved successfully.";
        this.unableToFetchAuctions = "Unable to fetch auctions.";

        this.auctionNotFound = "Auction not found.";
        this.auctionDetailsRetrievedSuccessfully = "Auction details retrieved successfully.";
        this.unableToFetchAuctionDetails = "Unable to fetch auction details.";

        this.bidRequiredFields = "Auction id, carrier name, charges, transit time and quote validity are required.";
        this.bidSubmittedSuccessfully = "Bid submitted successfully.";
        this.bidQueuedSuccessfully = "Bid queued successfully for processing.";
        this.unableToSubmitBid = "Unable to submit bid.";
        this.bidHistoryRetrievedSuccessfully = "Bid history retrieved successfully.";
        this.unableToFetchBidHistory = "Unable to fetch bid history.";
        this.auctionBidsRetrievedSuccessfully = "Auction bids retrieved successfully.";
        this.unableToFetchAuctionBids = "Unable to fetch auction bids.";
        this.auctionNoLongerActive = "This auction is no longer active.";
        this.biddingTimeExpired = "Bidding time has expired.";
        this.bidSubmittedActivity = "Bid submitted";
        this.timeExtensionActivity = "Time extension";
        this.bidExtensionReason = "Auction extended due to bid within trigger window.";
        this.rankChangeExtensionReason = "Auction extended due to supplier rank change within trigger window.";
        this.l1ChangeExtensionReason = "Auction extended due to L1 change within trigger window.";

        this.authorizationTokenRequired = "Authorization token is required";
        this.jwtSecretNotConfigured = "JWT_SECRET is not configured";
        this.sessionEnded = "This session has ended. Please log in again.";
        this.unauthorized = "Unauthorized";
        this.forbidden = "Forbidden";
        this.invalidOrExpiredToken = "Invalid or expired token";
    }
}

export default new Message();