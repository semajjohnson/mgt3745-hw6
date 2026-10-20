# FEATURES.md

Accountable: Rishika, Specifier. Consulted: Semaj, Reviewer.

Every feature traces to a profile in USERS.md and to the outcome in PROJECT.md. Rows marked (probe) were added or revised after docs/PROBE-001.md.

## Kano Classification

| ID | Feature | Class | Evidence and reasoning |
|---|---|---|---|
| F1 | Accounts | Must-be | Trips, authorship, and following all depend on knowing who each person is. No one asks for accounts, but nothing else works without them. (Profile 1, Profile 2, Profile 3) |
| F2 | Create a trip and invite members | Must-be | The group trip is the core of the app. Without a way to start one and bring friends in, there is no app. (Profile 1) |
| F3 | Add a moment to a trip | Must-be | Members expect to add photos and notes the moment something happens. If capture is slow or unreliable, they go back to texting. (Profile 1, Profile 2) |
| F4 | Trip view with who added what | Must-be | In a shared trip, members expect to see every moment in order and know who added it. Without that, the shared record is unreadable. (Profile 1) |
| F5 | Find it later | Performance | Finding a post later is the measure of success in PROJECT.md. The faster and more precise the search, the more satisfied members are. (Profile 3) |
| F6 | Share a finished trip to the main feed | Attractive | The group trip works fully without sharing, so its absence isn't missed. Groups that want to show off a trip get something extra. (Profile 2) |
| F7 | Follow people and see their shared trips | Attractive | The app is useful to a group without following. For users who want to discover trips from people they trust, it adds a new reason to come back. (Profile 3) |
| F8 | Likes and comments on shared trips | Attractive | On trips shared publicly, they make sharing feel two-way. (Profile 1, Profile 2) |

## EARS Acceptance Criteria

### F1 Accounts (Must-be) - 1,2,3

F1-1. WHEN a person signs up with an email, a username, and a password, the app shall create an account and sign them in. (probe)

F1-2. IF a person signs up with a username that is already taken, THEN the app shall ask for a different one and create no account. 

### F2 Create a trip and invite members (Must-be) - 1

F2-1. WHEN a signed-in person creates a trip with a name, the app shall make them its creator and give them an invite link.

F2-2. IF someone tries to join a trip without a valid invite link, THEN the app shall refuse and show no trip details. 

F2-3. The app shall give each trip one reusable invite link. (probe)

### F3 Add a moment to a trip (Must-be) - 1,2

F3-1. WHEN a member submits a moment with at least one of a photo, note, or place, the app shall add it to the trip, labeled with the member's name. (probe)

F3-2. IF a review fails to save, THEN the app shall tell the member and keep the photo, note, and location on screen so they can try again.

F3-3. IF a member submits a moment with no photo, note, or place, THEN the app shall refuse and add nothing. (probe)

### F4 Trip view with who added what (Must-be) - 1

F4-1. WHEN a member opens a trip, the app shall show its moments in added order, each with whichever of photo, note, and place it has, and the member who added it. (probe)

F4-2. IF a member tries to delete a moment someone else added, THEN the app shall refuse.

### F5 Find it later (Performance) - 3

F5-1. WHEN a member searches a trip by a word, place, date, or member, the app shall show only the matching moments. 

F5-2. IF a search matches nothing, THEN the app shall say so and keep the search terms on screen to edit.

### F6 Share a finished trip to the main feed (Attractive) -2

F6-1. WHEN the trip's creator shares a trip, the app shall notify every member and show the trip on the main feed.

F6-2. IF a trip has not been shared, THEN the app shall show it only to the trip's members. 

F6-3. WHEN the trip's creator unshares a trip, the app shall make it private again and remove it from the main feed. (probe)

### F7 Follow people and see their shared trips (Attractive) - 3

F7-1. WHEN a person follows another person, the app shall show that person's shared trips in the Following section of their main feed. 

F7-2. IF a followed person's trip has not been shared, THEN the app shall not show it on any follower's feed, only to the trip's members.

F7-3. The app shall show all shared trips on the main feed, with trips from followed people in a separate section. (probe)

### F8 Likes and comments on shared trips (Attractive) - 1,2

F8-1. WHEN a signed-in person likes or comments on a shared trip, the app shall show it to everyone who can see that trip. 

F8-2. IF a trip is unshared, THEN the app shall hide its likes and comments from everyone outside the trip.

## Exclusions
- Editing photos.
- Direct messaging. It does not replace the texting app.
- Connecting to other social media.
- Business owners are stakeholders affected by the app, not users it is built for.
