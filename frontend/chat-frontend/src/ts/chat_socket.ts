import { friendRequestReceivedHandler, socketNotificationListenerHandler, socketNotificationListenerRejectHandler } from "../../../profile_frontend/src/components/FriendRequest";
import { friendRequestCancelledHandler } from "../../../profile_frontend/src/components/RequestHandling";
import { getSocketInstance } from "../../../socket_manager/socket";
import { liveHandler ,  receiveMessageHandler,allowMsgHandler,blockOrAcceptedHandler,messages_batchHandler, messages_old_batchHandler, chatErrorHandler ,request_to_playHandler, not_agreeHandler, msg_notificationHandler, user_onlineHandler, user_offlineHandler } from "./chat_handlers"

export function socketListener() {
  const socket = getSocketInstance();
  if (!socket) return;
  
  // Remove old listeners to prevent duplicates
  socket.off("live");
  socket.off("receive_message");
  socket.off("allowMsg");
  socket.off("blockOrAccepted");
  socket.off("messages_batch");
  socket.off("messages_old_batch");
  
  // Add new listeners
  socket.on("live", liveHandler);
  socket.on("receive_message", receiveMessageHandler);
  socket.on("allowMsg", allowMsgHandler);
  socket.on("blockOrAccepted", blockOrAcceptedHandler);
  socket.on("messages_batch", messages_batchHandler);
  socket.on("messages_old_batch", messages_old_batchHandler);
  socket.on("chat_error", chatErrorHandler);
}

export function socketNotificationListener() {
  const socket = getSocketInstance();
  if (!socket) return;
  console.log("############################Setting up notification socket listeners####################");
  

  // Remove old listeners to prevent duplicates
  socket.off("user_online");
  socket.off("user_offline");
  socket.off("not_agree");
  socket.off("msg_notification");
  socket.off("request_to_play");

  socket.off("friendRequestAccepted");
  socket.off("friendRequestCancelled");
  socket.off("friendRequestReceived");
  socket.off("friendRequestRejected");

  // Add new listeners
  socket.on("user_online", user_onlineHandler);
  socket.on("user_offline", user_offlineHandler);
  socket.on("not_agree", not_agreeHandler);
  socket.on("msg_notification", msg_notificationHandler);
  socket.on("request_to_play", request_to_playHandler);

  // friend request handlers are in RequestHandling.ts
  socket.on("friendRequestRejected", socketNotificationListenerRejectHandler)
  socket.on("friendRequestAccepted", socketNotificationListenerHandler)
  socket.on("friendRequestCancelled", friendRequestCancelledHandler)
  socket.on("friendRequestReceived", friendRequestReceivedHandler)
}

