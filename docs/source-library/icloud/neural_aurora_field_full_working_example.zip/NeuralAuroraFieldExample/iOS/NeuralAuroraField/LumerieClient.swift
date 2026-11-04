import Foundation

struct AuroraDeviceCommand: Codable {
    let name: String
    let payload: [String: AnyCodable]
    init(name: String, payload: [String: Any]) { self.name = name; self.payload = payload.mapValues { AnyCodable($0) } }
}

protocol LumerieClient {
    func connect() async throws
    func send(_ command: AuroraDeviceCommand) async throws
}

final class MockLumerieClient: LumerieClient {
    func connect() async throws { print("[Lumerie mock] connected") }
    func send(_ command: AuroraDeviceCommand) async throws { print("[Lumerie mock] command:", command.name) }
}

final class HTTPLumerieClient: LumerieClient {
    private let endpoint: URL
    private let tokenProvider: () -> String?
    init(endpoint: URL, tokenProvider: @escaping () -> String?) { self.endpoint = endpoint; self.tokenProvider = tokenProvider }
    func connect() async throws {}
    func send(_ command: AuroraDeviceCommand) async throws {
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        if let token = tokenProvider(), !token.isEmpty { request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization") }
        request.httpBody = try JSONEncoder().encode(command)
        let (_, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else { throw URLError(.badServerResponse) }
    }
}

struct AnyCodable: Codable {
    let value: Any
    init(_ value: Any) { self.value = value }
    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let value = try? container.decode(String.self) { self.value = value }
        else if let value = try? container.decode(Double.self) { self.value = value }
        else if let value = try? container.decode(Int.self) { self.value = value }
        else if let value = try? container.decode(Bool.self) { self.value = value }
        else { self.value = "" }
    }
    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch value { case let value as String: try container.encode(value); case let value as Double: try container.encode(value); case let value as Int: try container.encode(value); case let value as Bool: try container.encode(value); default: try container.encode(String(describing: value)) }
    }
}
