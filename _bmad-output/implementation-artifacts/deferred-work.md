
- source_spec: `spec-feedback-corrections.md`
  summary: Strengthen generic snapshot completeness and known-season calendar validation.
  evidence: Blind3/4: checksummed but manually truncated envelopes can satisfy structural validation; current actual calendars are intact.

- source_spec: `spec-feedback-corrections.md`
  summary: Validate media image decoding at export time.
  evidence: Blind6: existence alone does not reject corrupt files; current release images all decode in runtime tests.

- source_spec: `spec-feedback-corrections.md`
  summary: Stage and clean the isolated source allowlist before promotion.
  evidence: Blind7/8: overlay can retain deleted source and failure can interrupt scratch checkout preparation; current source uses retained paths.

- source_spec: `spec-feedback-corrections.md`
  summary: Retain progress metrics independently per category.
  evidence: Blind10: graphMetric is shared; changing constructor metric replaces driver metric.

- source_spec: `spec-feedback-corrections.md`
  summary: Bound bundled fetch requests so retry becomes available after a hung connection.
  evidence: Edge1: existing json fetch has no timeout.
