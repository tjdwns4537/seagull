import React, { useRef } from 'react';
import styled from 'styled-components';
import { BiInfoCircle } from 'react-icons/bi';
import { MdVideoCall, MdOutlineInput } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

// import { useRecoilValue } from 'recoil';
// import { UserState } from '../../state/UserAtom';

import ChatRoomUserContainer from '../layout/ChatRoomUserContainer';
import VideoShareForm from '../layout/VideoShareForm';
import LeaveButton from '../ui/VideoShareRoom/LeaveButton';
import webSocketAPI from '../../apis/webSocketAPI';
import Login from './Login';

const VideoShareRoom = () => {
  const { roomlink } = useParams();
  // console.log(roomlink);
  // const value = useRecoilValue(UserState);

  var stompClient = null;
  const username = 'test_username';
  const messageInputRef = useRef();
  // var messageArea = ;

  const entryRoom = async () => {
    // console.log(roomlink);
    await webSocketAPI
      .post(`/room/${roomlink}`, { roomLink: roomlink })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log('방 입장 실패', err);
        window.alert('방 입장 실패!');
      });
  };

  // connect socket
  const connect = (event) => {
    if (username) {
      console.log('소켓연결 시도');

      var socket = new SockJS('http://3.34.161.56:8084/my-chat');
      stompClient = Stomp.over(() => socket);
      stompClient.connect({}, onConnected, onError);
    }
    // event.preventDefault();
  };

  const onConnected = () => {
    stompClient.subscribe('/topic/group', onMessageReceived);
  };

  const onError = (error) => {
    console.log('웹소켓 연결 에러!');
    window.alert('웹소켓 연결 실패!');
  };

  const sendMessage = () => {
    console.log(messageInputRef.current.value);
    var messageInput = messageInputRef.current.value;
    var httpRequest = new XMLHttpRequest();

    var messageContent = messageInput;

    if (messageContent && stompClient) {
      var chatMessage = {
        author: username,
        content: messageInput,
        type: 'CHAT',
      };

      httpRequest.open('POST', 'http://3.34.161.56:8084/kafka/publish', true);
      /* Response Type을 Json으로 사전 정의 */
      httpRequest.responseType = 'json';
      /* 요청 Header에 컨텐츠 타입은 Json으로 사전 정의 */
      httpRequest.setRequestHeader('Content-Type', 'application/json');
      /* 정의된 서버에 Json 형식의 요청 Data를 포함하여 요청을 전송 */
      httpRequest.send(JSON.stringify(chatMessage));

      messageInput = '';
    }
  };

  const onMessageReceived = (payload) => {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if (message.type === 'JOIN') {
      messageElement.classList.add('event-message');
      console.log((message.content = message.author + ' joined!'));
    } else if (message.type === 'LEAVE') {
      messageElement.classList.add('event-message');
      console.log((message.content = message.author + ' left!'));
    } else {
      messageElement.classList.add('chat-message');

      // var avatarElement = document.createElement('i');
      // var avatarText = document.createTextNode(message.author[0]);
      // avatarElement.appendChild(avatarText);
      // avatarElement.style['background-color'] = getAvatarColor(message.author);

      // messageElement.appendChild(avatarElement);

      var usernameElement = document.createElement('span');
      var usernameText = document.createTextNode(message.author);
      usernameElement.appendChild(usernameText);
      messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    // messageArea.appendChild(messageElement);
    // messageArea.scrollTop = messageArea.scrollHeight;
  };

  const entryRoomSocket = () => {
    //로그인 유무 판단 하기

    entryRoom();
    connect();
  };

  entryRoomSocket();

  return (
    <Container>
      <VideoWrap>
        <RoomInfoWrap>
          <InfoIcon>
            <BiInfoCircle size={20} color="#0e72ed" />
          </InfoIcon>
          <RoomName>방 이름 방 이름 방 이름</RoomName>
        </RoomInfoWrap>
        <VideoShareForm />
        <ToolBarWrap>
          <ShareVideoInput>
            <VideoIcon>
              <MdVideoCall size={30} color="#0e72ed" />
            </VideoIcon>
            <VideoUrlInput placeholder="영상 url을 입력하세요"></VideoUrlInput>
            <InputButton>
              <MdOutlineInput size={25} color="grey" />
            </InputButton>
          </ShareVideoInput>
          <LeaveButton />
        </ToolBarWrap>
      </VideoWrap>
      <ChatWrap>
        <ChatRoomUserContainer
          messageInputRef={messageInputRef}
          sendMessage={sendMessage}
        />
      </ChatWrap>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  /* background-color: aliceblue; */
  display: flex;
`;
const VideoWrap = styled.div`
  width: 75%;
  height: 100vh;
  background-color: #f4f4f4;
`;

const ChatWrap = styled.div`
  width: calc(100vw - 75%);
  height: 100%;
  /* border-left: 1px solid gray; */
  box-shadow: -15px 0px 30px -30px gray;
`;

const RoomInfoWrap = styled.div`
  height: 40px;
  width: 100%;
  padding-left: 55px;
  align-items: center;
  box-sizing: border-box;
  font-size: 15px;
  display: flex;
`;

const InfoIcon = styled.div`
  width: 20px;
  height: 20px;
  margin-top: 15px;
  /* background-color: aliceblue; */
`;

const RoomName = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  margin: 15px auto 0 2px;
`;

const VideoChatWrap = styled.div`
  display: flex;
  height: 560px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: aliceblue;
`;

const ToolBarWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 100%;
`;

const ShareVideoInput = styled.div`
  width: 400px;
  height: 50%;
  margin-right: 450px;
  background-color: #ffffff;
  display: flex;
  border-radius: 10px;
`;

const VideoIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
`;

const VideoUrlInput = styled.input`
  width: 320px;
  border: none;
  background-color: transparent;
  outline: none;
`;

const InputButton = styled.div`
  width: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: lightgray; */
  border-radius: 10px;
`;

export default VideoShareRoom;
