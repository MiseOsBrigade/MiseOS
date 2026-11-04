import CoreML
import Foundation

@MainActor
final class AuroraIntentClassifier: ObservableObject {
    private let model: MLModel?
    init() {
        if let url = Bundle.main.url(forResource: "AuroraIntent", withExtension: "mlmodelc") { model = try? MLModel(contentsOf: url) } else { model = nil }
    }
    func command(for transcript: String) -> String {
        let trimmed = transcript.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return "" }
        if let mlCommand = predictWithCoreML(text: trimmed) { return mlCommand }
        return fallbackCommand(text: trimmed)
    }
    private func predictWithCoreML(text: String) -> String? {
        guard let model else { return nil }
        do {
            let input = try MLDictionaryFeatureProvider(dictionary: ["text": text as NSString])
            let output = try model.prediction(from: input)
            if let label = output.featureValue(for: "label")?.stringValue { return label }
        } catch { return nil }
        return nil
    }
    private func fallbackCommand(text: String) -> String {
        let lower = text.lowercased()
        if lower.contains("pause") { return "pause" }
        if lower.contains("resume") || lower.contains("play") { return "resume" }
        if lower.contains("faster") { return "faster" }
        if lower.contains("slower") || lower.contains("calm") { return "calm slower" }
        if lower.contains("more") { return "more particles" }
        if lower.contains("less") || lower.contains("fewer") { return "less particles" }
        if lower.contains("blue") { return "blue" }
        if lower.contains("green") { return "green" }
        if lower.contains("pink") || lower.contains("rose") { return "pink" }
        if lower.contains("reset") { return "reset" }
        return text
    }
}
