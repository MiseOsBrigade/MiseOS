# MiseOS LangSmith Observability

This directory provides an optional, provider-neutral tracing boundary for MiseOS LLM workflows.

## Install

```bash
python -m pip install -r requirements-langsmith.txt
```

Configure tracing in the runtime environment:

```bash
export LANGSMITH_API_KEY="..."
export LANGSMITH_TRACING="true"
export LANGSMITH_PROJECT="miseos"
```

Never commit a LangSmith API key. `.env.langsmith.example` is a template only.

## Use

Inject the project's actual model/provider request into the pipeline:

```python
from observability import run_pipeline


def request(messages):
    # Call the project's approved LLM provider here.
    ...

result = run_pipeline("foo", request)
```

The trace hierarchy is:

```text
run_pipeline
├── format_prompt
├── invoke_llm [run_type=llm]
└── parse_output
```

The adapter deliberately does not hard-code an LLM provider, model, endpoint, or credential. This keeps the tracing layer reusable across MiseOS agents and services.

## Failure behavior

Tracing is opt-in but fail-closed when this pipeline is explicitly invoked: if the `langsmith` package or `LANGSMITH_API_KEY` is missing, a `LangSmithConfigurationError` is raised. Existing non-LLM repository tooling is unaffected because this module is not imported by the static build path.
