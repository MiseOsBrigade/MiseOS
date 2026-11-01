variable "project_id" {
  type = string
}

variable "region" {
  type    = string
  default = "us-central1"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "public_base_url" {
  type        = string
  description = "Public CDN or metadata host without a trailing slash."
}

variable "contract_address" {
  type        = string
  description = "Lazy-mint contract address."
}

variable "chain_id" {
  type    = number
  default = 84532
}

variable "allow_public_api" {
  type    = bool
  default = false
}

variable "enable_vision" {
  type    = bool
  default = true
}

variable "github_repository" {
  type        = string
  description = "GitHub repository in owner/name form for Workload Identity Federation."
}
