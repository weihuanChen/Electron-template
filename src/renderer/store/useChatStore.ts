import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { ModelChat } from "../model/ModelChat";
import { useMessageStore } from "./useMessageStore";

// mock
let prepareData = () => {
  const result = [];
  for (let i = 0; i < 100; i++) {
    let model = new ModelChat();

    model.fromName = "聊天对象" + i;
    model.sendTime = "这是此消息的最后一条" + i;
    model.lastMsg = "昨天" 
    model.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`;
    result.push(model);
  }
  return result;
};

export const useChatStore = defineStore("chat", () => {
  let data: Ref<ModelChat[]> = ref(prepareData());
  let selectItem = (item: ModelChat) => {
    if (item.isSelected) return;
    data.value.forEach((v) => (v.isSelected = false));
    item.isSelected = true;
    let messageStore = useMessageStore(); //新增的行
    messageStore.initData(item); //新增的行
  };
  return { data, selectItem };
});
