
import { socketInstance } from "../../../socket_manager/socket";
import { liveHandler, receiveMessageHandler, allowMsgHandler, blockOrAcceptedHandler, messages_batchHandler, messages_old_batchHandler, request_to_playHandler, not_agreeHandler, msg_notificationHandler, user_onlineHandler, user_offlineHandler, start_gameHandler } from "./chat_handlers"

export function socketListener() {
  socketInstance()?.on("live", liveHandler);//TODO hadi t9edar thayed mn hena
  socketInstance()?.on("receive_message", receiveMessageHandler);
  socketInstance()?.on("allowMsg", allowMsgHandler);
  socketInstance()?.on("blockOrAccepted", blockOrAcceptedHandler);
  socketInstance()?.on("messages_batch", messages_batchHandler);
  socketInstance()?.on("messages_old_batch", messages_old_batchHandler);
  socketInstance()?.on("user_online", user_onlineHandler);
  socketInstance()?.on("user_offline", user_offlineHandler);

  // socketInstance()?.on("request_to_play", request_to_playHandler);
  // socketInstance()?.on("not_agree", not_agreeHandler);
  // socketInstance()?.on('msg_notification', msg_notificationHandler);

}
export function socketNotificationListener() {
  socketInstance()?.on('msg_notification', msg_notificationHandler);
  socketInstance()?.on("request_to_play", request_to_playHandler);
  socketInstance()?.on("not_agree", not_agreeHandler);
  socketInstance()?.off("start_game");
  socketInstance()?.on("start_game", start_gameHandler);
}
