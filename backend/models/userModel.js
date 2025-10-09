class User {
    constructor(userId, firstName, lastName) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.eventList = [];
    }

    addEvent(eventId) {
        this.eventList.push(eventId);
    }
}

//just tests really incomplete, do NOT present to the TA