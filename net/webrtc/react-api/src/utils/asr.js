import sdk from "microsoft-cognitiveservices-speech-sdk"

export async function fromDefaultMicrophone() {
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    const speechConfig = sdk.SpeechConfig.fromSubscription("db5204f3575f43b2b0de8d9aa4ea5d3c", "northeurope");
    speechConfig.speechRecognitionLanguage = "en-US";
    let audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    let outputText = "";
    const result = await recognize(speechRecognizer);

    switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
                outputText = `RECOGNIZED: Text=${result.text}`;
                break;
            case sdk.ResultReason.NoMatch:  
                outputText = "NOMATCH: Speech could not be recognized.";
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