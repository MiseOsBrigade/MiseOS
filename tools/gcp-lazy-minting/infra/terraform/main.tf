provider "google" {
  project = var.project_id
  region  = var.region
}

locals {
  prefix = "miseos-${var.environment}"
  apis = toset([
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "eventarc.googleapis.com",
    "iamcredentials.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "storage.googleapis.com",
    "vision.googleapis.com"
  ])
}

resource "google_project_service" "required" {
  for_each           = local.apis
  service            = each.value
  disable_on_destroy = false
}

resource "google_storage_bucket" "source" {
  name                        = "${local.prefix}-source"
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  versioning { enabled = true }
  lifecycle_rule {
    condition { age = 30 }
    action { type = "SetStorageClass" storage_class = "NEARLINE" }
  }
  depends_on = [google_project_service.required]
}

resource "google_storage_bucket" "public" {
  name                        = "${local.prefix}-public"
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "inherited"
  versioning { enabled = true }
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["Content-Type", "ETag", "Cache-Control"]
    max_age_seconds = 3600
  }
  depends_on = [google_project_service.required]
}

resource "google_storage_bucket" "audit" {
  name                        = "${local.prefix}-audit"
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  versioning { enabled = true }
  retention_policy {
    retention_period = 31536000
  }
  depends_on = [google_project_service.required]
}

resource "google_artifact_registry_repository" "services" {
  location      = var.region
  repository_id = "${local.prefix}-services"
  format        = "DOCKER"
  depends_on    = [google_project_service.required]
}

resource "google_service_account" "metadata_worker" {
  account_id   = "${local.prefix}-metadata"
  display_name = "MiseOS metadata worker"
}

resource "google_service_account" "metadata_api" {
  account_id   = "${local.prefix}-mint-api"
  display_name = "MiseOS metadata and voucher API"
}

resource "google_storage_bucket_iam_member" "worker_source_reader" {
  bucket = google_storage_bucket.source.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_service_account.metadata_worker.email}"
}

resource "google_storage_bucket_iam_member" "worker_source_writer" {
  bucket = google_storage_bucket.source.name
  role   = "roles/storage.objectCreator"
  member = "serviceAccount:${google_service_account.metadata_worker.email}"
}

resource "google_storage_bucket_iam_member" "worker_public_admin" {
  bucket = google_storage_bucket.public.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.metadata_worker.email}"
}

resource "google_storage_bucket_iam_member" "worker_audit_creator" {
  bucket = google_storage_bucket.audit.name
  role   = "roles/storage.objectCreator"
  member = "serviceAccount:${google_service_account.metadata_worker.email}"
}

resource "google_project_iam_member" "worker_vision" {
  project = var.project_id
  role    = "roles/serviceusage.serviceUsageConsumer"
  member  = "serviceAccount:${google_service_account.metadata_worker.email}"
}

resource "google_storage_bucket_iam_member" "api_public_reader" {
  bucket = google_storage_bucket.public.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_service_account.metadata_api.email}"
}

resource "google_storage_bucket_iam_member" "api_audit_creator" {
  bucket = google_storage_bucket.audit.name
  role   = "roles/storage.objectCreator"
  member = "serviceAccount:${google_service_account.metadata_api.email}"
}

resource "google_secret_manager_secret" "signer" {
  secret_id = "miseos-lazy-mint-signer"
  replication { auto {} }
  depends_on = [google_project_service.required]
}

resource "google_secret_manager_secret_iam_member" "api_signer_access" {
  secret_id = google_secret_manager_secret.signer.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.metadata_api.email}"
}

# Container images are built and deployed by the GitHub workflow.
resource "google_cloud_run_v2_service" "metadata_worker" {
  name     = "${local.prefix}-metadata-worker"
  location = var.region

  template {
    service_account = google_service_account.metadata_worker.email
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.services.repository_id}/metadata-worker:bootstrap"
      env { name = "SOURCE_BUCKET" value = google_storage_bucket.source.name }
      env { name = "PUBLIC_BUCKET" value = google_storage_bucket.public.name }
      env { name = "AUDIT_BUCKET" value = google_storage_bucket.audit.name }
      env { name = "PUBLIC_BASE_URL" value = var.public_base_url }
      env { name = "VISION_ENABLED" value = tostring(var.enable_vision) }
    }
  }
  deletion_protection = false
  depends_on = [google_project_service.required]
}

resource "google_cloud_run_v2_service" "metadata_api" {
  name     = "${local.prefix}-metadata-api"
  location = var.region

  template {
    service_account = google_service_account.metadata_api.email
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.services.repository_id}/metadata-api:bootstrap"
      env { name = "PUBLIC_BUCKET" value = google_storage_bucket.public.name }
      env { name = "AUDIT_BUCKET" value = google_storage_bucket.audit.name }
      env { name = "PUBLIC_BASE_URL" value = var.public_base_url }
      env { name = "CONTRACT_ADDRESS" value = var.contract_address }
      env { name = "CHAIN_ID" value = tostring(var.chain_id) }
      env { name = "SIGNER_SECRET" value = google_secret_manager_secret.signer.secret_id }
    }
  }
  deletion_protection = false
  depends_on = [google_project_service.required]
}

resource "google_eventarc_trigger" "image_uploaded" {
  name     = "${local.prefix}-image-uploaded"
  location = var.region

  matching_criteria {
    attribute = "type"
    value     = "google.cloud.storage.object.v1.finalized"
  }
  matching_criteria {
    attribute = "bucket"
    value     = google_storage_bucket.source.name
  }

  destination {
    cloud_run_service {
      service = google_cloud_run_v2_service.metadata_worker.name
      region  = var.region
      path    = "/"
    }
  }

  service_account = google_service_account.metadata_worker.email
  depends_on      = [google_project_service.required]
}

resource "google_cloud_run_service_iam_member" "public_api" {
  count    = var.allow_public_api ? 1 : 0
  location = google_cloud_run_v2_service.metadata_api.location
  service  = google_cloud_run_v2_service.metadata_api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
