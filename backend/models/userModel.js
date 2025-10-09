class User {
    constructor(id, firstName, lastName, email) {
        //check for dupe ID, if it duplicates, the object is never created
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}
