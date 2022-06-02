{{/*
Expand the name of the chart.
*/}}
{{- define "books-store.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "books-store.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "books-store.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "books-store.labels" -}}
helm.sh/chart: {{ include "books-store.chart" . }}
{{ include "books-store.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "books-store.selectorLabels" -}}
app.kubernetes.io/name: {{ include "books-store.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "books-store.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "books-store.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{- define "books-store.ingress.paths" -}}
paths:
  - path: /?(.*)
    pathType: Prefix
    backend:
      service:
        name: {{ .Values.frontend.service.name }}
        port:
          number: {{ .Values.frontend.service.port }}
  - path: /api?(.*)
    pathType: Prefix
    backend:
      service:
        name: {{ .Values.backend.service.name }}
        port:
          number: {{ .Values.backend.service.port }}
{{- end }}