output "source_bucket" {
  value = google_storage_bucket.source.name
}

output "public_bucket" {
  value = google_storage_bucket.public.name
}

output "audit_bucket" {
  value = google_storage_bucket.audit.name
}

output "metadata_api_url" {
  value = google_cloud_run_v2_service.metadata_api.uri
}

output "metadata_worker_url" {
  value = google_cloud_run_v2_service.metadata_worker.uri
}

output "workload_identity_provider" {
  value = google_iam_workload_identity_pool_provider.github.name
}

output "github_deployer_service_account" {
  value = google_service_account.github_deployer.email
}
