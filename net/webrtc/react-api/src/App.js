import './App.css';
import { useRef, useEffect, useState } from 'react';
import { fromDefaultMicrophone } from "./utils/asr.js"
import { fetchHostData } from "./api/api.js"
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
  const [conversation, setConvetsation] = useState([
    {sender: "ai", content: "Hello would you like to check in as a guest or would you like to discuss something else?"},
    {sender: "human", content: "I'd like to checkin"}
  ])

  // useEffect(async () => {
  //   const response = await fetchHostData()
  //   setHostData(response)
  // }, [])

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
          signalingServerUrl: `ws://127.0.0.1:8443`,
        };
        
        const api = new window.GstWebRTCAPI(gstWebRTCConfig);
        initCapture(api);
        initRemoteStreams(api);
      }
    }
  }, [isSessionStart]);

  return (
    <div className="App">
      <Container>
        <Header/>
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
            <ConversationBox conversation={conversation} onSend={() => {}} onTalk={() => {}} onReset={() => {setIsSessionStart(false)}}/>
          </Section>
        </div> : <StartScreen onStart={() => {setIsSessionStart(true)}}/>}
        
      </Container>
    </div>
  );
}

export default App;
