import AVFoundation
import Speech
import SwiftUI

final class SpeechCommandController: NSObject, ObservableObject {
    @Published var isRecording = false
    @Published var lastTranscript = ""
    private let recognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    private let audioEngine = AVAudioEngine()
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?

    func start() {
        Task {
            let authorized = await requestPermissions()
            guard authorized else { return }
            await MainActor.run {
                do { try self.startRecording() } catch { self.lastTranscript = "Speech error: \(error.localizedDescription)"; self.isRecording = false }
            }
        }
    }

    func stop() {
        audioEngine.stop(); audioEngine.inputNode.removeTap(onBus: 0); recognitionRequest?.endAudio(); recognitionTask?.cancel(); recognitionRequest = nil; recognitionTask = nil; isRecording = false
    }

    private func requestPermissions() async -> Bool {
        let speechAllowed = await withCheckedContinuation { continuation in SFSpeechRecognizer.requestAuthorization { continuation.resume(returning: $0 == .authorized) } }
        let micAllowed = await withCheckedContinuation { continuation in AVAudioSession.sharedInstance().requestRecordPermission { continuation.resume(returning: $0) } }
        return speechAllowed && micAllowed
    }

    private func startRecording() throws {
        recognitionTask?.cancel(); recognitionTask = nil
        let session = AVAudioSession.sharedInstance()
        try session.setCategory(.record, mode: .measurement, options: [.duckOthers])
        try session.setActive(true, options: .notifyOthersOnDeactivation)
        let request = SFSpeechAudioBufferRecognitionRequest(); request.shouldReportPartialResults = true; recognitionRequest = request
        guard let recognizer, recognizer.isAvailable else { lastTranscript = "Speech recognizer unavailable."; return }
        let inputNode = audioEngine.inputNode; let recordingFormat = inputNode.outputFormat(forBus: 0)
        inputNode.removeTap(onBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, _ in request.append(buffer) }
        audioEngine.prepare(); try audioEngine.start(); isRecording = true
        recognitionTask = recognizer.recognitionTask(with: request) { [weak self] result, error in
            guard let self else { return }
            if let result { DispatchQueue.main.async { self.lastTranscript = result.bestTranscription.formattedString } }
            if error != nil || result?.isFinal == true { DispatchQueue.main.async { self.stop() } }
        }
    }
}
