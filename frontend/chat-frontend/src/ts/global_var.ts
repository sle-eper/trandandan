let friendId: string = "";
export function setFriendId(id: string) {
    friendId = id;
}
export function getFriendId(): string {
    return friendId;
}

let imInRoom: string = "";
export function setImInRoom(room: string) {
    imInRoom = room;
}
export function getImInRoom(): string {
    return imInRoom;
}

let currentUserId: string = "";
export function setCurrentUserId(id: string) {
    currentUserId = id;
}
export function getCurrentUserId(): string {
    console.log("user id",currentUserId);
    return currentUserId;
}
