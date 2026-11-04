import SwiftUI
import WebKit

final class AuroraBridge: ObservableObject {
    weak var webView: WKWebView?
    @Published var statusText: String = "Waiting for canvas metrics…"

    func attach(webView: WKWebView) { self.webView = webView }

    func sendCommand(_ command: String) {
        guard !command.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        let escaped = command.replacingOccurrences(of: "\\", with: "\\\\").replacingOccurrences(of: "'", with: "\\'")
        webView?.evaluateJavaScript("window.applyAuroraCommand('\(escaped)')")
    }

    @MainActor
    func updateStatus(from payload: [String: Any]) {
        if let type = payload["type"] as? String, type == "metrics" {
            let fps = payload["fps"] as? Double ?? 0
            let particles = payload["particles"] as? Int ?? 0
            statusText = "\(particles) particles · \(String(format: "%.1f", fps)) fps"
        } else if let command = payload["command"] as? String {
            statusText = "Applied: \(command)"
        }
    }
}

struct AuroraCanvasView: UIViewRepresentable {
    @ObservedObject var bridge: AuroraBridge
    let lumerieClient: LumerieClient

    func makeCoordinator() -> Coordinator { Coordinator(bridge: bridge, lumerieClient: lumerieClient) }

    func makeUIView(context: Context) -> WKWebView {
        let userContentController = WKUserContentController()
        userContentController.add(context.coordinator, name: "aurora")
        let configuration = WKWebViewConfiguration()
        configuration.userContentController = userContentController
        configuration.allowsInlineMediaPlayback = true
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.isOpaque = false
        webView.backgroundColor = .black
        webView.scrollView.isScrollEnabled = false
        bridge.attach(webView: webView)
        guard let url = Bundle.main.url(forResource: "aurora", withExtension: "html", subdirectory: "Web") else {
            webView.loadHTMLString("<h1 style='color:white'>Missing Web/aurora.html</h1>", baseURL: nil)
            return webView
        }
        webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    final class Coordinator: NSObject, WKScriptMessageHandler {
        private let bridge: AuroraBridge
        private let lumerieClient: LumerieClient
        init(bridge: AuroraBridge, lumerieClient: LumerieClient) { self.bridge = bridge; self.lumerieClient = lumerieClient }
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            guard message.name == "aurora", let payload = message.body as? [String: Any] else { return }
            Task { @MainActor in bridge.updateStatus(from: payload) }
            if let type = payload["type"] as? String, type == "command-applied" {
                let name = payload["command"] as? String ?? "unknown"
                Task { try? await lumerieClient.send(AuroraDeviceCommand(name: name, payload: payload)) }
            }
        }
    }
}
