import sdk from "microsoft-cognitiveservices-speech-sdk"
import { SPEECH_KEY } from "./key.js";

export async function fromDefaultMicrophone(language_code) {
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, "northeurope");
    speechConfig.speechRecognitionLanguage = language_code;
    let audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    let outputText = "";
    const result = await recognize(speechRecognizer);

    switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
                outputText = `${result.text}`;
                break;
            case sdk.ResultReason.NoMatch:  
                outputText = "Speech could not be recognized.";
                break;
            case sdk.ResultReason.Canceled:
                const cancellation = sdk.CancellationDetails.fromResult(result);
                outputText = `CANCELED: Reason=${cancellation.reason}`;

                if (cancellation.reason === sdk.CancellationReason.Error) {
                    outputText = `CANCELED: ErrorCode=${cancellation.ErrorCode}`;
                    outputText = `CANCELED: ErrorDetails=${cancellation.errorDetails}`;
                    outputText = "CANCELED: Did you set the speech resource key and region values?";
                }
                break;
   }

   speechRecognizer.close();
   return outputText;
}

async function recognize(speechRecognizer) {
    return new Promise(function(resolve, reject) {
        speechRecognizer.recognizeOnceAsync(result => {
            resolve(result);
        }, err => {
            reject(err);
        });
    })
}