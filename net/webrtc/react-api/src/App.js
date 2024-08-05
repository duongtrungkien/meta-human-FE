import './App.css';
import { useEffect, useState } from 'react';
import { fromDefaultMicrophone } from "./utils/asr.js"
import { sendUserMessage, sendAIMessage, 
        informHost, changeGesture,
        addStream, removeStream } from "./api/api.js"
import WebFont from 'webfontloader';
import { Container } from "./components/Container.js"
import { Header } from './components/Header.js';
import { Section } from './components/Section.js';
import { ConversationBox } from './components/ConversationBox.js';
import { StartScreen } from './components/StartScreen.js';
import logo from './assets/Elisa_Logo.png';


function initCapture(api) {
  const captureSection = document.getElementById("capture");
  const clientIdElement = captureSection.querySelector(".client-id");

  const listener = {
    connected: function(clientId) { clientIdElement.textContent = clientId; },
    disconnected: function() { clientIdElement.textContent = "none"; }
  };
  api.registerConnectionListener(listener);
}

function initRemoteStreams(api) {
  const listener = {
    producerAdded: function(producer) {
      const producerId = producer.id
      if (!document.getElementById(producerId)) {
        const entryElement = document.getElementById("remote-streams");
        const videoElement = entryElement.getElementsByTagName("video")[0];

        videoElement.addEventListener("playing", () => {
          if (entryElement.classList.contains("has-session")) {
            entryElement.classList.add("streaming");
          }
        });

        const session = api.createConsumerSession(producerId);
        if (session) {
          entryElement._consumerSession = session;

          session.addEventListener("error", (event) => {
            if (entryElement._consumerSession === session) {
              console.error(event.message, event.error);
            }
          });

          session.addEventListener("closed", () => {
            if (entryElement._consumerSession === session) {
              videoElement.pause();
              videoElement.srcObject = null;
              entryElement.classList.remove("has-session", "streaming", "has-remote-control");
              delete entryElement._consumerSession;
            }
          });

          session.addEventListener("streamsChanged", () => {
            if (entryElement._consumerSession === session) {
              const streams = session.streams;
              if (streams.length > 0) {
                videoElement.srcObject = streams[0];
                videoElement.play().catch(() => {});
              }
            }
          });

          session.addEventListener("remoteControllerChanged", () => {
            if (entryElement._consumerSession === session) {
              const remoteController = session.remoteController;
              if (remoteController) {
                entryElement.classList.add("has-remote-control");
                remoteController.attachVideoElement(videoElement);
              } else {
                entryElement.classList.remove("has-remote-control");
              }
            }
          });

          entryElement.classList.add("has-session");
          session.connect();
        }
      }
    },

    producerRemoved: function(producer) {
      const element = document.getElementById(producer.id);
      if (element) {
        if (element._consumerSession) {
          element._consumerSession.close();
        }
        element.remove();
      }
    }
  };

  api.registerProducersListener(listener);
  for (const producer of api.getAvailableProducers()) {
    listener.producerAdded(producer);
  }
}

function App() {
  const [hostData, setHostData] = useState([])
  const [checkinState, setCheckinState] = useState(0)
  const [isSessionStart, setIsSessionStart] = useState(false)
  const [conversation, setConvetsation] = useState([])
  const [language, setLanguage] = useState(["en-US"])
  const [visitorName, setVisitorName] = useState("")

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      event.preventDefault();
      onReset()
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Open Sans']
      }
    });
   }, []);

  useEffect(() => {
    if (isSessionStart) {
      if (typeof window !== "undefined") {
        const gstWebRTCConfig = {
          meta: { name: `WebClient-${Date.now()}` },
          signalingServerUrl: `ws://10.3.9.90:8443`,
        };
        
        const api = new window.GstWebRTCAPI(gstWebRTCConfig);
        initCapture(api);
        initRemoteStreams(api);
      }
    }
  }, [isSessionStart]);

  const handleCheckin = async (text) => {
    let message = {}
    switch(checkinState) {
      case 0:
        message = {
          "en-US": {content: "Awsome! can I have your host email address?", language: language},
          "fi-FI": {content: "Mahtavaa! saanko isäntäsähköpostiosoitteesi?", language: language}
        }
        console.log()
        await sendAIMessage(message[language])
        setCheckinState(1)
        return message[language].content
      case 1:
        await informHost({host_email: text, visitor_name: visitorName})
        message = {
          "en-US": {content: "I'm sending a notification to your host. Great! He or she will come here soon. Do you want to ask me any question about Elisa while waiting?", language: language},
          "fi-FI": {content: "Lähetän ilmoituksen isännällesi. Loistava! Hän tulee tänne pian. Haluatko kysyä minulta kysymyksiä Elisasta odottaessasi?", language: language}
        }
        await sendAIMessage(message[language])
        setCheckinState(2)
        return message[language].content
      default:
        return
    }
  }

  const onTalk = async (lang) => {
    if (checkinState < 2) {
      const recognizedText = await fromDefaultMicrophone(lang)
      const response = await handleCheckin(recognizedText)
      setConvetsation([...conversation, {sender: "human", content: recognizedText}, {sender: "ai", content: response}])
    } else {
      const recognizedText = await fromDefaultMicrophone(lang)
      const response = await sendUserMessage({content: recognizedText, language: language})
      setConvetsation([...conversation, {sender: "human", content: recognizedText}, {sender: "ai", content: response.data.response_text}])
    }
  }

  const onSend = async (text) => {
    if (checkinState < 2) {
      const response =  await handleCheckin(text)
      setConvetsation([...conversation, {sender: "human", content: text}, {sender: "ai", content: response}])
    } else {
      const response = await sendUserMessage({content: text, language: language})
      setConvetsation([...conversation, {sender: "human", content: text}, {sender: "ai", content: response.data.response_text}])
    }
  }

  const onReset = () => {
    setIsSessionStart(false)
    setCheckinState(0)
    setVisitorName("")
    setConvetsation([])
    removeStream()
  }

  const onStart = async () => {
    setIsSessionStart(true)
    await addStream()
    const openingMessage = {
      "en-US" : {content: "Hello! Welcome to Elisa. Can I know your name, please?", gesture: "Welcome", language: language},
      "fi-FI" : {content: "Hei! Tervetuloa Elisaan. Voinko tietää nimesi, kiitos?", gesture: "Welcome", language: language}
    }
    sendAIMessage(openingMessage[language])
    setConvetsation([...conversation, {sender: "ai", content: openingMessage[language].content}])
  }

  return (
    <div className="App">
      <Container>
        <Header setLanguage={(langCode) => {setLanguage(langCode)}}/>
        {isSessionStart ? <div style={{display: "flex", flexFlow: "row"}}> 
          <Section containerStyle={{display: "flex", justifyContent: "space-between", flexFlow: "column"}}>
            <section id="capture">
              <span className="client-id" style={{display: 'none' }}>none</span>
            </section>
            <section style={{width: "100%", height: "100%", display: "flex", alignItems:"center"}}>
              <div id="remote-streams">
                  <div className="video">
                      <video style={{width: "100%", height: "100%", margin: "20px 0px"}}></video>
                  </div> 
              </div>
            </section>
            <img style={{width: "144px", height: "64px"}} src={logo} alt="logo" />
          </Section>
          <Section>
            <ConversationBox conversation={conversation} onSend={onSend} onTalk={() => onTalk(language)} onReset={onReset}/>
          </Section>
        </div> : <StartScreen onStart={onStart}/>}
        
      </Container>
    </div>
  );
}

export default App;
