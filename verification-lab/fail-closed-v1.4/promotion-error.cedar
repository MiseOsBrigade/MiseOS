// Deliberately erroring forbid: Claim entities in the fixture do not have
// the `diagnostic_guard` attribute. Cedar skip-on-error should ignore this
// policy while the permit below can still produce ALLOW. The application
// wrapper must therefore reject the authorization response when diagnostics
// contain the error.

@id("erroring_forbid")
forbid (
    principal,
    action == Action::"promote",
    resource
)
when {
    resource.diagnostic_guard == true
};

@id("pass_permit")
permit (
    principal,
    action == Action::"promote",
    resource
)
when {
    resource.evaluation_status == "pass"
    && resource.requirements_satisfied
};
