import SwiftUI

struct ContentView: View {
    @StateObject private var bridge = AuroraBridge()
    @StateObject private var speech = SpeechCommandController()
    @StateObject private var classifier = AuroraIntentClassifier()

    private let lumerieClient: LumerieClient = MockLumerieClient()

    var body: some View {
        VStack(spacing: 0) {
            AuroraCanvasView(bridge: bridge, lumerieClient: lumerieClient)
                .overlay(alignment: .topLeading) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Neural Aurora Field").font(.headline)
                        Text(bridge.statusText).font(.caption).foregroundStyle(.secondary)
                    }
                    .padding(10).background(.ultraThinMaterial).clipShape(RoundedRectangle(cornerRadius: 12)).padding()
                    .accessibilityElement(children: .combine)
                }
            controlBar
        }
        .ignoresSafeArea(edges: .top)
        .onChange(of: speech.lastTranscript) { _, newValue in
            let command = classifier.command(for: newValue)
            bridge.sendCommand(command)
            Task {
                try? await lumerieClient.send(AuroraDeviceCommand(name: command, payload: ["source": "speech", "rawTranscript": newValue]))
            }
        }
        .task { try? await lumerieClient.connect() }
    }

    private var controlBar: some View {
        VStack(spacing: 10) {
            HStack {
                Button(speech.isRecording ? "Stop Voice" : "Start Voice") { speech.isRecording ? speech.stop() : speech.start() }.buttonStyle(.borderedProminent)
                Button("Calm") { bridge.sendCommand("calm slower") }.buttonStyle(.bordered)
                Button("More") { bridge.sendCommand("more particles") }.buttonStyle(.bordered)
                Button("Reset") { bridge.sendCommand("reset") }.buttonStyle(.bordered)
            }
            Text(speech.lastTranscript.isEmpty ? "Say: “faster”, “calm”, “more particles”, “blue”, “pink”, or “reset”." : speech.lastTranscript)
                .font(.caption).foregroundStyle(.secondary).lineLimit(2).padding(.horizontal)
        }
        .padding().background(.thinMaterial)
    }
}
