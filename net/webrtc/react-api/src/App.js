import './App.css';
import { useRef, useEffect, useState } from 'react';
import {fromDefaultMicrophone} from "./utils/asr.js"
import {fetchHostData} from "./api/api.js"

function initCapture(api) {
  console.log("init capture")
  const captureSection = document.getElementById("capture");
  const clientIdElement = captureSection.querySelector(".client-id");

  const listener = {
    connected: function(clientId) { clientIdElement.textContent = clientId; },
    disconnected: function() { clientIdElement.textContent = "none"; }
  };
  console.log(listener)
  api.registerConnectionListener(listener);
}

function initRemoteStreams(api) {
  const remoteStreamsElement = document.getElementById("remote-streams");
  const listener = {
    producerAdded: function(producer) {
      const producerId = producer.id
      if (!document.getElementById(producerId)) {
        remoteStreamsElement.insertAdjacentHTML("beforeend",
          `<div id="${producerId}">
                            <div class="button">Connect</div>
                            <div class="video">
                                <video></video>
                            </div>
                        </div>`);

        const entryElement = document.getElementById(producerId);
        const videoElement = entryElement.getElementsByTagName("video")[0];

        videoElement.addEventListener("playing", () => {
          if (entryElement.classList.contains("has-session")) {
            entryElement.classList.add("streaming");
          }
        });

        
        entryElement.addEventListener("click", (event) => {
          event.preventDefault();
          if (!event.target.classList.contains("button")) {
            return;
          }

          if (entryElement._consumerSession) {
            entryElement._consumerSession.close();
          } else {
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
        });
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
  const mounted = useRef();
  const [recognizedText, setText] = useState("Button")
  const [hostData, setHostData] = useState([])
  const [checkinState, setCheckinState] = useState(0)

  useEffect(async () => {
    const response = await fetchHostData()
    setHostData(response)
  }, [])


  useEffect(() => {
    if (!mounted.current) {
      if (typeof window !== "undefined") {
        const gstWebRTCConfig = {
          meta: { name: `WebClient-${Date.now()}` },
          signalingServerUrl: `ws://127.0.0.1:8443`,
        };
        
        const api = new window.GstWebRTCAPI(gstWebRTCConfig);
        initCapture(api);
        initRemoteStreams(api);
      }
    } else {

    }
  });


  return (
    <div className="App">
      <main>
      <section id="capture">
        <span className="client-id" style={{display: 'none' }}>none</span>
      </section>
      <section style={{width: 720, height: 480}}>
        <div id="remote-streams"></div>
        <button onClick={async () => {
          const recognizedText = await fromDefaultMicrophone()
          setText(recognizedText)
          }}>
            Checkin
        </button>
        <button onClick={async () => {
          const recognizedText = await fromDefaultMicrophone()
          setText(recognizedText)
          }}>
            You can ask anything about Elisa
        </button>
      </section>
      </main>
    </div>
  );
}

export default App;
