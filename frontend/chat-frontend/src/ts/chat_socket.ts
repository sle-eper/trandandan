
import { getSocketInstance } from "../../../socket_manager/socket";
import { liveHandler ,  receiveMessageHandler,allowMsgHandler,blockOrAcceptedHandler,messages_batchHandler, messages_old_batchHandler, request_to_playHandler, not_agreeHandler, msg_notificationHandler, user_onlineHandler, user_offlineHandler } from "./chat_handlers"

export function socketListener() {
  getSocketInstance()?.on("live", liveHandler);//TODO hadi t9edar thayed mn hena
  getSocketInstance()?.on("receive_message", receiveMessageHandler);
  getSocketInstance()?.on("allowMsg", allowMsgHandler);
  getSocketInstance()?.on("blockOrAccepted", blockOrAcceptedHandler );
  getSocketInstance()?.on("messages_batch", messages_batchHandler );
  getSocketInstance()?.on("messages_old_batch", messages_old_batchHandler);
  getSocketInstance()?.on("user_online", user_onlineHandler);
  getSocketInstance()?.on("user_offline", user_offlineHandler);
}
export function socketNotificationListener() {
  getSocketInstance()?.on('msg_notification', msg_notificationHandler);
  getSocketInstance()?.on("request_to_play", request_to_playHandler);
  getSocketInstance()?.on("not_agree", not_agreeHandler);
}
