#include <array>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <stdexcept>
#include <string>

/*
  MiseOS personalized matrix metric.

  This is a local wallet-side risk signal, not an authorization decision by itself.
  Wallet UX should combine this score with user display, domain checks, chain checks,
  and explicit approval for high-risk actions.
*/

struct MetricInput {
  double permissionBreadth;
  double valueExposure;
  double timeExposure;
  double targetTrust;
  double domainReputation;
  double userFamiliarity;
};

static double clamp01(double value) {
  if (!std::isfinite(value)) return 0.0;
  if (value < 0.0) return 0.0;
  if (value > 1.0) return 1.0;
  return value;
}

struct MetricResult {
  double score;
  std::string band;
  bool requiresHumanApproval;
};

MetricResult score_mise_permission_metric(const MetricInput& input) {
  const std::array<double, 6> vector = {
    clamp01(input.permissionBreadth),
    clamp01(input.valueExposure),
    clamp01(input.timeExposure),
    1.0 - clamp01(input.targetTrust),
    1.0 - clamp01(input.domainReputation),
    1.0 - clamp01(input.userFamiliarity),
  };

  const std::array<double, 6> weights = {0.24, 0.22, 0.18, 0.14, 0.14, 0.08};

  double score = 0.0;
  for (std::size_t i = 0; i < vector.size(); ++i) {
    score += vector[i] * weights[i];
  }
  score = clamp01(score);

  std::string band = "low";
  if (score >= 0.82) band = "critical";
  else if (score >= 0.62) band = "high";
  else if (score >= 0.36) band = "medium";

  return MetricResult{
    score,
    band,
    score >= 0.62
  };
}

int main(int argc, char** argv) {
  if (argc != 7) {
    std::cerr << "Usage: mise_permission_metric <permissionBreadth> <valueExposure> <timeExposure> <targetTrust> <domainReputation> <userFamiliarity>\n";
    return 2;
  }

  try {
    MetricInput input{
      std::stod(argv[1]),
      std::stod(argv[2]),
      std::stod(argv[3]),
      std::stod(argv[4]),
      std::stod(argv[5]),
      std::stod(argv[6]),
    };

    MetricResult result = score_mise_permission_metric(input);
    std::cout << "{"
              << "\"score\":" << std::fixed << std::setprecision(6) << result.score << ","
              << "\"band\":\"" << result.band << "\","
              << "\"requiresHumanApproval\":" << (result.requiresHumanApproval ? "true" : "false")
              << "}\n";
    return 0;
  } catch (const std::exception& ex) {
    std::cerr << "metric error: " << ex.what() << "\n";
    return 1;
  }
}
