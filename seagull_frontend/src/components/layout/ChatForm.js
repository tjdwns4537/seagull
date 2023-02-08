import React from 'react';
import styled from 'styled-components';
import { FiSend } from 'react-icons/fi';
import ReceiveUnitChat from '../ui/VideoShareRoom/ReceiveUnitChat';
import SendUnitChat from '../ui/VideoShareRoom/SendUnitChat';

const ChatForm = ({ messageInputRef, sendMessage }) => {
  return (
    <Wrap>
      <Title>채팅</Title>
      <Content>
        <ReceiveUnitChat />
        <ReceiveUnitChat />
        <ReceiveUnitChat />
        <SendUnitChat />
        <SendUnitChat />
        <SendUnitChat />
        <SendUnitChat />
        <SendUnitChat />
        <SendUnitChat />
      </Content>
      <InputWrap>
        <InputBox>
          <Input ref={messageInputRef} placeholder="메시지를 입력하세요" />
          <SendButton onClick={sendMessage}>
            <FiSend size={21} />
          </SendButton>
        </InputBox>
      </InputWrap>
    </Wrap>
  );
};

const Wrap = styled.div``;

const Title = styled.div`
  display: flex;
  padding-left: 18px;
  /* justify-content: flex-start; */
  align-items: center;
  height: 50px;
  width: 100%;
  /* background-color: aliceblue; */
  box-sizing: border-box;
  font-size: 20px;
`;
const Content = styled.div`
  width: 100%;
  height: calc(100vh - 170px);
  padding: 5px 20px;
  box-sizing: border-box;
  overflow: scroll;
`;
const InputWrap = styled.div`
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid lightgrey;
`;

const InputBox = styled.div`
  /* background-color: aliceblue; */
  width: 95%;
  height: 50px;
  border-radius: 23px;
  padding: 5px 15px;
  box-sizing: border-box;
  display: flex;
  border: 1.5px solid #f4f4f4;
`;

const Input = styled.input`
  width: 85%;
  height: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  margin-right: 10px;
  box-sizing: border-box;
`;

const SendButton = styled.div`
  width: 13%;
  height: 100%;
  border-radius: 25px;
  background-color: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default ChatForm;
